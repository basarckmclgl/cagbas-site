function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

function base64Utf8(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

function base64Url(value) {
  return base64Utf8(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

async function sendVerificationEmail(env, email, verifyUrl) {
  if (!env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not configured.");
  }

  const senderEmail = env.BREVO_SENDER_EMAIL || "basarcekmecelioglu@cagbas.com";
  const senderName = env.BREVO_SENDER_NAME || "ÇAĞBAŞ Creative Studio";
  const subject = "ÇAĞBAŞ e-bülten aboneliğinizi doğrulayın";
  const htmlContent = `<!doctype html><html lang="tr"><body style="margin:0;padding:32px 16px;background:#f5f4f8;color:#24212b;font-family:Arial,sans-serif"><main style="max-width:560px;margin:0 auto;padding:36px;background:#fff;border-radius:16px"><p style="font-size:13px;letter-spacing:3px;color:#7750a8;font-weight:bold">ÇAĞBAŞ CREATIVE STUDIO</p><h1 style="font-size:25px;line-height:1.3">E-bülten aboneliğinizi doğrulayın</h1><p>Merhaba,</p><p>ÇAĞBAŞ e-bültenine abone olma talebinizi aldık. Aboneliğinizi etkinleştirmek için aşağıdaki bağlantıyı 24 saat içinde kullanın.</p><p style="margin:28px 0"><a href="${verifyUrl}" style="display:inline-block;padding:14px 22px;background:#7750a8;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">E-posta adresimi doğrula</a></p><p style="font-size:13px;color:#666">Buton çalışmazsa bu bağlantıyı tarayıcınıza kopyalayın:<br><a href="${verifyUrl}" style="color:#7750a8;word-break:break-all">${verifyUrl}</a></p><p style="font-size:13px;color:#777">Bu talebi siz oluşturmadıysanız e-postayı yok sayabilirsiniz.</p></main></body></html>`;
  const textContent = [
    "Merhaba,",
    "",
    "ÇAĞBAŞ e-bültenine abone olma talebinizi aldık.",
    "Aboneliğinizi etkinleştirmek için aşağıdaki bağlantıyı 24 saat içinde açın:",
    "",
    verifyUrl,
    "",
    "Bu talebi siz oluşturmadıysanız bu e-postayı yok sayabilirsiniz.",
    "",
    "ÇAĞBAŞ Creative Studio"
  ].join("\n");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": env.BREVO_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email }],
      subject,
      htmlContent,
      textContent,
      tags: ["cagbas-newsletter-verification"]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Brevo transactional email error:", response.status, detail.slice(0, 500));
    throw new Error("Brevo transactional email request failed: " + response.status);
  }

  const result = await response.json();
  if (!result.messageId) throw new Error("Brevo did not return a message ID.");
  return result.messageId;
}


async function enforceRequestSecurity(request, env, scope, limit, windowMs) {
  const origin = request.headers.get("origin");
  const allowedOrigins = new Set(["https://cagbas.com", "https://www.cagbas.com"]);
  if (origin && !allowedOrigins.has(origin)) {
    return { ok: false, status: 403, message: "Bu kaynaktan gelen isteğe izin verilmiyor." };
  }
  if ((request.headers.get("sec-fetch-site") || "").toLowerCase() === "cross-site") {
    return { ok: false, status: 403, message: "Çapraz site isteğine izin verilmiyor." };
  }
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(scope + ":" + ip));
  const key = scope + ":" + Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const result = await env.DB.prepare(
    "INSERT INTO api_rate_limits (rate_key, window_start, request_count) VALUES (?, ?, 1) ON CONFLICT(rate_key) DO UPDATE SET request_count = CASE WHEN api_rate_limits.window_start < excluded.window_start THEN 1 ELSE api_rate_limits.request_count + 1 END, window_start = CASE WHEN api_rate_limits.window_start < excluded.window_start THEN excluded.window_start ELSE api_rate_limits.window_start END RETURNING request_count"
  ).bind(key, windowStart).first();
  if (result && result.request_count > limit) {
    return { ok: false, status: 429, message: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin." };
  }
  if (Math.random() < 0.02) {
    await env.DB.prepare("DELETE FROM api_rate_limits WHERE window_start < ?").bind(now - 24 * 60 * 60 * 1000).run();
  }
  return { ok: true };
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "Abonelik sistemi henüz yapılandırılmadı." }, 503);
  const security = await enforceRequestSecurity(request, env, "newsletter", 3, 60 * 60 * 1000);
  if (!security.ok) return json({ error: security.message }, security.status);
  if (!(request.headers.get("content-type") || "").includes("application/json")) return json({ error: "Geçersiz istek biçimi." }, 415);

  let data;
  try { data = await request.json(); }
  catch { return json({ error: "Gönderilen bilgiler okunamadı." }, 400); }

  if (String(data.website || "").trim()) return json({ error: "Geçersiz form gönderimi." }, 400);

  const email = String(data.email || "").trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Lütfen geçerli bir e-posta adresi girin." }, 400);
  }
  if (data.marketingConsent !== true) return json({ error: "E-bülten gönderimi için onay gereklidir." }, 400);

  try {
    const existing = await env.DB.prepare("SELECT status FROM newsletter_subscribers WHERE email = ?").bind(email).first();
    if (existing?.status === "active") {
      return json({ success: true, status: "active", message: "Bu e-posta adresi e-bülten listemizde zaten kayıtlı." });
    }

    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    const token = Array.from(tokenBytes, byte => byte.toString(16).padStart(2, "0")).join("");
    const tokenHash = await sha256(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await env.DB.prepare(
      "INSERT INTO newsletter_subscribers (email, status, marketing_consent, consent_at, verification_token_hash, verification_expires_at, verified_at, unsubscribed_at) VALUES (?, 'pending', 1, CURRENT_TIMESTAMP, ?, ?, NULL, NULL) ON CONFLICT(email) DO UPDATE SET status = 'pending', marketing_consent = 1, consent_at = CURRENT_TIMESTAMP, verification_token_hash = excluded.verification_token_hash, verification_expires_at = excluded.verification_expires_at, verified_at = NULL, unsubscribed_at = NULL, updated_at = CURRENT_TIMESTAMP"
    ).bind(email, tokenHash, expiresAt).run();

    const verifyUrl = new URL("/api/newsletter/verify?token=" + encodeURIComponent(token), request.url).toString();
    await sendVerificationEmail(env, email, verifyUrl);

    return json({
      success: true,
      status: "pending",
      message: "Doğrulama bağlantısını e-posta adresinize gönderdik. Aboneliğinizi etkinleştirmek için 24 saat içinde bağlantıyı açın."
    }, 201);
  } catch (error) {
    console.error("Newsletter subscription or verification email error:", error);
    return json({ error: "Abonelik doğrulama e-postası şu anda gönderilemedi. Lütfen daha sonra tekrar deneyin." }, 503);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { "Allow": "GET, POST, OPTIONS" } });
}
