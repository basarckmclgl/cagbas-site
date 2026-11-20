function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

function htmlPage(title, message, success = false) {
  const safeTitle = String(title).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safeMessage = String(message).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  return new Response(`<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safeTitle} | ÇAĞBAŞ</title><body style="margin:0;background:#f5f4f8;color:#24212b;font:16px/1.6 Arial,sans-serif;display:grid;min-height:100vh;place-items:center"><main style="max-width:560px;margin:24px;padding:40px;background:#fff;border-radius:18px;box-shadow:0 12px 40px #21152a12;text-align:center"><div style="font-size:13px;letter-spacing:.2em;color:#7750a8;font-weight:bold">ÇAĞBAŞ CREATIVE STUDIO</div><h1 style="font-size:28px;margin:20px 0 10px">${safeTitle}</h1><p>${safeMessage}</p><a href="/" style="display:inline-block;margin-top:18px;padding:12px 22px;border-radius:8px;background:#7750a8;color:#fff;text-decoration:none">Ana sayfaya dön</a></main></body></html>`, {
    status: success ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
  });
}

function base64Utf8(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

function base64Url(value) {
  return base64Utf8(value).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/g, "");
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

async function sendVerificationEmail(env, email, verifyUrl) {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error("Gmail email credentials are not configured.");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: "refresh_token"
    })
  });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error("Gmail access token refresh failed: " + (tokenData.error || tokenResponse.status));
  }

  const sender = "cagbas.2026@gmail.com";
  const subject = "=?UTF-8?B?" + base64Utf8("ÇAĞBAŞ e-bülten aboneliğinizi doğrulayın") + "?=";
  const body = [
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
  ].join("\\r\\n");
  const mime = [
    "To: " + email,
    "From: ÇAĞBAŞ <" + sender + ">",
    "Subject: " + subject,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    base64Utf8(body)
  ].join("\\r\\n");
  const raw = base64Url(mime);

  const sendResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { "Authorization": "Bearer " + tokenData.access_token, "Content-Type": "application/json" },
    body: JSON.stringify({ raw })
  });
  if (!sendResponse.ok) {
    const detail = await sendResponse.text();
    throw new Error("Gmail send failed: " + sendResponse.status + " " + detail.slice(0, 300));
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "Abonelik sistemi henüz yapılandırılmadı." }, 503);
  if (!(request.headers.get("content-type") || "").includes("application/json")) return json({ error: "Geçersiz istek biçimi." }, 415);

  let data;
  try { data = await request.json(); }
  catch { return json({ error: "Gönderilen bilgiler okunamadı." }, 400); }

  const email = String(data.email || "").trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
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

export async function onRequestGet({ request, env }) {
  if (!env.DB) return htmlPage("Sistem kullanılamıyor", "Abonelik doğrulama sistemi şu anda hizmet veremiyor.");
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!/^[a-f0-9]{64}$/.test(token)) return htmlPage("Bağlantı geçersiz", "Doğrulama bağlantısı eksik veya geçersiz.");

  try {
    const tokenHash = await sha256(token);
    const subscriber = await env.DB.prepare(
      "SELECT id, verification_expires_at FROM newsletter_subscribers WHERE verification_token_hash = ? AND status = 'pending'"
    ).bind(tokenHash).first();

    if (!subscriber) return htmlPage("Bağlantı geçersiz", "Bu doğrulama bağlantısı kullanılmış, yenilenmiş veya geçersiz olabilir.");
    if (!subscriber.verification_expires_at || new Date(subscriber.verification_expires_at).getTime() < Date.now()) {
      await env.DB.prepare("UPDATE newsletter_subscribers SET verification_token_hash = NULL, verification_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(subscriber.id).run();
      return htmlPage("Bağlantının süresi dolmuş", "Doğrulama bağlantısının süresi 24 saat sonunda doldu. Web sitesinden yeniden abonelik talebi oluşturabilirsiniz.");
    }

    await env.DB.prepare(
      "UPDATE newsletter_subscribers SET status = 'active', verified_at = CURRENT_TIMESTAMP, verification_token_hash = NULL, verification_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'"
    ).bind(subscriber.id).run();

    return htmlPage("Aboneliğiniz doğrulandı", "Teşekkür ederiz. E-bülten aboneliğiniz başarıyla etkinleştirildi.", true);
  } catch (error) {
    console.error("Newsletter verification error:", error);
    return htmlPage("Bir hata oluştu", "Doğrulama işlemi tamamlanamadı. Lütfen daha sonra tekrar deneyin.");
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { "Allow": "GET, POST, OPTIONS" } });
}
