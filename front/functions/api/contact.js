const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER_EMAIL = "cagbas.2026@gmail.com";
const RECIPIENT_EMAIL = "cagbas.2026@gmail.com";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "İletişim kayıt sistemi henüz yapılandırılmadı." }, 503);
  if (!env.BREVO_API_KEY) return json({ error: "E-posta hizmeti henüz yapılandırılmadı." }, 503);
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
  } catch (error) {
    console.error("Contact database error:", error);
    return json({ error: "Mesajınız şu anda kaydedilemedi. Lütfen daha sonra tekrar deneyin." }, 500);
  }

  const safeName = escapeHtml(fullName);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

  const payload = {
    sender: { name: "ÇAĞBAŞ Creative Studio", email: SENDER_EMAIL },
    to: [{ email: RECIPIENT_EMAIL, name: "ÇAĞBAŞ Creative Studio" }],
    replyTo: { email, name: fullName },
    subject: "Yeni İletişim Formu: " + subject,
    textContent: [
      "Web sitesinden yeni bir iletişim formu gönderildi.",
      "",
      "Ad Soyad: " + fullName,
      "E-posta: " + email,
      "Telefon: " + phone,
      "Konu: " + subject,
      "",
      "Mesaj:",
      message
    ].join("\n"),
    htmlContent:
      "<h2>ÇAĞBAŞ web sitesi iletişim formu</h2>" +
      "<p><strong>Ad Soyad:</strong> " + safeName + "</p>" +
      "<p><strong>E-posta:</strong> " + safeEmail + "</p>" +
      "<p><strong>Telefon:</strong> " + safePhone + "</p>" +
      "<p><strong>Konu:</strong> " + safeSubject + "</p>" +
      "<p><strong>Mesaj:</strong><br>" + safeMessage + "</p>"
  };

  try {
    const brevoResponse = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!brevoResponse.ok) {
      const details = await brevoResponse.text();
      console.error("Brevo API error:", brevoResponse.status, details.slice(0, 1000));
      return json({
        success: true,
        emailNotification: "failed",
        error: "Mesajınız kaydedildi ancak Brevo e-posta gönderimini kabul etmedi (HTTP " + brevoResponse.status + ")."
      }, 201);
    }

    const result = await brevoResponse.json();
    if (!result.messageId) {
      console.error("Brevo response missing messageId:", JSON.stringify(result).slice(0, 500));
      return json({
        success: true,
        emailNotification: "failed",
        error: "Mesajınız kaydedildi ancak e-posta gönderimi doğrulanamadı."
      }, 201);
    }

    return json({ success: true, emailNotification: "sent", message: "Mesajınız başarıyla gönderildi." }, 201);
  } catch (error) {
    console.error("Brevo request failed:", error);
    return json({
      success: true,
      emailNotification: "failed",
      error: "Mesajınız kaydedildi ancak Brevo e-posta hizmetine ulaşılamadı."
    }, 201);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { "Allow": "POST, OPTIONS" } });
}
