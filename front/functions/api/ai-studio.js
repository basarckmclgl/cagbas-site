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

const AI_INSTRUCTIONS = `Sen ÇAĞBAŞ AI STUDIO'nun Türkçe web tasarım üretim motorusun. Kullanıcı tasarım fikrini yazdıkça canlı tuval otomatik güncellenir. Sadece öneri anlatma; istenen tasarımı aşağıdaki JSON operasyonlarıyla gerçekten oluştur veya değiştir. Yanıtın HER ZAMAN geçerli JSON olmalı, Markdown veya JSON dışı metin ekleme. Şema: {"reply":"Kısa Türkçe durum açıklaması","operations":[...]}.

ANA OLUŞTURMA KURALLARI:
- Kullanıcı bir işletme, marka veya web sitesi fikri tarif ederse bunu çalışan bir web sitesi taslağına dönüştür. Sadece "anladım" deme; operations üret.
- İlk tasarımda mevcut boş/başlangıç tuvalini kullanarak tutarlı bir sayfa oluştur: navbar, hero, uygun hizmet/özellik alanı, gerekliyse galeri veya paket alanı, iletişim/CTA. İsteğe göre 4-7 anlamlı bölüm oluştur; gereksiz blok ekleme.
- Başlangıçta bulunan navbar ve hero bloklarını tekrar eklemek yerine mevcut ID'leri update_block ile güncelle. Mevcut features bloğunu isteğe göre güncelle. Eksik bölümleri add_block ile ekle.
- Kullanıcının verdiği sektör, marka adı, hedef kitle, renk, içerik ve dil tercihlerine sadık kal. Belirtilmeyen alanlarda sektöre uygun, profesyonel varsayımlar yap.
- Kullanıcı yeni ayrıntı eklediğinde mevcut tasarımı koru ve yalnızca gerekli değişiklikleri uygula; baştan kurma, var olan blokları sebepsiz çoğaltma veya silme.
- Kullanıcı açıkça çok sayfalı site isterse add_page ile sayfaları oluştur; aksi söylenmedikçe tek sayfalı tasarım üret.
- Yazılan metinleri Türkçe, anlaşılır, gerçekçi ve kısa tut. Gerçek olmayan ödül, referans, sertifika, fiyat veya istatistik uydurma.
- Her üretim isteğinde tasarım operasyonlarını en fazla 20 işlemle sınırla. İşlemleri görsel ve içerik bütünlüğünü koruyacak sırada ver.
- Kullanıcı yalnızca soru soruyor veya fikir danışıyorsa tasarımı değiştirme; operations boş dizi döndür.

DESTEKLENEN OPERASYONLAR:
- {"type":"add_block","blockType":"navbar"|"hero"|"features"|"cta"|"gallery"|"pricing"|"contact","block":{...}}
- {"type":"update_block","blockId":"mevcut blok ID","patch":{...}}
- {"type":"remove_block","blockId":"mevcut blok ID"}
- {"type":"move_block","blockId":"mevcut blok ID","toIndex":0}
- {"type":"duplicate_block","blockId":"mevcut blok ID"}
- {"type":"set_theme","theme":"white"|"slate"|"dark"}
- {"type":"set_accent","color":"#RRGGBB"}
- {"type":"add_page","name":"Sayfa adı","slug":"sayfa-adi"}
- {"type":"rename_page","pageId":"mevcut sayfa ID","name":"Yeni ad"}
- {"type":"switch_page","pageId":"mevcut sayfa ID"}
- {"type":"delete_page","pageId":"mevcut sayfa ID"}.

Mevcut tasarım durumu mesaj içinde verilir; yalnızca mevcut ID'leri kullan. Blok alanları için mevcut bileşen şemasına uygun veri üret: navbar brand/links/cta; hero badge/title/subtitle/primaryBtn/secondaryBtn; features heading/items[{title,desc}]; gallery heading/cards[{tag,title,desc}]; pricing heading/plans[{name,price,desc}]; cta heading/subtitle/buttonText; contact heading/subtitle/submitText. HTML, CSS, JavaScript veya çalıştırılabilir kod üretme.`;

