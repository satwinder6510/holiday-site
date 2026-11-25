export const prerender = false;

import type { APIRoute } from 'astro';

// "Email me deals" (2026-11-25). Our own one-box form, so it shows at once on a
// phone instead of waiting for Spotler's ~300KB of scripts. The admin API stores
// the address opted in (mailing_signups, source 'deals_signup'); staff export new
// sign-ups as a CSV for the Spotler import, like the other website sign-ups.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  const intakeUrl: string | undefined = env?.LEADS_INTAKE_URL;
  const intakeSecret: string | undefined = env?.LEADS_INTAKE_SECRET;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  // Honeypot: pretend success, store nothing.
  if (typeof body.company === 'string' && body.company.trim() !== '') return json({ success: true });

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!EMAIL_RE.test(email) || email.length > 200) return json({ error: 'Please check your email address' }, 400);
  if (!intakeUrl || !intakeSecret) {
    console.error('[deals-signup] LEADS_INTAKE_URL / LEADS_INTAKE_SECRET not set');
    return json({ error: 'Unavailable' }, 503);
  }

  try {
    const res = await fetch(intakeUrl.replace(/\/api\/leads\/intake\/?$/, '/api/mailing/signup'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${intakeSecret}` },
      body: JSON.stringify({
        email,
        where: typeof body.where === 'string' ? body.where.slice(0, 200) : '',
        lead_source: typeof body.source === 'string' ? body.source.slice(0, 100) : '',
        page_url: typeof body.page_url === 'string' ? body.page_url.slice(0, 500) : '',
        ip: request.headers.get('CF-Connecting-IP') || '',
      }),
    });
    if (res.ok) return json({ success: true });
    console.error('[deals-signup] admin API non-OK:', res.status, await res.text());
  } catch (err) {
    console.error('[deals-signup] admin API error:', err);
  }
  return json({ error: 'Could not sign you up just now' }, 502);
};
