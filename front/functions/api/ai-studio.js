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

const ALLOWED_ORIGINS = new Set(["https://cagbas.com", "https://www.cagbas.com"]);

function isAllowedOrigin(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (
      ALLOWED_ORIGINS.has(url.origin) ||
      (url.hostname.endsWith(".cagbas-site.pages.dev") && url.hostname.length > ".cagbas-site.pages.dev".length)
    );
  } catch {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.OPENAI_API_KEY) {
    return json({ error: "AI bağlantısı sunucuda yapılandırılmamış." }, 503);
  }

  const origin = request.headers.get("Origin");
  if (origin) {
    let normalizedOrigin = "";
    try { normalizedOrigin = new URL(origin).origin; } catch {}
    if (!isAllowedOrigin(origin)) {
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
        instructions: `Sen ÇAĞBAŞ AI STUDIO'nun Türkçe konuşan web tasarım asistanısın. Kullanıcı web sitesi tasarımında bir değişiklik, düzenleme veya işlem istediğinde bunu sadece anlatma; aşağıdaki JSON biçiminde uygulanabilir operasyonlar üret. Yanıtın HER ZAMAN geçerli JSON olmalı ve başka metin içermemeli. Şema: {"reply":"Kullanıcıya kısa Türkçe açıklama","operations":[...]}.
Operasyon türleri:
- {"type":"add_block","blockType":"navbar"|"hero"|"features"|"cta"|"gallery"|"pricing"|"contact","block":{...}} (block isteğe bağlı)
- {"type":"update_block","blockId":"mevcut blok ID","patch":{...}}
- {"type":"remove_block","blockId":"mevcut blok ID"}
- {"type":"move_block","blockId":"mevcut blok ID","toIndex":0}
- {"type":"duplicate_block","blockId":"mevcut blok ID"}
- {"type":"set_theme","theme":"white"|"slate"|"dark"}
- {"type":"set_accent","color":"#RRGGBB"}
- {"type":"add_page","name":"Sayfa adı","slug":"sayfa-adı"}
- {"type":"rename_page","pageId":"mevcut sayfa ID","name":"Yeni ad"}
- {"type":"switch_page","pageId":"mevcut sayfa ID"}
- {"type":"delete_page","pageId":"mevcut sayfa ID"}.
Mevcut tasarım durumu kullanıcı mesajıyla birlikte verilir; yalnızca mevcut ID'leri kullan. Kullanıcı belirsiz şekilde fikir soruyorsa operations boş dizi olsun. İstenen değişiklikleri doğrudan ve en az sayıda operasyonla uygula. Metinleri güvenli, kısa ve Türkçe tut. HTML, CSS, JavaScript veya çalıştırılabilir kod üretme.`,

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

    const outputText = (result.output || [])
      .filter(item => item.type === "message")
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text || "")
      .join("\n")
      .trim();

    if (!outputText) return json({ error: "Yapay zekâ boş yanıt döndürdü." }, 502);
    let parsed;
    try { parsed = JSON.parse(outputText); }
    catch { return json({ error: "Yapay zekâ yanıtı beklenen biçimde değil." }, 502); }
    if (!parsed || typeof parsed.reply !== "string" || !Array.isArray(parsed.operations)) {
      return json({ error: "Yapay zekâ yanıtı eksik alan içeriyor." }, 502);
    }
    if (parsed.operations.length > 20) return json({ error: "Tek istekte çok fazla tasarım işlemi üretildi." }, 502);
    return json({ reply: parsed.reply.slice(0, 3000), operations: parsed.operations });
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
