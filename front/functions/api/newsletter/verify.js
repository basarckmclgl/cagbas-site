function htmlPage(title, message, body = "", status = 200) {
  const escapeHtml = value => String(value).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return new Response(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(title)} | ÇAĞBAŞ</title></head><body style="margin:0;background:#f5f4f8;color:#24212b;font:16px/1.6 Arial,sans-serif;display:grid;min-height:100vh;place-items:center"><main style="max-width:560px;margin:24px;padding:40px;background:#fff;border-radius:18px;box-shadow:0 12px 40px #21152a12;text-align:center"><div style="font-size:13px;letter-spacing:.2em;color:#7750a8;font-weight:bold">ÇAĞBAŞ CREATIVE STUDIO</div><h1 style="font-size:28px;margin:20px 0 10px">${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>${body}<a href="/" style="display:inline-block;margin-top:18px;padding:12px 22px;border-radius:8px;background:#7750a8;color:#fff;text-decoration:none">Ana sayfaya dön</a></main></body></html>`, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store, max-age=0", "Referrer-Policy": "no-referrer" }
  });
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

function confirmationForm(token) {
  return '<form method="post" action="/api/newsletter/verify" style="margin-top:26px"><input type="hidden" name="token" value="' + token + '"><button type="submit" style="border:0;border-radius:8px;padding:14px 22px;background:#7750a8;color:#fff;font-weight:bold;font-size:15px;cursor:pointer">E-posta adresimi doğrula</button></form><p style="font-size:13px;color:#777;margin-top:18px">Aboneliğiniz, bu düğmeye bastığınızda etkinleştirilir.</p>';
}

async function findPendingSubscriber(env, token) {
  const tokenHash = await sha256(token);
  return env.DB.prepare(
    "SELECT id, verification_expires_at FROM newsletter_subscribers WHERE verification_token_hash = ? AND status = 'pending'"
  ).bind(tokenHash).first();
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return htmlPage("Sistem kullanılamıyor", "Abonelik doğrulama sistemi şu anda hizmet veremiyor.", "", 503);
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!/^[a-f0-9]{64}$/.test(token)) return htmlPage("Bağlantı geçersiz", "Doğrulama bağlantısı eksik veya geçersiz.", "", 400);

  try {
    const subscriber = await findPendingSubscriber(env, token);
    if (!subscriber) return htmlPage("Bağlantı geçersiz", "Bu bağlantı kullanılmış, yenilenmiş veya geçersiz olabilir.", "", 400);
    if (!subscriber.verification_expires_at || new Date(subscriber.verification_expires_at).getTime() < Date.now()) {
      await env.DB.prepare("UPDATE newsletter_subscribers SET verification_token_hash = NULL, verification_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'").bind(subscriber.id).run();
      return htmlPage("Bağlantının süresi dolmuş", "Doğrulama bağlantısının süresi 24 saat sonunda doldu. Web sitesinden yeniden abonelik talebi oluşturabilirsiniz.", "", 400);
    }

    // GET only displays confirmation. Email security scanners must not activate subscriptions.
    return htmlPage("E-posta doğrulaması", "E-bülten aboneliğinizi etkinleştirmek için aşağıdaki düğmeye basın.", confirmationForm(token));
  } catch (error) {
    console.error("Newsletter verification page error:", error);
    return htmlPage("Bir hata oluştu", "Doğrulama sayfası şu anda açılamadı. Lütfen daha sonra tekrar deneyin.", "", 500);
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return htmlPage("Sistem kullanılamıyor", "Abonelik doğrulama sistemi şu anda hizmet veremiyor.", "", 503);
  if ((request.headers.get("sec-fetch-site") || "").toLowerCase() === "cross-site") {
    return htmlPage("İstek reddedildi", "Çapraz site isteğine izin verilmiyor.", "", 403);
  }

  let form;
  try { form = await request.formData(); }
  catch { return htmlPage("Geçersiz istek", "Doğrulama bilgileri okunamadı.", "", 400); }
  const token = String(form.get("token") || "");
  if (!/^[a-f0-9]{64}$/.test(token)) return htmlPage("Bağlantı geçersiz", "Doğrulama bağlantısı eksik veya geçersiz.", "", 400);

  try {
    const subscriber = await findPendingSubscriber(env, token);
    if (!subscriber) return htmlPage("Bağlantı geçersiz", "Bu bağlantı kullanılmış, yenilenmiş veya geçersiz olabilir.", "", 400);
    if (!subscriber.verification_expires_at || new Date(subscriber.verification_expires_at).getTime() < Date.now()) {
      await env.DB.prepare("UPDATE newsletter_subscribers SET verification_token_hash = NULL, verification_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'").bind(subscriber.id).run();
      return htmlPage("Bağlantının süresi dolmuş", "Doğrulama bağlantısının süresi 24 saat sonunda doldu. Web sitesinden yeniden abonelik talebi oluşturabilirsiniz.", "", 400);
    }

    const result = await env.DB.prepare(
      "UPDATE newsletter_subscribers SET status = 'active', verified_at = CURRENT_TIMESTAMP, verification_token_hash = NULL, verification_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'"
    ).bind(subscriber.id).run();
    if (!result.meta || result.meta.changes !== 1) {
      return htmlPage("İşlem tamamlanamadı", "Abonelik durumu değişmedi. Lütfen yeni bir doğrulama bağlantısı isteyin.", "", 409);
    }
    return htmlPage("Aboneliğiniz doğrulandı", "Teşekkür ederiz. E-bülten aboneliğiniz başarıyla etkinleştirildi.");
  } catch (error) {
    console.error("Newsletter verification error:", error);
    return htmlPage("Bir hata oluştu", "Doğrulama işlemi tamamlanamadı. Lütfen daha sonra tekrar deneyin.", "", 500);
  }
}
