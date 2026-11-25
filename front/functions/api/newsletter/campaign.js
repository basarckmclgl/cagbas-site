function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
async function unsubscribeToken(env, id, email) {
  const secret = env.NEWSLETTER_UNSUBSCRIBE_SECRET || env.GMAIL_REFRESH_TOKEN;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const data = "cagbas-newsletter-unsubscribe-v1:" + id + ":" + email.toLowerCase();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig), b => b.toString(16).padStart(2, "0")).join("");
}
async function sendGmailEmail(env, to, subjectText, htmlContent, textContent) {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) throw new Error("Gmail secrets are not fully configured.");
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: GMAIL_CLIENT_ID, client_secret: GMAIL_CLIENT_SECRET, refresh_token: GMAIL_REFRESH_TOKEN, grant_type: "refresh_token" })
  });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) throw new Error("Gmail access token refresh failed: " + (tokenData.error || tokenResponse.status));
  const sender = "cagbas.2026@gmail.com";
  const subject = "=?UTF-8?B?" + btoa(unescape(encodeURIComponent(subjectText))) + "?=";
  const boundary = "cagbas_" + crypto.randomUUID().replace(/-/g, "");
  const encode = value => btoa(unescape(encodeURIComponent(value)));
  const mime = ["To: " + to, "From: " + sender, "Subject: " + subject, "MIME-Version: 1.0", 'Content-Type: multipart/alternative; boundary="' + boundary + '"', "", "--" + boundary, 'Content-Type: text/plain; charset="UTF-8"', "Content-Transfer-Encoding: base64", "", encode(textContent), "--" + boundary, 'Content-Type: text/html; charset="UTF-8"', "Content-Transfer-Encoding: base64", "", encode(htmlContent), "--" + boundary + "--"].join("\\r\\n");
  const raw = encode(mime).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", { method: "POST", headers: { "Authorization": "Bearer " + tokenData.access_token, "Content-Type": "application/json" }, body: JSON.stringify({ raw }) });
  if (!response.ok) { const detail = await response.text(); console.error("Gmail campaign send error:", response.status, detail.slice(0, 300)); throw new Error("Gmail campaign send failed: " + response.status); }
  const result = await response.json();
  if (!result.id) throw new Error("Gmail did not return a message ID.");
  return result.id;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
export async function onRequestPost({ request, env }) {
  if (!env.DB || !env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REFRESH_TOKEN || !env.NEWSLETTER_ADMIN_TOKEN) return json({ error: "Newsletter campaign service is not configured." }, 503);
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
        await sendGmailEmail(env, subscriber.email, subject, messageHtml, messageText);
        sent++;
      } catch (error) {
        console.error("Newsletter campaign send failed:", subscriber.id, error);
        failures.push(subscriber.id);
      }
    }
    return json({ success: failures.length === 0, eligible: rows.length, acceptedByGmail: sent, failedSubscriberIds: failures }, failures.length ? 207 : 200);
  } catch (error) {
    console.error("Newsletter campaign error:", error);
    return json({ error: "Campaign could not be processed." }, 500);
  }
}