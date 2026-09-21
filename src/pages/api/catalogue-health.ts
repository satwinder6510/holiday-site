export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../lib/get-db';
import { getCruiseCatalogue, catalogueStats } from '../../lib/cruise-catalogue';

/**
 * Where the cruise catalogue came from on this request, and how long it took.
 *
 * The catalogue sits on the critical path of every SSR page (the header's
 * country nav needs it), so when a listing feels slow this says whether the
 * cost is the isolate memo, the per-colo cache, or a cold read from D1.
 */
export const GET: APIRoute = async (context) => {
  const t0 = Date.now();
  const catalogue = await getCruiseCatalogue(getDb(context));
  const elapsed = Date.now() - t0;

  return new Response(
    JSON.stringify({ offers: catalogue.length, elapsedMs: elapsed, ...catalogueStats() }, null, 2),
    { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } },
  );
};
