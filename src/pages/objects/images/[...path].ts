export const prerender = false;

import type { APIRoute } from 'astro';
import { serveResized, snapWidth } from '../../../lib/image-resize';

export const GET: APIRoute = async ({ params, locals, request }) => {
  const key = `objects/images/${params.path}`;
  const runtime = (locals as any).runtime;
  const bucket = runtime?.env?.IMAGES;

  if (!bucket) {
    return new Response('Not found', { status: 404 });
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
  let object;
  try {
    object = await bucket.get(key);
  } catch (err) {
    console.error('R2 get failed for', key, err);
    return new Response('Service temporarily unavailable', { status: 503 });
  }
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'image/jpeg');
  }
  // Only ever serve images from this route — anything else is downloaded inert.
  if (!(headers.get('Content-Type') || '').startsWith('image/')) {
    headers.set('Content-Type', 'application/octet-stream');
  }
  headers.set('X-Content-Type-Options', 'nosniff');

  return new Response(object.body, { headers });
};
