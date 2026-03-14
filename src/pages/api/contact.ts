export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any).runtime;
  const webhookUrl = runtime?.env?.PRIVYR_WEBHOOK_URL;

  if (!webhookUrl) {
    return new Response(JSON.stringify({ error: 'Webhook not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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

  // Build other_fields based on form type
  const other_fields: Record<string, string> = {
    'Form Type': form_type || 'Contact Form',
    'Source': body.source || 'Direct',
    'Landing Page': body.landing_page || '',
    'Page URL': body.page_url || '',
  };

  if (form_type === 'Package Enquiry') {
    if (body.package_name) other_fields['Package Name'] = body.package_name;
    if (body.package_id) other_fields['Package ID'] = body.package_id;
    if (body.departure_date) other_fields['Departure Date'] = body.departure_date;
    if (body.num_adults) other_fields['Number of Adults'] = body.num_adults;
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
