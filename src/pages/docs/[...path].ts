export const prerender = false;

import type { APIRoute } from 'astro';

/**
 * Customer travel-documents portal, served on the BRAND domain (2026-07-28).
 * The portal itself lives on the admin API worker, but customers must never
 * see a workers.dev URL ("looks like a phishing domain" — owner), and the
 * flightsandpackages.com DNS zone is managed outside Cloudflare so a Workers
 * custom domain can't bind. This route proxies:
 *   https://holidays.flightsandpackages.com/docs/<token>[/file/<id>]
 *     → https://holiday-admin-api…workers.dev/portal/docs/<…>
 * The portal's own links are RELATIVE, so they resolve under /docs here and
 * under /portal/docs when hit directly — both keep working.
 */
const WORKER = 'https://holiday-admin-api.satwinder-30c.workers.dev';

const proxy: APIRoute = async ({ params, request }) => {
  const path = params.path ?? '';
  const search = new URL(request.url).search;
  const res = await fetch(`${WORKER}/portal/docs/${path}${search}`, {
    method: request.method,
    headers: request.headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
  });
  // Pass the response through untouched (HTML pages and file downloads alike).
  const headers = new Headers(res.headers);
  headers.delete('content-encoding'); // body arrives decoded; the length/encoding pair would lie
  headers.delete('content-length');
  return new Response(res.body, { status: res.status, headers });
};

export const GET = proxy;
export const POST = proxy;