async function callGemini(messages, apiKey) {
  // Gemini requires alternating user/model turns. Merge adjacent messages with the same role.
  const contents = [];
  for (const item of messages) {
    const role = item.role === "assistant" ? "model" : "user";
    const previous = contents[contents.length - 1];
    if (previous && previous.role === role) {
      previous.parts[0].text += "\\n\\n" + item.content;
    } else {
      contents.push({ role, parts: [{ text: item.content }] });
    }
  }

  let response;
  try {
    response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent", {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json"
      },
      signal: AbortSignal.timeout(25000),
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: AI_INSTRUCTIONS }]
        },
        contents,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 2048
        }
      })
    });
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      throw Object.assign(new Error("Gemini 35 saniye içinde yanıt vermedi. Bir kez daha deneyin; sorun sürerse model erişimini kontrol edeceğiz."), { status: 504 });
    }
    throw Object.assign(new Error("Gemini sunucusuna bağlanılamadı: " + String(error?.message || "ağ hatası").slice(0, 160)), { status: 502 });
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const apiMessage = String(result?.error?.message || "");
    console.error("Gemini API error:", response.status, result?.error?.status || "unknown", apiMessage.slice(0, 500));
    if (response.status === 400 || response.status === 403 || response.status === 404) {
      throw Object.assign(new Error("Gemini isteği reddedildi. Model erişimi, API anahtarı ve Google AI Studio proje ayarlarını kontrol edin. Ayrıntı: " + apiMessage.slice(0, 220)), { status: 502 });
    }
    if (response.status === 401) {
      throw Object.assign(new Error("Gemini API anahtarı doğrulanamadı. Cloudflare GEMINI_API_KEY değerini kontrol edin."), { status: 502 });
    }
    if (response.status === 429) {
      throw Object.assign(new Error("Gemini ücretsiz kullanım kotası veya istek hızı sınırına ulaşıldı. Google AI Studio limitlerini kontrol edin."), { status: 429 });
    }
    throw Object.assign(new Error("Gemini servisi şu anda yanıt vermiyor. HTTP " + response.status), { status: 502 });
  }

  const outputText = (result.candidates || [])
    .flatMap(candidate => candidate.content?.parts || [])
    .map(part => part.text || "")
    .join("\\n")
    .trim();

  if (!outputText) {
    const finishReason = result.candidates?.[0]?.finishReason || "unknown";
    throw Object.assign(new Error("Gemini boş yanıt döndürdü. Yanıt durumu: " + finishReason), { status: 502 });
  }

  let parsed;
  try {
    const cleaned = outputText.replace(/^\`\`\`(?:json)?\\s*/i, "").replace(/\\s*\`\`\`$/, "");
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("Gemini returned non-JSON output:", outputText.slice(0, 500));
    throw Object.assign(new Error("Gemini yanıtı JSON biçiminde değil. Lütfen komutu yeniden deneyin."), { status: 502 });
  }

  if (!parsed || typeof parsed.reply !== "string" || !Array.isArray(parsed.operations)) {
    throw Object.assign(new Error("Gemini yanıtında gerekli reply veya operations alanları eksik."), { status: 502 });
  }
  if (parsed.operations.length > 20) {
    throw Object.assign(new Error("Tek istekte çok fazla tasarım işlemi üretildi."), { status: 502 });
  }
  return {
    reply: parsed.reply.slice(0, 3000),
    operations: parsed.operations,
    provider: "gemini"
  };
}

export async function onRequestPost({ request, env }) {
  const provider = String(env.AI_PROVIDER || "").toLowerCase();
  const useGemini = provider === "gemini" || (Boolean(env.GEMINI_API_KEY) && provider !== "openai");
  if (useGemini && !env.GEMINI_API_KEY) {
    return json({ error: "Gemini bağlantısı seçilmiş ancak GEMINI_API_KEY Preview ortamında tanımlanmamış." }, 503);
  }
  if (!useGemini && !env.OPENAI_API_KEY) {
    return json({ error: "AI bağlantısı yapılandırılmamış. Preview için GEMINI_API_KEY ekleyin." }, 503);
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
    if (useGemini) {
      const result = await callGemini(messages, env.GEMINI_API_KEY);
      return json(result);
    }

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-6.2-astra",
        instructions: `Sen ÇAĞBAŞ AI STUDIO'nun Türkçe web tasarım üretim motorusun. Kullanıcı tasarım fikrini yazdıkça canlı tuval otomatik güncellenir. Sadece öneri anlatma; istenen tasarımı aşağıdaki JSON operasyonlarıyla gerçekten oluştur veya değiştir. Yanıtın HER ZAMAN geçerli JSON olmalı, Markdown veya JSON dışı metin ekleme. Şema: {"reply":"Kısa Türkçe durum açıklaması","operations":[...]}.

ANA OLUŞTURMA KURALLARI:
- Kullanıcı bir işletme, marka veya web sitesi fikri tarif ederse bunu çalışan bir web sitesi taslağına dönüştür. Sadece "anladım" deme; operations üret.
- İlk tasarımda mevcut boş/başlangıç tuvalini kullanarak tutarlı bir sayfa oluştur: navbar, hero, uygun hizmet/özellik alanı, gerekliyse galeri veya paket alanı, iletişim/CTA. İsteğe göre 4-7 anlamlı bölüm oluştur; gereksiz blok ekleme.
- Başlangıçta bulunan navbar ve hero bloklarını tekrar eklemek yerine mevcut ID'leri update_block ile güncelle. Mevcut features bloğunu isteğe göre güncelle. Eksik bölümleri add_block ile ekle.
- Kullanıcının verdiği sektör, marka adı, hedef kitle, renk, içerik ve dil tercihlerine sadık kal. Belirtilmeyen alanlarda sektöre uygun, profesyonel varsayımlar yap.
- Kullanıcı yeni ayrıntı eklediğinde mevcut tasarımı koru ve yalnızca gerekli değişiklikleri uygula; baştan kurma, var olan blokları sebepsiz çoğaltma veya silme.
- Kullanıcı açıkça çok sayfalı site isterse add_page ile sayfaları oluştur; aksi söylenmedikçe tek sayfalı tasarım üret.
- Yazılan metinleri Türkçe, anlaşılır, gerçekçi ve kısa tut. Gerçek olmayan ödül, referans, sertifika, fiyat veya istatistik uydurma.
- Her üretim isteğinde tasarım operasyonlarını en fazla 20 işlemle sınırla. İşlemleri görsel ve içerik bütünlüğünü koruyacak sırada ver.
- Kullanıcı yalnızca soru soruyor veya fikir danışıyorsa tasarımı değiştirme; operations boş dizi döndür.

DESTEKLENEN OPERASYONLAR:
- {"type":"add_block","blockType":"navbar"|"hero"|"features"|"cta"|"gallery"|"pricing"|"contact","block":{...}} (block isteğe bağlı)
- {"type":"update_block","blockId":"mevcut blok ID","patch":{...}}
- {"type":"remove_block","blockId":"mevcut blok ID"}
- {"type":"move_block","blockId":"mevcut blok ID","toIndex":0}
- {"type":"duplicate_block","blockId":"mevcut blok ID"}
- {"type":"set_theme","theme":"white"|"slate"|"dark"}
- {"type":"set_accent","color":"#RRGGBB"}
- {"type":"add_page","name":"Sayfa adı","slug":"sayfa-adi"}
- {"type":"rename_page","pageId":"mevcut sayfa ID","name":"Yeni ad"}
- {"type":"switch_page","pageId":"mevcut sayfa ID"}
- {"type":"delete_page","pageId":"mevcut sayfa ID"}.

Mevcut tasarım durumu mesaj içinde verilir; yalnızca mevcut ID'leri kullan. Blok alanları için mevcut bileşen şemasına uygun veri üret: navbar brand/links/cta; hero badge/title/subtitle/primaryBtn/secondaryBtn; features heading/items[{title,desc}]; gallery heading/cards[{tag,title,desc}]; pricing heading/plans[{name,price,desc}]; cta heading/subtitle/buttonText; contact heading/subtitle/submitText. HTML, CSS, JavaScript veya çalıştırılabilir kod üretme.`,

        input: messages,
        max_output_tokens: 1800
      })
    });

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("OpenAI API error:", upstream.status, result?.error?.code || "unknown");
      if (upstream.status === 401) return json({ error: "API anahtarı doğrulanamadı. Cloudflare secret ayarını kontrol edin." }, 502);
      if (upstream.status === 429) {
        const apiCode = String(result?.error?.code || result?.error?.type || "");
        if (apiCode === "insufficient_quota" || apiCode === "billing_hard_limit_reached") {
          return json({ error: "OpenAI API kullanım bakiyesi veya aylık harcama limiti dolmuş. OpenAI Platform Billing bölümünü kontrol edin.", code: "insufficient_quota" }, 429);
        }
        if (apiCode === "rate_limit_exceeded") {
          return json({ error: "OpenAI API istek hızı sınırına ulaşıldı. Biraz bekleyip tekrar deneyin.", code: "rate_limit_exceeded" }, 429);
        }
        return json({ error: "OpenAI API isteği 429 ile reddetti. Bakiye, aylık bütçe ve istek hızı sınırlarını kontrol edin.", code: apiCode || "rate_limit_or_quota" }, 429);
      }
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
    const safeMessage = String(error?.message || "Bilinmeyen bağlantı hatası").slice(0, 500);
    console.error("AI Studio request failed:", safeMessage);
    return json({ error: safeMessage }, Number.isInteger(error?.status) ? error.status : 502);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: { "Allow": "POST, OPTIONS", "Cache-Control": "no-store" }
  });
}
