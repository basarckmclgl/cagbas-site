function htmlPage(title, message, success = false) {
  const escapeHtml = value => String(value).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return new Response(`<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} | ÇAĞBAŞ</title><body style="margin:0;background:#f5f4f8;color:#24212b;font:16px/1.6 Arial,sans-serif;display:grid;min-height:100vh;place-items:center"><main style="max-width:560px;margin:24px;padding:40px;background:#fff;border-radius:18px;box-shadow:0 12px 40px #21152a12;text-align:center"><div style="font-size:13px;letter-spacing:.2em;color:#7750a8;font-weight:bold">ÇAĞBAŞ CREATIVE STUDIO</div><h1 style="font-size:28px;margin:20px 0 10px">${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p><a href="/" style="display:inline-block;margin-top:18px;padding:12px 22px;border-radius:8px;background:#7750a8;color:#fff;text-decoration:none">Ana sayfaya dön</a></main></body></html>`, {
    status: success ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
  });
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
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

    if (!subscriber) return htmlPage("Bağlantı geçersiz", "Bu bağlantı kullanılmış, yenilenmiş veya geçersiz olabilir.");
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
