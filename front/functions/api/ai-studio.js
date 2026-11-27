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

const ALLOWED_ORIGINS = new Set([
  "https://cagbas.com",
  "https://www.cagbas.com"
]);

export async function onRequestPost({ request, env }) {
  if (!env.OPENAI_API_KEY) {
    return json({ error: "AI bağlantısı sunucuda yapılandırılmamış." }, 503);
  }

  const origin = request.headers.get("Origin");
  if (origin) {
    let normalizedOrigin = "";
    try { normalizedOrigin = new URL(origin).origin; } catch {}
    if (!ALLOWED_ORIGINS.has(normalizedOrigin)) {
      return json({ error: "Bu kaynaktan gelen isteğe izin verilmiyor." }, 403);
    }
  }

  if ((request.headers.get("sec-fetch-site") || "").toLowerCase() === "cross-site") {
    return json({ error: "Çapraz site isteğine izin verilmiyor." }, 403);
  }

  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    return json({ error: "Geçersiz istek biçimi." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 20000) return json({ error: "İstek çok büyük." }, 413);

  let data;
  try { data = await request.json(); }
  catch { return json({ error: "İstek okunamadı." }, 400); }

  if (!Array.isArray(data.messages) || data.messages.length === 0 || data.messages.length > 12) {
    return json({ error: "Geçerli bir mesaj geçmişi gönderilmedi." }, 400);
  }

  const messages = [];
  for (const item of data.messages) {
    if (!item || !["user", "assistant"].includes(item.role) || typeof item.content !== "string") {
      return json({ error: "Mesaj biçimi geçersiz." }, 400);
    }
    const content = item.content.trim();
    if (!content || content.length > 4000) {
      return json({ error: "Mesaj boş veya izin verilen uzunluğu aşıyor." }, 400);
    }
    messages.push({ role: item.role, content });
  }

  if (messages[messages.length - 1].role !== "user") {
    return json({ error: "Son mesaj kullanıcı mesajı olmalıdır." }, 400);
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-6.2-astra",
        instructions: "Sen ÇAĞBAŞ AI STUDIO'nun Türkçe konuşan dijital tasarım asistanısın. Web tasarımı, kullanıcı deneyimi, içerik, marka ve dijital çözümler konusunda açık, uygulanabilir ve güvenli öneriler ver. Şu aşamada kullanıcının mesajlarını yanıtlayabilirsin; web sitesi tuvalinde değişiklik yaptığını veya dosya kaydettiğini iddia etme. Kısa ve anlaşılır yanıt ver.",
        input: messages,
        max_output_tokens: 700
      })
    });

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("OpenAI API error:", upstream.status, result?.error?.code || "unknown");
      if (upstream.status === 401) return json({ error: "API anahtarı doğrulanamadı. Cloudflare secret ayarını kontrol edin." }, 502);
      if (upstream.status === 429) return json({ error: "API kullanım limiti veya bakiye sınırına ulaşıldı." }, 429);
      return json({ error: "Yapay zekâ servisine şu anda ulaşılamıyor." }, 502);
    }

    const reply = (result.output || [])
      .filter(item => item.type === "message")
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text || "")
      .join("\n")
      .trim();

    if (!reply) return json({ error: "Yapay zekâ boş yanıt döndürdü." }, 502);
    return json({ reply });
  } catch (error) {
    console.error("AI Studio request failed:", error?.message || "unknown");
    return json({ error: "Bağlantı sırasında beklenmeyen bir hata oluştu." }, 502);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: { "Allow": "POST, OPTIONS", "Cache-Control": "no-store" }
  });
}
