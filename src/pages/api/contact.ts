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

  // ── Fallback path: post straight to Privyr so a lead is never lost ──
  if (!webhookUrl) {
    return new Response(JSON.stringify({ error: 'Webhook not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Build other_fields based on form type
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

  const privyrPayload = {
    name: `${first_name} ${last_name}`,
    email,
    phone,
    display_name: first_name,
    other_fields,
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(privyrPayload),
    });

    if (!res.ok) {
      console.error('Privyr webhook error:', res.status, await res.text());
      return new Response(JSON.stringify({ error: 'Failed to submit enquiry' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Privyr webhook error:', err);
    return new Response(JSON.stringify({ error: 'Failed to submit enquiry' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
