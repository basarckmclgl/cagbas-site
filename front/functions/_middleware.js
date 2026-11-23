export async function onRequest({ request, next }) {
  const pathname = new URL(request.url).pathname;

  // Permanently retire the known injected spam URL family.
  // All legitimate pages and existing API routes continue unchanged.
  if (/^\/jiahly-/i.test(pathname)) {
    return new Response("410 Gone - This URL has been permanently removed.", {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store"
      }
    });
  }

  return next();
}
