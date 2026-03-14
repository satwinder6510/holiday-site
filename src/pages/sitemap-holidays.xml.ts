export const prerender = false;

import type { APIRoute } from 'astro';
import { createDb } from '../lib/db';
import { getAllListedHolidaysFromDb } from '../lib/holidays-db';
import { allCollections } from '../data/collections-static';

const SITE = 'https://holidays.flightsandpackages.com';

export const GET: APIRoute = async ({ locals }) => {
  const runtime = (locals as any).runtime;

  try {
    const db = createDb(runtime.env.HYPERDRIVE.connectionString);
    const holidays = await getAllListedHolidaysFromDb(db);

    // Collect unique country slugs with latest update date
    const countryLastmod = new Map<string, string>();
    for (const h of holidays) {
      const existing = countryLastmod.get(h.countrySlug);
      if (!existing || (h.updatedAt && h.updatedAt > existing)) {
        countryLastmod.set(h.countrySlug, h.updatedAt || '');
      }
    }

    // Collection slugs (excluding river-cruises which has its own page)
    const collectionSlugs = allCollections
      .filter(c => c.href !== '/Holidays/river-cruises')
      .map(c => c.href.replace('/Holidays/', ''));

    const urls: { loc: string; lastmod?: string }[] = [];

    // River cruises landing page
    urls.push({ loc: `${SITE}/Holidays/river-cruises` });

    // Country listing pages
    for (const [slug, lastmod] of countryLastmod) {
      urls.push({ loc: `${SITE}/Holidays/${slug}/`, lastmod: lastmod ? lastmod.substring(0, 10) : undefined });
    }

    // Collection listing pages
    for (const slug of collectionSlugs) {
      urls.push({ loc: `${SITE}/Holidays/${slug}` });
    }

    // Individual holiday detail pages
    for (const h of holidays) {
      urls.push({ loc: `${SITE}/Holidays/${h.countrySlug}/${h.slug}`, lastmod: h.updatedAt ? h.updatedAt.substring(0, 10) : undefined });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (e) {
    console.error('Sitemap generation error:', e);
    return new Response('Sitemap temporarily unavailable', { status: 503 });
  }
};

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
