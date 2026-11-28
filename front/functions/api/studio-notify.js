function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

const BRAND = "ÇAĞBAŞ Creative Studio";

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

async function ensureTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS studio_launch_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','unsubscribed')),
      consent_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      verified_at TEXT,
      verification_token_hash TEXT,
      verification_expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

async function sendBrevo(env, email, subject, htmlContent, textContent) {
  if (!env.BREVO_API_KEY) throw new Error("Brevo API key is not configured.");
  const senderEmail = env.BREVO_SENDER_EMAIL || "cagbas.2026@gmail.com";
  const senderName = env.BREVO_SENDER_NAME || BRAND;
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { accept: "application/json", "api-key": env.BREVO_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ sender: { name: senderName, email: senderEmail }, to: [{ email }], subject, htmlContent, textContent })
  });
  if (!response.ok) {
    console.error("Brevo studio notification error:", response.status, (await response.text()).slice(0, 500));
    throw new Error("Brevo email failed.");
  }
  return response.json();
}

function verifyPage(title, message, token = "", status = 200) {
  const safe = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
  const form = token
    ? `<form method="post" action="/api/studio-notify"><input type="hidden" name="token" value="${safe(token)}"><button type="submit">E-posta adresimi doğrula</button></form>`
    : "";
  return new Response(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${safe(title)} | ÇAĞBAŞ</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#f7f4fa;color:#21182d;font:16px/1.65 Inter,Arial,sans-serif}main{width:min(560px,100%);padding:clamp(26px,6vw,48px);background:#fff;border:1px solid #eadff3;border-radius:24px;box-shadow:0 20px 70px #27123a14;text-align:center}.brand{color:#8050b2;font-size:12px;font-weight:800;letter-spacing:.2em}h1{font-size:clamp(25px,5vw,34px);line-height:1.2;margin:22px 0 12px}p{color:#625b6b}button,a{display:inline-block;margin-top:20px;padding:13px 22px;border:0;border-radius:12px;background:#7838c7;color:#fff;text-decoration:none;font-weight:800;cursor:pointer}</style></head><body><main><div class="brand">ÇAĞBAŞ CREATIVE STUDIO</div><h1>${safe(title)}</h1><p>${safe(message)}</p>${form}<a href="/">Ana sayfaya dön</a></main></body></html>`, {
    status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store, max-age=0", "Referrer-Policy": "no-referrer" }
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "Bildirim sistemi şu anda kullanılamıyor." }, 503);
  const origin = request.headers.get("origin");
  if (origin) {
    let host = "";
    try { host = new URL(origin).hostname; } catch {}
    if (!["cagbas.com", "www.cagbas.com", "cagbas-site.pages.dev"].includes(host) && !host.endsWith(".cagbas-site.pages.dev")) {
      return json({ error: "Bu kaynaktan gelen isteğe izin verilmiyor." }, 403);
    }
  }

  const type = request.headers.get("content-type") || "";
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    const form = await request.formData();
    const token = String(form.get("token") || "");
    if (!/^[a-f0-9]{64}$/.test(token)) return verifyPage("Bağlantı geçersiz", "Doğrulama bağlantısı eksik veya geçersiz.", "", 400);
    try {
      await ensureTable(env);
      const hash = await sha256(token);
      const row = await env.DB.prepare("SELECT id, verification_expires_at FROM studio_launch_subscribers WHERE verification_token_hash = ? AND status = 'pending'").bind(hash).first();
      if (!row) return verifyPage("Bağlantı geçersiz", "Bu bağlantı kullanılmış, yenilenmiş veya geçersiz olabilir.", "", 400);
      if (!row.verification_expires_at || Date.parse(row.verification_expires_at) < Date.now()) {
        return verifyPage("Bağlantının süresi dolmuş", "Lütfen web sitesinden yeniden bildirim talebi oluşturun.", "", 400);
      }
      await env.DB.prepare("UPDATE studio_launch_subscribers SET status='active', verified_at=CURRENT_TIMESTAMP, verification_token_hash=NULL, verification_expires_at=NULL, updated_at=CURRENT_TIMESTAMP WHERE id=? AND status='pending'").bind(row.id).run();
      return verifyPage("Bildirim aboneliğiniz doğrulandı", "Teşekkür ederiz. ÇAĞBAŞ AI STUDIO hizmete açıldığında bilgilendirme e-postası alacaksınız.");
    } catch (error) {
      console.error("Studio verification error:", error);
      return verifyPage("Bir hata oluştu", "Doğrulama şu anda tamamlanamadı. Lütfen daha sonra tekrar deneyin.", "", 500);
    }
  }

  if (!type.includes("application/json")) return json({ error: "Geçersiz istek biçimi." }, 415);
  let data;
  try { data = await request.json(); } catch { return json({ error: "Form bilgileri okunamadı." }, 400); }
  if (String(data.website || "").trim()) return json({ error: "Geçersiz form gönderimi." }, 400);
  const email = String(data.email || "").trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Lütfen geçerli bir e-posta adresi girin." }, 400);
  if (data.consent !== true) return json({ error: "Bilgilendirme e-postası için açık onay vermeniz gerekiyor." }, 400);

  try {
    await ensureTable(env);
    const existing = await env.DB.prepare("SELECT status FROM studio_launch_subscribers WHERE email=?").bind(email).first();
    if (existing?.status === "active") return json({ success: true, status: "active", message: "Bu e-posta adresi AI Studio açılış bildirim listesinde zaten kayıtlı." });

    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
    const hash = await sha256(token);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await env.DB.prepare("INSERT INTO studio_launch_subscribers (email,status,consent_at,verification_token_hash,verification_expires_at) VALUES (?,'pending',CURRENT_TIMESTAMP,?,?) ON CONFLICT(email) DO UPDATE SET status='pending',consent_at=CURRENT_TIMESTAMP,verified_at=NULL,verification_token_hash=excluded.verification_token_hash,verification_expires_at=excluded.verification_expires_at,updated_at=CURRENT_TIMESTAMP").bind(email, hash, expires).run();

    const verifyUrl = new URL("/api/studio-notify?token=" + encodeURIComponent(token), request.url).toString();
    const html = `<!doctype html><html lang="tr"><body style="margin:0;padding:32px 16px;background:#f7f4fa;color:#21182d;font-family:Arial,sans-serif"><main style="max-width:560px;margin:auto;padding:36px;background:#fff;border-radius:18px"><p style="color:#8050b2;font-weight:bold;letter-spacing:3px">ÇAĞBAŞ CREATIVE STUDIO</p><h1>AI STUDIO açılış bildirimini doğrulayın</h1><p>ÇAĞBAŞ AI STUDIO hizmete açıldığında bilgilendirilmek için talep oluşturdunuz. E-posta adresinizi doğrulamak için aşağıdaki bağlantıyı 24 saat içinde açın.</p><p style="margin:28px 0"><a href="${verifyUrl}" style="display:inline-block;padding:14px 22px;background:#7838c7;color:#fff;text-decoration:none;border-radius:9px;font-weight:bold">E-posta adresimi doğrula</a></p><p style="font-size:13px;color:#777;word-break:break-all">${verifyUrl}</p><p style="font-size:13px;color:#777">Bu talebi siz oluşturmadıysanız e-postayı yok sayabilirsiniz.</p></main></body></html>`;
    await sendBrevo(env, email, "ÇAĞBAŞ AI STUDIO açılış bildiriminizi doğrulayın", html, "ÇAĞBAŞ AI STUDIO açılış bildirimi talebinizi doğrulamak için 24 saat içinde bu bağlantıyı açın: " + verifyUrl);
    return json({ success: true, status: "pending", message: "Doğrulama bağlantısını e-posta adresinize gönderdik. Lütfen gelen kutunuzu ve spam klasörünüzü kontrol edin." }, 201);
  } catch (error) {
    console.error("Studio launch subscription error:", error);
    return json({ error: "Doğrulama e-postası şu anda gönderilemedi. Lütfen daha sonra tekrar deneyin." }, 503);
  }
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return verifyPage("Sistem kullanılamıyor", "Bildirim doğrulama sistemi şu anda hizmet veremiyor.", "", 503);
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!/^[a-f0-9]{64}$/.test(token)) return verifyPage("Bağlantı geçersiz", "Doğrulama bağlantısı eksik veya geçersiz.", "", 400);
  try {
    await ensureTable(env);
    const row = await env.DB.prepare("SELECT verification_expires_at FROM studio_launch_subscribers WHERE verification_token_hash=? AND status='pending'").bind(await sha256(token)).first();
    if (!row) return verifyPage("Bağlantı geçersiz", "Bu bağlantı kullanılmış, yenilenmiş veya geçersiz olabilir.", "", 400);
    if (!row.verification_expires_at || Date.parse(row.verification_expires_at) < Date.now()) return verifyPage("Bağlantının süresi dolmuş", "Lütfen web sitesinden yeniden bildirim talebi oluşturun.", "", 400);
    return verifyPage("E-posta doğrulaması", "AI Studio açılış bildirimi aboneliğinizi etkinleştirmek için aşağıdaki düğmeye basın.", token);
  } catch (error) {
    console.error("Studio verification page error:", error);
    return verifyPage("Bir hata oluştu", "Doğrulama sayfası şu anda açılamadı.", "", 500);
  }
}
