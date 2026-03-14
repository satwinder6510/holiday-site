export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { getDb } from '../../lib/get-db';
import { flightPackages } from '../../lib/db-schema';
import { slugify, normaliseCountryName } from '../../lib/holiday-transforms';
import rawCruises from '../../data/cruise-export.json';

export const GET: APIRoute = async (context) => {
  const id = context.url.searchParams.get('id')?.trim();
  if (!id) {
    return new Response('Missing reference number', { status: 400 });
  }

  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    return new Response('Invalid reference number', { status: 400 });
  }

  // Check cruises first (IDs 10001+)
  const cruise = (rawCruises as any[]).find((c: any) => c.id === numId);
  if (cruise) {
    const country = slugify(cruise.country || 'europe');
    return context.redirect(`/Holidays/${country}/${cruise.slug}`, 302);
  }

  // Check DB
  try {
    const db = getDb(context);
    const rows = await db
      .select({ slug: flightPackages.slug, category: flightPackages.category })
      .from(flightPackages)
      .where(eq(flightPackages.id, numId))
      .limit(1);

    if (rows.length === 0) {
      return new Response('Holiday not found. Please check the reference number and try again.', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    const country = slugify(normaliseCountryName(rows[0].category || ''));
    return context.redirect(`/Holidays/${country}/${rows[0].slug}`, 302);
  } catch (e) {
    console.error('Ref lookup error:', e);
    return new Response('Service temporarily unavailable', { status: 503 });
  }
};
