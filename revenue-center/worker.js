const SESSION_COOKIE = "rc_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const PBKDF2_ITERATIONS = 310000;

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...extraHeaders
    }
  });
}

function base64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return base64(new Uint8Array(digest));
}

async function derivePassword(password, salt) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    material,
    256
  );
  return base64(new Uint8Array(bits));
}

function equalText(a, b) {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) diff |= (left[i] || 0) ^ (right[i] || 0);
  return diff === 0;
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const pair = header.split(";").map(v => v.trim()).find(v => v.startsWith(name + "="));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
}

function cookie(value, maxAge) {
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

function clearCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

function sameOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  return new URL(origin).origin === new URL(request.url).origin;
}

async function readJson(request) {
  if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
    throw new Error("JSON_CONTENT_TYPE_REQUIRED");
  }
  return await request.json();
}

async function getSession(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token || token.length < 40) return null;
  const tokenHash = await sha256(token);
  const row = await env.DB.prepare(
    `SELECT u.id, u.email, u.role, u.status, s.id AS session_id
     FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ? AND u.status = 'active'
     LIMIT 1`
  ).bind(tokenHash, new Date().toISOString()).first();
  if (!row) return null;
  await env.DB.prepare("UPDATE admin_sessions SET last_seen_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), row.session_id).run();
  return row;
}

async function requireSession(request, env) {
  return await getSession(request, env);
}

async function setup(request, env) {
  if (!env.BOOTSTRAP_SECRET || env.BOOTSTRAP_SECRET.length < 32) {
    return json({ error: "SETUP_NOT_CONFIGURED" }, 503);
  }
  const supplied = request.headers.get("X-Setup-Key") || "";
  const [expectedHash, suppliedHash] = await Promise.all([
    sha256(env.BOOTSTRAP_SECRET),
    sha256(supplied)
  ]);
  if (!equalText(expectedHash, suppliedHash)) return json({ error: "UNAUTHORIZED" }, 401);

  let body;
  try { body = await readJson(request); } catch { return json({ error: "INVALID_REQUEST" }, 400); }
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12 || password.length > 256) {
    return json({ error: "VALID_EMAIL_AND_PASSWORD_MIN_12_REQUIRED" }, 400);
  }

  const existing = await env.DB.prepare("SELECT COUNT(*) AS count FROM admin_users").first();
  if (Number(existing?.count || 0) !== 0) return json({ error: "SETUP_ALREADY_COMPLETED" }, 409);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await derivePassword(password, salt);
  const userId = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO admin_users (id,email,password_hash,password_salt,role,status) VALUES (?,?,?,?, 'owner','active')"
  ).bind(userId, email, passwordHash, base64(salt)).run();

  await env.DB.prepare(
    "INSERT INTO audit_logs (id,user_id,action,resource_type,resource_id) VALUES (?,?,?,?,?)"
  ).bind(crypto.randomUUID(), userId, "owner_account_created", "admin_user", userId).run();

  return json({ success: true, message: "OWNER_CREATED" }, 201);
}

async function login(request, env) {
  let body;
  try { body = await readJson(request); } catch { return json({ error: "INVALID_REQUEST" }, 400); }
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (email.length > 254 || password.length > 256) return json({ error: "INVALID_CREDENTIALS" }, 401);

  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM login_attempts WHERE email_key = ? AND attempted_at > datetime('now','-15 minutes') AND succeeded = 0"
  ).bind(email).first();
  if (Number(recent?.count || 0) >= 8) return json({ error: "TOO_MANY_ATTEMPTS" }, 429);

  const user = await env.DB.prepare(
    "SELECT id,email,password_hash,password_salt,role,status FROM admin_users WHERE email = ? LIMIT 1"
  ).bind(email).first();

  let valid = false;
  if (user && user.status === "active") {
    const candidate = await derivePassword(password, fromBase64(user.password_salt));
    valid = equalText(candidate, user.password_hash);
  }

  await env.DB.prepare(
    "INSERT INTO login_attempts (id,email_key,succeeded) VALUES (?,?,?)"
  ).bind(crypto.randomUUID(), email || "invalid", valid ? 1 : 0).run();

  if (!valid) return json({ error: "INVALID_CREDENTIALS" }, 401);

  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = base64(tokenBytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  await env.DB.prepare(
    "INSERT INTO admin_sessions (id,user_id,token_hash,expires_at) VALUES (?,?,?,?)"
  ).bind(crypto.randomUUID(), user.id, tokenHash, expiresAt).run();
  await env.DB.prepare("UPDATE admin_users SET last_login_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), user.id).run();
  await env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?")
    .bind(new Date().toISOString()).run();

  return json(
    { success: true, user: { email: user.email, role: user.role } },
    200,
    { "set-cookie": cookie(token, SESSION_TTL_SECONDS) }
  );
}

async function logout(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (token) {
    const tokenHash = await sha256(token);
    await env.DB.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").bind(tokenHash).run();
  }
  return json({ success: true }, 200, { "set-cookie": clearCookie() });
}

async function handle(request, env) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/")) return new Response("Not Found", { status: 404 });
  if (!sameOrigin(request)) return json({ error: "CROSS_ORIGIN_REQUEST_BLOCKED" }, 403);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "allow": "GET, POST, OPTIONS" } });

  if (url.pathname === "/api/setup" && request.method === "POST") return await setup(request, env);
  if (url.pathname === "/api/login" && request.method === "POST") return await login(request, env);
  if (url.pathname === "/api/logout" && request.method === "POST") return await logout(request, env);

  if (url.pathname === "/api/me" && request.method === "GET") {
    const session = await requireSession(request, env);
    if (!session) return json({ authenticated: false }, 401);
    return json({ authenticated: true, user: { email: session.email, role: session.role } });
  }

  if (url.pathname === "/api/summary" && request.method === "GET") {
    const session = await requireSession(request, env);
    if (!session) return json({ error: "UNAUTHENTICATED" }, 401);
    if (!["owner", "admin"].includes(session.role)) return json({ error: "FORBIDDEN" }, 403);

    const [revenue, sources, products, partners, sponsors, orders] = await Promise.all([
      env.DB.prepare(`SELECT COALESCE(SUM(CASE
        WHEN entry_type IN ('earning','commission') THEN amount_minor
        WHEN entry_type IN ('expense','refund') THEN -ABS(amount_minor)
        ELSE amount_minor END),0) AS total_minor
        FROM revenue_entries`).first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM revenue_sources WHERE status = 'active'").first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM digital_products WHERE status = 'active'").first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM partners WHERE status = 'active'").first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM sponsor_campaigns WHERE status IN ('scheduled','published')").first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM orders WHERE payment_status = 'paid'").first()
    ]);
    return json({
      revenueTotalMinor: Number(revenue?.total_minor || 0),
      activeSources: Number(sources?.count || 0),
      activeProducts: Number(products?.count || 0),
      activePartners: Number(partners?.count || 0),
      liveSponsorCampaigns: Number(sponsors?.count || 0),
      paidOrders: Number(orders?.count || 0)
    });
  }

  return json({ error: "NOT_FOUND" }, 404);
}

export default {
  async fetch(request, env) {
    if (!env.DB) return json({ error: "DATABASE_BINDING_MISSING" }, 503);
    try {
      return await handle(request, env);
    } catch {
      return json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  }
};
