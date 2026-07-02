export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  const key = `objects/images/${params.path}`;
  const runtime = (locals as any).runtime;
  const bucket = runtime?.env?.IMAGES;

  if (!bucket) {
    return new Response('Not found', { status: 404 });
  }

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
