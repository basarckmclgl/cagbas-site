function htmlPage(title, message, body = "", status = 200) {
  const escapeHtml = value => String(value).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const markup = '<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>' + escapeHtml(title) + ' | ÇAĞBAŞ</title></head><body style="margin:0;background:#f5f4f8;color:#24212b;font:16px/1.6 Arial,sans-serif;display:grid;min-height:100vh;place-items:center"><main style="box-sizing:border-box;width:min(560px,calc(100% - 32px));padding:40px;background:#fff;border-radius:18px;box-shadow:0 12px 40px #21152a12;text-align:center"><div style="font-size:13px;letter-spacing:.2em;color:#7750a8;font-weight:bold">ÇAĞBAŞ CREATIVE STUDIO</div><h1 style="font-size:27px;line-height:1.25;margin:22px 0 10px">' + escapeHtml(title) + '</h1><p>' + escapeHtml(message) + '</p>' + body + '<a href="/" style="display:inline-block;margin-top:22px;padding:12px 22px;border-radius:8px;background:#7750a8;color:#fff;text-decoration:none">Ana sayfaya dön</a></main></body></html>';
  return new Response(markup, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store, max-age=0", "Referrer-Policy": "no-referrer" } });
}
async function makeToken(env, id, email) {
  if (!env.GMAIL_REFRESH_TOKEN) throw new Error("Unsubscribe signing key is not configured.");
  const secret = env.NEWSLETTER_UNSUBSCRIBE_SECRET || env.GMAIL_REFRESH_TOKEN;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const data = "cagbas-newsletter-unsubscribe-v1:" + id + ":" + email.toLowerCase();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(signature), b => b.toString(16).padStart(2, "0")).join("");
}
function formMarkup(id, token) {
  return '<form method="post" style="margin-top:26px"><input type="hidden" name="id" value="' + id + '"><input type="hidden" name="token" value="' + token + '"><button type="submit" style="border:0;border-radius:8px;padding:14px 22px;background:#7750a8;color:#fff;font-weight:bold;font-size:15px;cursor:pointer">Abonelikten çıkışı onayla</button></form><p style="font-size:13px;color:#777;margin-top:18px">Bu işlem yalnızca e-bülten aboneliğinizi durdurur.</p>';
}
export async function onRequestGet({ request, env }) {
  if (!env.DB) return htmlPage("Sistem kullanılamıyor", "Abonelik sistemi şu anda hizmet veremiyor.", "", 503);
  const url = new URL(request.url); const id = Number(url.searchParams.get("id")); const token = url.searchParams.get("token") || "";
  if (!Number.isSafeInteger(id) || id < 1 || !/^[a-f0-9]{64}$/.test(token)) return htmlPage("Bağlantı geçersiz", "Abonelikten çıkış bağlantısı eksik veya geçersiz.", "", 400);
  try {
    const sub = await env.DB.prepare("SELECT id, email, status FROM newsletter_subscribers WHERE id = ?").bind(id).first();
    if (!sub) return htmlPage("Kayıt bulunamadı", "Bu bağlantıyla eşleşen bir abonelik kaydı bulunamadı.", "", 404);
    if (!["active", "pending"].includes(sub.status)) return htmlPage("Abonelik zaten aktif değil", "Bu e-posta adresi için etkin bir e-bülten aboneliği veya bekleyen abonelik talebi bulunmuyor.");
    if (token !== await makeToken(env, sub.id, sub.email)) return htmlPage("Bağlantı geçersiz", "Güvenlik doğrulaması yapılamadı.", "", 400);
    // GET only shows confirmation; email security scanners cannot unsubscribe by prefetching.
    return htmlPage("Abonelikten çıkmak üzeresiniz", "ÇAĞBAŞ e-bülten aboneliğinizi durdurmak istediğinizi onaylayın.", formMarkup(id, token));
  } catch (error) { console.error("Newsletter unsubscribe page error:", error); return htmlPage("Bir hata oluştu", "İşlem şu anda tamamlanamadı. Lütfen daha sonra tekrar deneyin.", "", 500); }
}
export async function onRequestPost({ request, env }) {
  if (!env.DB) return htmlPage("Sistem kullanılamıyor", "Abonelik sistemi şu anda hizmet veremiyor.", "", 503);
  let form; try { form = await request.formData(); } catch { return htmlPage("Geçersiz istek", "İstek bilgileri okunamadı.", "", 400); }
  const id = Number(form.get("id")); const token = String(form.get("token") || "");
  if (!Number.isSafeInteger(id) || id < 1 || !/^[a-f0-9]{64}$/.test(token)) return htmlPage("Bağlantı geçersiz", "Abonelikten çıkış bağlantısı eksik veya geçersiz.", "", 400);
  try {
    const sub = await env.DB.prepare("SELECT id, email, status FROM newsletter_subscribers WHERE id = ?").bind(id).first();
    if (!sub) return htmlPage("Kayıt bulunamadı", "Bu bağlantıyla eşleşen bir abonelik kaydı bulunamadı.", "", 404);
    if (token !== await makeToken(env, sub.id, sub.email)) return htmlPage("Bağlantı geçersiz", "Güvenlik doğrulaması yapılamadı.", "", 400);
    if (!["active", "pending"].includes(sub.status)) return htmlPage("Abonelik zaten sonlandırılmış", "Bu e-posta adresi için etkin bir e-bülten aboneliği veya bekleyen talep bulunmuyor.");
    const result = await env.DB.prepare("UPDATE newsletter_subscribers SET status = 'unsubscribed', marketing_consent = 0, verification_token_hash = NULL, verification_expires_at = NULL, unsubscribed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status IN ('active', 'pending')").bind(id).run();
    if (!result.meta || result.meta.changes !== 1) return htmlPage("İşlem tamamlanamadı", "Abonelik durumu değişmedi. Lütfen tekrar deneyin.", "", 409);
    return htmlPage("Aboneliğiniz sonlandırıldı", "Talebiniz alındı. Bu e-posta adresine artık ÇAĞBAŞ e-bültenleri gönderilmeyecek.");
  } catch (error) { console.error("Newsletter unsubscribe error:", error); return htmlPage("Bir hata oluştu", "Abonelikten çıkış işlemi tamamlanamadı. Lütfen daha sonra tekrar deneyin.", "", 500); }
}