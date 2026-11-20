function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

function base64Utf8(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

async function sendGmailNotification(env, submission) {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error("Gmail secrets are not fully configured.");
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

  const recipient = "cagbas.2026@gmail.com";
  const subject = "=?UTF-8?B?" + base64Utf8("Yeni İletişim Formu: " + submission.subject) + "?=";
  const body = [
    "Web sitesinden yeni bir iletişim formu gönderildi.",
    "",
    "Ad Soyad: " + submission.fullName,
    "E-posta: " + submission.email,
    "Telefon: " + submission.phone,
    "Konu: " + submission.subject,
    "",
    "Mesaj:",
    submission.message
  ].join("\r\n");
  const mime = [
    "To: " + recipient,
    "From: " + recipient,
    "Subject: " + subject,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    base64Utf8(body)
  ].join("\r\n");
  const raw = base64Utf8(mime).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/g, "");

  const sendResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + tokenData.access_token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ raw })
  });
  if (!sendResponse.ok) {
    const detail = await sendResponse.text();
    throw new Error("Gmail send failed: " + sendResponse.status + " " + detail.slice(0, 300));
  }
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
  } catch (error) {
    console.error("Contact database error:", error);
    return json({ error: "Mesajınız şu anda kaydedilemedi. Lütfen daha sonra tekrar deneyin." }, 500);
  }

  try {
    await sendGmailNotification(env, { fullName, email, phone, subject, message });
    return json({ success: true, emailNotification: "sent", message: "Mesajınız başarıyla gönderildi." }, 201);
  } catch (error) {
    console.error("Contact email notification error:", error);
    return json({
      success: true,
      emailNotification: "failed",
      message: "Mesajınız kaydedildi. E-posta bildirimi şu anda gönderilemedi."
    }, 201);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { "Allow": "POST, OPTIONS" } });
}
