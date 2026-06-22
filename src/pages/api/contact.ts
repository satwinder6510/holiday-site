export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any).runtime;
  const webhookUrl = runtime?.env?.PRIVYR_WEBHOOK_URL;
  const intakeUrl = runtime?.env?.LEADS_INTAKE_URL;
  const intakeSecret = runtime?.env?.LEADS_INTAKE_SECRET;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { first_name, last_name, email, phone, form_type } = body;

  if (!first_name || !last_name || !email || !phone) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Primary path: speed-to-lead intake (auto-response + follow-ups + handoff) ──
  // The intake service holds the lead and only forwards warm ones to Privyr.
  if (intakeUrl && intakeSecret) {
    try {
      const res = await fetch(intakeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${intakeSecret}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      console.error('Lead intake non-OK, falling back to Privyr:', res.status, await res.text());
    } catch (err) {
      console.error('Lead intake error, falling back to Privyr:', err);
    }
  }

  // Build other_fields based on form type (used by both Privyr + emergency capture).
  const other_fields: Record<string, string> = {
    'Form Type': form_type || 'Contact Form',
    'Source': body.source || 'Direct',
    'Landing Page': body.landing_page || '',
    'Page URL': body.page_url || '',
  };
  if (body.page_title) other_fields['Page Title'] = body.page_title;

  if (form_type === 'Package Enquiry') {
    if (body.package_name) other_fields['Package Name'] = body.package_name;
    if (body.package_id) other_fields['Package ID'] = body.package_id;
    if (body.departure_date) other_fields['Departure Date'] = body.departure_date;
    if (body.departure_airport) other_fields['Departure Airport'] = body.departure_airport;
    if (body.num_adults) other_fields['Number of Adults'] = body.num_adults;
    if (body.price_per_person) other_fields['Price Per Person'] = body.price_per_person;
    if (body.total_price) other_fields['Total Price'] = body.total_price;
  } else {
    other_fields['Booking Reference'] = body.booking_ref || 'N/A';
    if (body.reason) other_fields['Reason'] = body.reason;
    if (body.message) other_fields['Message'] = body.message;
  }

  // ── Fallback 1: post to Privyr ──
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${first_name} ${last_name}`, email, phone, display_name: first_name, other_fields }),
      });
      if (res.ok) {
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      console.error('Privyr webhook non-OK, trying emergency capture:', res.status, await res.text());
    } catch (err) {
      console.error('Privyr webhook error, trying emergency capture:', err);
    }
  }

  // ── Last resort: write the lead straight to D1 so it is NEVER lost. The admin
  // API's every-15-min silent-fail scan picks it up (status='new') to run the SMS
  // cadence and alert admins. ──
  if (await emergencyCapture((locals as any).runtime?.env?.DB, body, other_fields)) {
    console.error('Lead captured via emergency D1 fallback (intake + Privyr both failed)');
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Everything failed — the lead is genuinely at risk. Log loudly for monitoring.
  console.error('LEAD LOST: intake, Privyr and emergency capture all failed', { email, phone, form_type });
  return new Response(JSON.stringify({ error: 'Failed to submit enquiry' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
};

/**
 * Emergency capture — insert the lead directly into D1 when both intake and Privyr
 * are unavailable. Bypasses all the speed-to-lead processing (the silent-fail scan
 * resumes that), but guarantees the customer's details are never lost.
 */
async function emergencyCapture(db: any, body: any, other_fields: Record<string, string>): Promise<boolean> {
  if (!db) return false;
  try {
    const now = new Date().toISOString();
    const phoneNorm = String(body.phone || '').replace(/[^\d+]/g, '');
    const subject = body.package_name || 'your holiday';
    other_fields['Capture'] = 'emergency-fallback';
    await db
      .prepare(
        `INSERT INTO leads (first_name, last_name, email, phone, phone_normalized, form_type, subject, other_fields, status, cadence_step, pipeline_stage, source, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', 0, 'new', ?, ?, ?)`,
      )
      .bind(
        body.first_name,
        body.last_name,
        body.email,
        body.phone,
        phoneNorm,
        body.form_type || 'Contact Form',
        subject,
        JSON.stringify(other_fields),
        body.source || 'website',
        now,
        now,
      )
      .run();
    return true;
  } catch (err) {
    console.error('Emergency D1 capture failed:', err);
    return false;
  }
}
