export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../lib/get-db';
import { getHolidayBySlugFromDb } from '../../lib/holidays-db';
import { roundToNine } from '../../lib/pricing-transforms';

// "Email me these dates and prices" (calendar modal, 2026-11-19).
// The browser sends only an address, the holiday's slug and the airport. The
// prices are worked out HERE from D1 with the same sums as the calendar, so
// nobody can make us email made-up numbers. The admin API sends the email and
// records the sign-up (POST /api/mailing/price-email, shared intake secret).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SITE = 'https://holidays.flightsandpackages.com';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async (ctx) => {
  const { request, locals } = ctx;
  const env = (locals as any).runtime?.env;
  const intakeUrl: string | undefined = env?.LEADS_INTAKE_URL;
  const intakeSecret: string | undefined = env?.LEADS_INTAKE_SECRET;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  // Honeypot, as on the contact form: pretend success, do nothing.
  if (typeof body.company === 'string' && body.company.trim() !== '') return json({ success: true });

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const airport = typeof body.airport === 'string' ? body.airport.trim() : '';
  if (!EMAIL_RE.test(email) || email.length > 200 || !/^[a-z0-9-]{1,200}$/i.test(slug) || airport.length > 10) {
    return json({ error: 'Invalid submission' }, 400);
  }
  if (!intakeUrl || !intakeSecret) {
    console.error('[price-email] LEADS_INTAKE_URL / LEADS_INTAKE_SECRET not set');
    return json({ error: 'Unavailable' }, 503);
  }

  let result: Awaited<ReturnType<typeof getHolidayBySlugFromDb>>;
  try {
    result = await getHolidayBySlugFromDb(getDb(ctx as any), slug);
  } catch (err) {
    console.error('[price-email] holiday lookup failed:', err);
    return json({ error: 'Unavailable' }, 503);
  }
  const pricing: any = result?.pricing;
  if (!result || !pricing?.departures?.length) return json({ error: 'No prices for this holiday' }, 404);

  const { holiday } = result;
  const local = holiday.localChargesPp || 0;
  const ap = pricing.airports.find((a: any) => a.code === airport) ?? pricing.airports[0];
  const rows = pricing.departures
    .filter((d: any) => d.airportCode === ap.code)
    .map((d: any) => ({ date: d.date, price: roundToNine(d.pricePp + local) }));
  if (!rows.length) return json({ error: 'No prices for this airport' }, 404);

  const payload = {
    email,
    opt_in: body.opt_in === true,
    package_id: String(holiday.id),
    package_name: holiday.title,
    package_url: `${SITE}/Holidays/${holiday.countrySlug}/${holiday.slug}`,
    duration: holiday.duration || '',
    airport_name: ap.name || ap.code,
    rows,
    other_airports: pricing.airports
      .filter((a: any) => a.code !== ap.code)
      .map((a: any) => ({ name: a.name || a.code, from: roundToNine(a.cheapestPrice + local) })),
    lead_source: typeof body.source === 'string' ? body.source.slice(0, 100) : '',
    page_url: typeof body.page_url === 'string' ? body.page_url.slice(0, 500) : '',
    ip: request.headers.get('CF-Connecting-IP') || '',
  };

  try {
    const res = await fetch(intakeUrl.replace(/\/api\/leads\/intake\/?$/, '/api/mailing/price-email'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${intakeSecret}` },
      body: JSON.stringify(payload),
    });
    if (res.ok) return json({ success: true });
    console.error('[price-email] admin API non-OK:', res.status, await res.text());
  } catch (err) {
    console.error('[price-email] admin API error:', err);
  }
  return json({ error: 'Could not send' }, 502);
};
