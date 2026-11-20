function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "Abonelik sistemi henüz yapılandırılmadı." }, 503);
  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    return json({ error: "Geçersiz istek biçimi." }, 415);
  }

  let data;
  try { data = await request.json(); }
  catch { return json({ error: "Gönderilen bilgiler okunamadı." }, 400); }

  const email = String(data.email || "").trim().toLowerCase();
  const marketingConsent = data.marketingConsent === true;

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Lütfen geçerli bir e-posta adresi girin." }, 400);
  }
  if (!marketingConsent) {
    return json({ error: "E-bülten gönderimi için onay gereklidir." }, 400);
  }

  try {
    await env.DB.prepare(
      "INSERT INTO newsletter_subscribers (email, status, marketing_consent, consent_at) VALUES (?, 'pending', 1, CURRENT_TIMESTAMP) ON CONFLICT(email) DO UPDATE SET status = CASE WHEN newsletter_subscribers.status = 'unsubscribed' THEN 'pending' ELSE newsletter_subscribers.status END, marketing_consent = 1, consent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP"
    ).bind(email).run();

    return json({
      success: true,
      status: "pending",
      message: "Abonelik talebiniz alındı. E-posta doğrulama adımını tamamladığınızda kaydınız etkinleştirilecek."
    }, 201);
  } catch (error) {
    console.error("Newsletter subscription database error:", error);
    return json({ error: "Abonelik talebiniz şu anda kaydedilemedi. Lütfen daha sonra tekrar deneyin." }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { "Allow": "POST, OPTIONS" } });
}
