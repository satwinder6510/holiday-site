/**
 * On-the-fly image resizing for the site's image routes.
 *
 * holidays.flightsandpackages.com is a Pages custom domain on an outside DNS, not a
 * Cloudflare zone, so the URL-based `/cdn-cgi/image/` transform can't be enabled,
 * and a Pages project can't hold a Cloudflare Images binding. The engine therefore
 * lives in the holiday-admin-api Worker (routes/img.ts) and is reached over the
 * RESIZER service binding. This side does what the Worker can't: negotiate format
 * from the browser's Accept header and cache the result at the site's edge.
 *
 * `?w=<px>` on /objects/images, /api/media and /img/remote. Widths snap to a short
 * ladder so unique transformations (the billable unit) stay bounded. Any failure
 * falls back to the original bytes — a page must never lose a photo over this.
 */

export const WIDTH_LADDER = [320, 480, 640, 800, 1000, 1200, 1600] as const;

export function snapWidth(raw: string | null): number | null {
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  for (const w of WIDTH_LADDER) if (n <= w) return w;
  return WIDTH_LADDER[WIDTH_LADDER.length - 1];
}

type Format = 'avif' | 'webp' | 'jpeg';

function pickFormat(accept: string | null): Format {
  const a = accept || '';
  if (a.includes('image/avif')) return 'avif';
  if (a.includes('image/webp')) return 'webp';
  return 'jpeg';
}

export type ResizeTarget = { kind: 'r2'; key: string } | { kind: 'remote'; url: string };

interface RuntimeLike {
  env?: { RESIZER?: { fetch: (input: Request) => Promise<Response> } };
  ctx?: { waitUntil?: (p: Promise<unknown>) => void };
}

/**
 * Serve `target` resized to `width` for `request`. `original()` must return the
 * untouched image response and is used whenever resizing is unavailable.
 */
export async function serveResized(
  request: Request,
  runtime: RuntimeLike | undefined,
  width: number,
  target: ResizeTarget,
  original: () => Promise<Response>,
): Promise<Response> {
  const resizer = runtime?.env?.RESIZER;
  if (!resizer) return original();

  const format = pickFormat(request.headers.get('Accept'));
  const cacheKeyUrl = new URL(request.url);
  cacheKeyUrl.searchParams.set('w', String(width));
  cacheKeyUrl.searchParams.set('f', format);
  const cacheKey = new Request(cacheKeyUrl.toString(), { method: 'GET' });

  let cache: Cache | null = null;
  try {
    cache = (caches as unknown as { default: Cache }).default;
    const hit = await cache.match(cacheKey);
    // A cached Response has immutable headers; the site middleware appends security
    // headers to every response, so hand it a fresh copy or that throws (500).
    if (hit) return new Response(hit.body, { status: hit.status, headers: new Headers(hit.headers) });
  } catch {
    cache = null;
  }

  try {
    const q = new URLSearchParams({ w: String(width), f: format });
    if (target.kind === 'r2') q.set('key', target.key); else q.set('u', target.url);
    const upstream = await resizer.fetch(new Request(`https://resizer/img/${target.kind}?${q}`, { method: 'GET' }));
    if (!upstream.ok || !upstream.body) {
      console.error('resize: engine returned', upstream.status, target);
      return original();
    }
    const headers = new Headers();
    headers.set('Content-Type', upstream.headers.get('Content-Type') || `image/${format}`);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Vary', 'Accept');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Resized', String(width));
    const out = new Response(upstream.body, { status: 200, headers });
    if (cache) {
      const put = cache.put(cacheKey, out.clone()).catch(() => undefined);
      if (runtime?.ctx?.waitUntil) runtime.ctx.waitUntil(put); else await put;
    }
    return out;
  } catch (err) {
    console.error('resize: failed', target, err);
    return original();
  }
}
