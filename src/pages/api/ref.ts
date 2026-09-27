export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { getDb } from '../../lib/get-db';
import { flightPackages } from '../../lib/db-schema';
import { slugify, normaliseCountryName } from '../../lib/holiday-transforms';
import { getCruiseCatalogue } from '../../lib/cruise-catalogue';
import { getSailingLadders } from '../../lib/cruise-detail';

export const GET: APIRoute = async (context) => {
  const id = context.url.searchParams.get('id')?.trim();
  if (!id) {
    return new Response('Missing reference number', { status: 400 });
  }

  // "10447" is a holiday; "10447-1114" is the quote reference from the cabin page:
  // that cruise's sailing on 14 Nov (the next one on or after today), so the desk
  // lands on the exact sailing the customer was looking at.
  const m = id.match(/^(\d+)(?:\s*-\s*(\d{2})(\d{2}))?$/);
  if (!m) {
    return new Response('Invalid reference number', { status: 400 });
  }
  const numId = parseInt(m[1], 10);
  const sailingMMDD = m[2] ? `${m[2]}-${m[3]}` : null;

  // Check DB
  try {
    const db = getDb(context);

    // Cruises first (IDs 10001+)
    const cruise = (await getCruiseCatalogue(db)).find(c => c.id === numId);
    if (cruise) {
      const country = slugify(cruise.country || 'europe');
      const base = `/Holidays/${country}/${cruise.slug}`;
      if (sailingMMDD) {
        const ladders = await getSailingLadders(db, numId); // future sailings, date ascending
        const sailing = ladders.find(l => l.date.slice(5) === sailingMMDD);
        return context.redirect(sailing ? `${base}/cabins?date=${sailing.date}` : `${base}#sailings`, 302);
      }
      return context.redirect(base, 302);
    }
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
