export const prerender = false;

import type { APIRoute } from 'astro';
import { serveResized, snapWidth } from '../../lib/image-resize';
import { REMOTE_IMAGE_HOSTS } from '../../lib/image-src';

/**
 * GET /img/remote?u=<allowlisted image URL>&w=<width>
 *
 * Resized third-party images (Widgety ship and cabin photos, whose signed URLs bake
 * in a 2400px geometry) for card slots. Only allowlisted hosts; anything else, or
 * any failure, redirects to the original so the page still shows a picture.
 */
export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  let upstream: URL;
  try {
    upstream = new URL(url.searchParams.get('u') || '');
  } catch {
    return new Response('Bad request', { status: 400 });
  }
  if (upstream.protocol !== 'https:' || !REMOTE_IMAGE_HOSTS.has(upstream.hostname)) {
    return new Response('Forbidden', { status: 403 });
  }

  const original = async () => Response.redirect(upstream.toString(), 302);
  const width = snapWidth(url.searchParams.get('w'));
  if (!width) return original();

  return serveResized(request, (locals as any).runtime, width, { kind: 'remote', url: upstream.toString() }, original);
};
