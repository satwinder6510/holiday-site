/**
 * Astro middleware — security headers for SSR responses.
 *
 * Cloudflare Pages `public/_headers` only covers static assets and SSG pages;
 * SSR (Worker-rendered) routes — the homepage, holiday detail, country/collection,
 * search and river-cruises pages — ship without it. This middleware applies the
 * same baseline headers to every server-rendered response.
 *
 * KEEP IN SYNC with public/_headers (same five headers, same values).
 * See SECURITY-CHANGES-2026-07-02.md §3.
 */
import { defineMiddleware } from 'astro:middleware';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    // Don't override anything a route set deliberately (e.g. the R2 image
    // route already sets nosniff).
    if (!response.headers.has(name)) {
      response.headers.set(name, value);
    }
  }
  return response;
});
