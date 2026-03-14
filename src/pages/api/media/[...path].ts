export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  const key = `api/media/${params.path}`;
  const runtime = (locals as any).runtime;
  const bucket = runtime?.env?.IMAGES;

  if (!bucket) {
    return new Response('Not found', { status: 404 });
  }

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
