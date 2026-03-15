/**
 * Cloudflare Worker — Meta Graph API Proxy
 *
 * Proxies requests to graph.facebook.com and graph.instagram.com
 * so they can be called from environments where those domains are blocked.
 *
 * Usage:
 *   GET  https://<worker>.workers.dev/facebook/v19.0/me?fields=id,name&access_token=...
 *   GET  https://<worker>.workers.dev/instagram/v19.0/17841468585961185?fields=id,username&access_token=...
 *   POST https://<worker>.workers.dev/facebook/v19.0/...
 *
 * Security: requests require the META_ACCESS_TOKEN to be present as a query
 * param or Authorization header — the worker never injects credentials itself.
 */

const TARGETS = {
  facebook: "https://graph.facebook.com",
  instagram: "https://graph.instagram.com",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse /<target>/<rest-of-path>
    const segments = url.pathname.replace(/^\//, "").split("/");
    const targetKey = segments[0];
    const target = TARGETS[targetKey];

    if (!target) {
      return new Response(
        JSON.stringify({
          error: `Unknown target "${targetKey}". Use /facebook/... or /instagram/...`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build upstream URL
    const upstreamPath = "/" + segments.slice(1).join("/");
    const upstreamUrl = new URL(upstreamPath, target);
    upstreamUrl.search = url.search;

    // Forward the request
    const upstreamRequest = new Request(upstreamUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    });

    const response = await fetch(upstreamRequest);

    // Return with CORS headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
