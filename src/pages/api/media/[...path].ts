export const prerender = false;

import type { APIRoute } from 'astro';
import { serveResized, snapWidth } from '../../../lib/image-resize';

export const GET: APIRoute = async ({ params, locals, request }) => {
  const key = `api/media/${params.path}`;
  const runtime = (locals as any).runtime;
  const bucket = runtime?.env?.IMAGES;

  if (!bucket) {
    return new Response('Not found', { status: 404 });
  }
  // Local dev only: the local R2 is empty, so review pages against production's images.
  if (import.meta.env.DEV) {
    const u = new URL(request.url);
    return new Response(null, { status: 302, headers: { Location: `https://holidays.flightsandpackages.com${u.pathname}${u.search}` } });
  }

  // `?w=<px>` → resized variant (see lib/image-resize.ts); no param → original bytes.
  const width = snapWidth(new URL(request.url).searchParams.get('w'));
  if (width) {
    return serveResized(request, runtime, width, { kind: 'r2', key }, () => serveOriginal(bucket, key));
  }
  return serveOriginal(bucket, key);
};

// `bucket` is the R2 binding; typed loosely so workers-types' Headers/ReadableStream
// don't collide with the DOM lib types this Astro project compiles against.
async function serveOriginal(bucket: any, key: string): Promise<Response> {
  const object = await bucket.get(key);
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'image/jpeg');
  }

  return new Response(object.body, { headers });
};
