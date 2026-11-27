function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function clean(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

const ALLOWED_ORIGINS = new Set(["https://cagbas.com", "https://www.cagbas.com"]);
const RECIPIENT_EMAIL = "cagbas.2026@gmail.com";
const SENDER_EMAIL = "cagbas.2026@gmail.com";

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "Proje talep sistemi şu anda kullanılamıyor." }, 503);
  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    return json({ error: "Geçersiz istek biçimi." }, 415);
  }

  const origin = request.headers.get("Origin");
  if (origin) {
    let normalized = "";
    try { normalized = new URL(origin).origin; } catch {}
    if (!ALLOWED_ORIGINS.has(normalized)) return json({ error: "Bu kaynaktan gelen isteğe izin verilmiyor." }, 403);
  }
  if ((request.headers.get("sec-fetch-site") || "").toLowerCase() === "cross-site") {
    return json({ error: "Çapraz site isteğine izin verilmiyor." }, 403);
  }

  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const rateKey = "ai-studio-lead:" + await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip))
    .then(buf => Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, "0")).join(""));
  const now = Date.now();
  const windowStart = Math.floor(now / 3600000) * 3600000;
  try {
    const rate = await env.DB.prepare(
      "INSERT INTO api_rate_limits (rate_key, window_start, request_count) VALUES (?, ?, 1) ON CONFLICT(rate_key) DO UPDATE SET request_count = CASE WHEN api_rate_limits.window_start < excluded.window_start THEN 1 ELSE api_rate_limits.request_count + 1 END, window_start = CASE WHEN api_rate_limits.window_start < excluded.window_start THEN excluded.window_start ELSE api_rate_limits.window_start END RETURNING request_count"
    ).bind(rateKey, windowStart).first();
    if (rate && rate.request_count > 5) return json({ error: "Çok fazla talep gönderildi. Lütfen daha sonra tekrar deneyin." }, 429);
  } catch (error) {
    console.error("AI Studio rate limit error:", error);
    return json({ error: "Talep güvenlik kontrolü şu anda tamamlanamadı." }, 503);
  }

  let data;
  try { data = await request.json(); } catch { return json({ error: "Gönderilen bilgiler okunamadı." }, 400); }
  if (clean(data.website, 200)) return json({ error: "Geçersiz form gönderimi." }, 400);

  const fullName = clean(data.fullName, 100);
  const email = clean(data.email, 254).toLowerCase();
  const phone = clean(data.phone, 40);
  const brandName = clean(data.brandName, 120);
  const serviceType = clean(data.serviceType, 100) || "AI Studio Proje Talebi";
  const customerMessage = clean(data.message, 2000);
  const design = data.design;
  const conversation = Array.isArray(data.conversation) ? data.conversation.slice(-20) : [];

  if (!fullName || !email || !phone || !customerMessage || !design || typeof design !== "object") {
    return json({ error: "Lütfen ad, e-posta, telefon, proje mesajı ve tasarım bilgilerini eksiksiz gönderin." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Geçerli bir e-posta adresi girin." }, 400);

  const designJson = JSON.stringify(design);
  const conversationJson = JSON.stringify(conversation);
  if (designJson.length > 30000 || conversationJson.length > 12000) {
    return json({ error: "Tasarım verisi çok büyük. Lütfen taslağı sadeleştirip tekrar deneyin." }, 413);
  }
  for (const item of conversation) {
    if (!item || !["user", "assistant"].includes(item.role) || typeof item.content !== "string") {
      return json({ error: "Konuşma geçmişi biçimi geçersiz." }, 400);
    }
  }

  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const referenceCode = "CB-" + Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("").toUpperCase();

  try {
    await env.DB.prepare(
      "INSERT INTO ai_studio_requests (reference_code, full_name, email, phone, brand_name, service_type, customer_message, design_json, conversation_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(referenceCode, fullName, email, phone, brandName, serviceType, customerMessage, designJson, conversationJson).run();
  } catch (error) {
    console.error("AI Studio request database error:", error);
    return json({ error: "Talebiniz kaydedilemedi. Lütfen tekrar deneyin." }, 500);
  }

  let emailNotification = "not_configured";
  if (env.BREVO_API_KEY) {
    const safe = [fullName, email, phone, brandName, serviceType, customerMessage, referenceCode].map(escapeHtml);
    const [safeName, safeEmail, safePhone, safeBrand, safeService, safeMessage, safeRef] = safe;
    const designText = JSON.stringify(design, null, 2).slice(0, 12000);
    const payload = {
      sender: { name: "ÇAĞBAŞ AI STUDIO", email: SENDER_EMAIL },
      to: [{ email: RECIPIENT_EMAIL, name: "ÇAĞBAŞ" }],
      replyTo: { email, name: fullName },
      subject: "Yeni AI Studio Proje Talebi: " + referenceCode,
      textContent: [
        "Yeni AI Studio proje talebi", "Referans: " + referenceCode,
        "Müşteri: " + fullName, "E-posta: " + email, "Telefon: " + phone,
        "Marka: " + brandName, "Hizmet: " + serviceType, "", "Mesaj:", customerMessage,
        "", "Tasarım verisi:", designText
      ].join("\n"),
      htmlContent: "<h2>Yeni ÇAĞBAŞ AI Studio talebi</h2><p><b>Referans:</b> " + safeRef +
        "</p><p><b>Müşteri:</b> " + safeName + "</p><p><b>E-posta:</b> " + safeEmail +
        "</p><p><b>Telefon:</b> " + safePhone + "</p><p><b>Marka:</b> " + safeBrand +
        "</p><p><b>Hizmet:</b> " + safeService + "</p><p><b>Mesaj:</b><br>" +
        safeMessage.replace(/\r?\n/g, "<br>") + "</p><pre>" + escapeHtml(designText) + "</pre>"
    };
    try {
      const mail = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "accept": "application/json", "api-key": env.BREVO_API_KEY, "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      emailNotification = mail.ok ? "sent" : "failed";
      if (!mail.ok) console.error("AI Studio Brevo error:", mail.status, (await mail.text()).slice(0, 500));
    } catch (error) {
      emailNotification = "failed";
      console.error("AI Studio email error:", error);
    }
  }

  return json({
    success: true,
    referenceCode,
    emailNotification,
    message: emailNotification === "sent"
      ? "Talebiniz kaydedildi ve ÇAĞBAŞ ekibine iletildi."
      : "Talebiniz kaydedildi. E-posta bildirimi şu anda gönderilemedi; kaydınız korunuyor."
  }, 201);
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { "Allow": "POST, OPTIONS", "Cache-Control": "no-store" } });
}
