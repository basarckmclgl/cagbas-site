function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
async function unsubscribeToken(env, id, email) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.BREVO_API_KEY), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const data = "cagbas-newsletter-unsubscribe-v1:" + id + ":" + email.toLowerCase();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig), b => b.toString(16).padStart(2, "0")).join("");
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
export async function onRequestPost({ request, env }) {
  if (!env.DB || !env.BREVO_API_KEY || !env.NEWSLETTER_ADMIN_TOKEN) return json({ error: "Newsletter campaign service is not configured." }, 503);
  const auth = request.headers.get("authorization") || "";
  if (auth !== "Bearer " + env.NEWSLETTER_ADMIN_TOKEN) return json({ error: "Unauthorized." }, 401);
  if (!(request.headers.get("content-type") || "").includes("application/json")) return json({ error: "JSON required." }, 415);
  let data;
  try { data = await request.json(); } catch { return json({ error: "Invalid JSON." }, 400); }
  const subject = String(data.subject || "").trim();
  const htmlContent = String(data.htmlContent || "").trim();
  const textContent = String(data.textContent || "").trim();
  if (!subject || subject.length > 180 || !htmlContent || htmlContent.length > 200000 || !textContent || textContent.length > 100000) {
    return json({ error: "subject, htmlContent and textContent are required and must be within the allowed lengths." }, 400);
  }
  try {
    const subscribers = await env.DB.prepare("SELECT id, email FROM newsletter_subscribers WHERE status = 'active' AND marketing_consent = 1 ORDER BY id").all();
    const rows = subscribers.results || [];
    const senderEmail = env.BREVO_SENDER_EMAIL || "cagbas.2026@gmail.com";
    const senderName = env.BREVO_SENDER_NAME || "ÇAĞBAŞ Creative Studio";
    let sent = 0;
    const failures = [];
    for (const subscriber of rows) {
      const token = await unsubscribeToken(env, subscriber.id, subscriber.email);
      const url = new URL("/api/newsletter/unsubscribe", request.url);
      url.searchParams.set("id", String(subscriber.id));
      url.searchParams.set("token", token);
      const safeUrl = escapeHtml(url.toString());
      const footer = '<hr style="border:0;border-top:1px solid #e8e4ed;margin:32px 0 18px"><p style="font:13px/1.6 Arial,sans-serif;color:#777">Bu e-postayı ÇAĞBAŞ e-bültenine verdiğiniz izin nedeniyle alıyorsunuz. <a href="' + safeUrl + '" style="color:#7750a8">Abonelikten çık</a>.</p>';
      const messageHtml = htmlContent + footer;
      const messageText = textContent + "\n\nE-bülten aboneliğinden çıkmak için: " + url.toString();
      try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "accept": "application/json", "api-key": env.BREVO_API_KEY, "content-type": "application/json" },
          body: JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: [{ email: subscriber.email }],
            subject,
            htmlContent: messageHtml,
            textContent: messageText,
            tags: ["cagbas-newsletter-campaign"]
          })
        });
        if (!response.ok) {
          const detail = await response.text();
          console.error("Brevo campaign recipient failed:", subscriber.id, response.status, detail.slice(0, 300));
          failures.push(subscriber.id);
        } else {
          const result = await response.json();
          if (result.messageId) sent++;
          else failures.push(subscriber.id);
        }
      } catch (error) {
        console.error("Newsletter campaign send failed:", subscriber.id, error);
        failures.push(subscriber.id);
      }
    }
    return json({ success: failures.length === 0, eligible: rows.length, acceptedByBrevo: sent, failedSubscriberIds: failures }, failures.length ? 207 : 200);
  } catch (error) {
    console.error("Newsletter campaign error:", error);
    return json({ error: "Campaign could not be processed." }, 500);
  }
}