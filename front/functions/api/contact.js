function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "İletişim kayıt sistemi henüz yapılandırılmadı." }, 503);
  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    return json({ error: "Geçersiz istek biçimi." }, 415);
  }

  let data;
  try { data = await request.json(); }
  catch { return json({ error: "Gönderilen bilgiler okunamadı." }, 400); }

  const fullName = String(data.fullName || "").trim();
  const email = String(data.email || "").trim();
  const phone = String(data.phone || "").trim();
  const subject = String(data.subject || "").trim();
  const message = String(data.message || "").trim();

  if (!fullName || !email || !phone || !subject || !message) {
    return json({ error: "Lütfen tüm alanları doldurun." }, 400);
  }
  if (fullName.length > 100 || email.length > 254 || phone.length > 40 || subject.length > 100 || message.length > 1000) {
    return json({ error: "Form alanlarından biri izin verilen uzunluğu aşıyor." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Geçerli bir e-posta adresi girin." }, 400);
  }

  try {
    await env.DB.prepare(
      "INSERT INTO contact_submissions (full_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)"
    ).bind(fullName, email, phone, subject, message).run();

    return json({
      success: true,
      message: "Mesajınız güvenli şekilde kaydedildi. E-posta bildirimi yapılandırma aşamasındadır."
    }, 201);
  } catch (error) {
    console.error("Contact database error:", error);
    return json({ error: "Mesajınız şu anda kaydedilemedi. Lütfen daha sonra tekrar deneyin." }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { "Allow": "POST, OPTIONS" } });
}
