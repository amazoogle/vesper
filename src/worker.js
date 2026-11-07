/**
 * Cloudflare Worker for VESPER: The Gilded Eclipse
 * Target: vesper.amazoogle.workers.dev
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Healthcheck endpoint
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          worker: 'vesper',
          subaccount: 'amazoogle',
          timestamp: new Date().toISOString()
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        }
      );
    }

    // Fetch static asset from Workers Static Assets binding
    let response = await env.ASSETS.fetch(request);

    // SPA fallback: If asset is not found and client requests HTML, serve index.html
    if (response.status === 404 && request.headers.get('accept')?.includes('text/html')) {
      const indexReq = new Request(new URL('/', request.url), request);
      response = await env.ASSETS.fetch(indexReq);
    }

    // Attach performance and security headers
    const headers = new Headers(response.headers);

    if (url.pathname.endsWith('.js') || url.pathname.includes('/vendor/')) {
      headers.set('Cache-Control', 'public, max-age=604800, immutable');
    } else if (url.pathname === '/' || url.pathname.endsWith('.html')) {
      headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }

    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
