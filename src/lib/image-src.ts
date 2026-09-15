/**
 * Build a resized image URL for templates. Pair with `src/lib/image-resize.ts`.
 *
 *   imgSrc('/objects/images/x.jpg', 800)      → '/objects/images/x.jpg?w=800'
 *   imgSrc('https://widgety.co.uk/media/…', 800) → '/img/remote?w=800&u=…'
 *   imgSrc('https://elsewhere/x.jpg', 800)    → unchanged
 *
 * Widths are snapped server-side to WIDTH_LADDER, so ask for what the slot needs at
 * 2x and let the route round it. Unknown hosts are returned untouched.
 */

const SITE_ORIGIN = 'https://holidays.flightsandpackages.com';
const LOCAL_PREFIXES = ['/objects/images/', '/api/media/'];
export const REMOTE_IMAGE_HOSTS = new Set(['widgety.co.uk', 'www.widgety.co.uk', 'assets.widgety.co.uk', 'holidays.flightsandpackages.com']);

export function imgSrc(url: string | null | undefined, width: number): string {
  if (!url) return '';
  let path = url;
  if (url.startsWith(SITE_ORIGIN)) path = url.slice(SITE_ORIGIN.length);
  if (LOCAL_PREFIXES.some(p => path.startsWith(p))) {
    return `${path}${path.includes('?') ? '&' : '?'}w=${width}`;
  }
  // Static files under public/images: resize via the remote route against the live site
  // (in local dev the file is served as-is, since it may not be deployed yet).
  if (path.startsWith('/images/')) {
    if (import.meta.env.DEV) return path;
    return `/img/remote?w=${width}&u=${encodeURIComponent(SITE_ORIGIN + path)}`;
  }
  try {
    const u = new URL(url);
    if (REMOTE_IMAGE_HOSTS.has(u.hostname)) {
      return `/img/remote?w=${width}&u=${encodeURIComponent(url)}`;
    }
  } catch {
    /* relative or malformed — leave as is */
  }
  return url;
}
