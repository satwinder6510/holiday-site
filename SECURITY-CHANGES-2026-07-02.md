# Security Changes — 2026-07-02

Documentation written BEFORE code changes, per project rules. Scope: holiday-site
(Astro 5 hybrid on Cloudflare Pages). All changes are defence-in-depth hardening;
no functional behaviour changes for legitimate visitors.

---

## 1. Privyr webhook URL removed from `wrangler.toml` (secret out of git)

**What:** `wrangler.toml` line 19 contained the live Privyr incoming-leads webhook URL
in `[vars]`, and the file is tracked in git. Anyone with repo access (or the git
history) can inject fake leads into the CRM. The line is removed and replaced with a
comment explaining how to set it as a Cloudflare Pages secret.

**Files:** `wrangler.toml`

**Code impact:** none — `src/pages/api/contact.ts` already reads
`runtime.env.PRIVYR_WEBHOOK_URL`, which resolves identically whether the value comes
from `[vars]` or a Pages secret. If the secret is missing, the endpoint already
degrades gracefully (intake → D1 emergency capture still run).

**OPERATOR ACTIONS (amended 2026-07-02 — Privyr is being retired):**
The in-house CRM has replaced Privyr, so NO rotation and NO secret are needed.
Do NOT set `PRIVYR_WEBHOOK_URL` — the Privyr tier stays dormant and the contact
flow runs intake → D1 emergency capture (verified graceful).
1. When you cancel/close the Privyr account, **delete or disable the incoming-leads
   webhook in the Privyr dashboard first** — that kills the URL leaked in git
   history. Until then it remains a live lead-injection vector into Privyr only
   (not into the in-house CRM).
2. Follow-up cleanup (optional): remove the Privyr relay tier from
   `src/pages/api/contact.ts` and the `pushToPrivyr` path in holiday-admin-api
   (`privyr_push_enabled` site setting already gates it) once cutover is final.

---

## 2. `/api/contact` endpoint hardening

**What:** `src/pages/api/contact.ts` accepted any JSON body, with no length caps or
email format check, and forwarded the **raw client body** (`JSON.stringify(body)`)
to the leads-intake service — letting a client relay arbitrary unknown keys
downstream. It also had no bot deterrent.

**Changes:**
- **Validation:** simple RFC-lite email regex; length caps — `first_name`/`last_name`
  ≤ 100, `email` ≤ 200, `phone` ≤ 40, `message` ≤ 5000, `booking_ref` ≤ 50, all other
  string fields ≤ 500. Oversized/invalid input → `400 { "error": "Invalid submission" }`.
- **Honeypot:** if the hidden `company` field arrives non-empty (only bots fill it),
  the endpoint returns `{ success: true }` (200) **without forwarding anywhere** and
  logs `[contact] honeypot triggered`. Bots get no failure signal.
- **Allowlisted forwarding:** the intake POST now sends an explicit object built from
  a fixed field allowlist (the same fields the Privyr payload uses) instead of
  relaying the raw body. Unknown keys are dropped.
- The existing 3-tier fallback (intake → Privyr → D1 emergency capture) is unchanged.

**Honeypot form field:** a hidden `company` text input (offscreen, `tabindex="-1"`,
`aria-hidden`) is added to both forms that POST to `/api/contact`:
- the enquiry modal form in `src/pages/Holidays/[country]/[slug].astro`
- the contact form in `src/pages/contact.astro`

Both forms build their POST payload from `FormData`, so the field is included
automatically — no submit-handler changes needed. The enquiry modal's focus-trap
selector is adjusted to skip `tabindex="-1"` inputs so keyboard focus can never land
on the hidden honeypot.

**Files:** `src/pages/api/contact.ts`, `src/pages/contact.astro`,
`src/pages/Holidays/[country]/[slug].astro`

**Operator actions:** none. Watch logs for `[contact] honeypot triggered` to gauge
bot volume.

---

## 3. Security response headers (`public/_headers`)

**What:** baseline security headers on all routes: `X-Frame-Options: SAMEORIGIN`
(clickjacking), `X-Content-Type-Options: nosniff` (MIME sniffing), `Referrer-Policy:
strict-origin-when-cross-origin`, `Permissions-Policy` (deny camera/mic/geolocation),
and HSTS (1 year, include subdomains).

**AMENDED 2026-07-02 (found at deploy verification):** Cloudflare Pages `_headers`
only applies to STATIC assets/SSG pages — SSR (Worker-rendered) responses shipped
without any of these headers, and on this hybrid site the homepage and every holiday
detail page are SSR (the primary content). Fix: new `src/middleware.ts` (Astro
middleware) sets the same five headers on every server-rendered response (skipping
any already set by a route). Coverage is now: SSG/static via `public/_headers`,
SSR via middleware — both sources kept in sync manually (single list, documented in
both files' comments).

**Files:** `public/_headers` (new), `src/middleware.ts` (new)

**Follow-up work (documented, not done):** a full `Content-Security-Policy` is
deferred — the site has many inline `<script>` blocks that would each need nonces or
hashes; shipping a CSP now would break them. Plan a dedicated pass.

**Operator actions:** none for this site. Note HSTS `includeSubDomains` applies to
subdomains of the deployed host — verify all sibling subdomains serve HTTPS (they do
on Cloudflare).

---

## 4. Stored-XSS defang for DB/CMS/supplier HTML (`src/lib/sanitize.ts`)

**What:** holiday detail pages render database-sourced HTML via `set:html` with no
sanitisation (overview, accommodation descriptions, itinerary descriptions, review,
otherInfo, excluded/requirements/attention bullet lists), and the blog page renders
imported blog HTML the same way. If the admin panel or a supplier feed were ever
compromised, injected `<script>`/event-handler HTML would execute on every visitor.

**Changes:**
- New `src/lib/sanitize.ts` exporting `sanitizeHtml()` — a regex **defang filter**,
  not a full HTML parser. Content authors are trusted admins; this is
  defence-in-depth against a compromised admin panel or supplier feed. It strips
  `<script>`/`<style>` blocks, `<iframe|object|embed|form|link|meta>` tags, inline
  `on*=` event handlers, and neutralises `javascript:` / `data:text/html` in
  href/src values. **Future work:** run a parser-based sanitizer (e.g. sanitize-html
  / DOMPurify) at content-import time instead.
- Applied `sanitizeHtml(...)` to every `set:html` rendering DB/supplier content in
  `src/pages/Holidays/[country]/[slug].astro` (overview at ~350, accommodation ~410,
  itinerary ~434, review ~447, otherInfo ~502, excluded/requirements/attention
  ~524–536) and to `blog.content` in `src/pages/blog/[slug].astro` (~117).
- **Not touched:** `set:html` of build-time constants and JSON-LD
  `<script type="application/ld+json">` blocks (safe `JSON.stringify` of known data).
- **Script-embed hardening:** the DB-derived JSON embedded in
  `<script type="application/json">` tags on the holiday page (`pricing-data`,
  `local-charges-data`, `holiday-meta`) now has `<` escaped as `\u003c` to prevent a
  `</script>` breakout from string values. `JSON.parse` is unaffected.

**Files:** `src/lib/sanitize.ts` (new), `src/pages/Holidays/[country]/[slug].astro`,
`src/pages/blog/[slug].astro`

**Operator actions:** none. If a holiday/blog ever renders oddly after this, check
whether its stored HTML contained one of the stripped tags (it shouldn't).

---

## 5. R2 image route resilience (`src/pages/objects/images/[...path].ts`)

**What:** the route crashed with an unhandled 500 if the `IMAGES` R2 binding was
missing (`runtime.env.IMAGES` without optional chaining — its sibling
`src/pages/api/media/[...path].ts` already guards this) and had no error handling
around `bucket.get`. It also served whatever content-type was stored on the object,
so a non-image uploaded to the bucket could be served as e.g. `text/html`.

**Changes:**
- Optional-chained binding lookup + 404 when missing (mirrors the media route).
- `bucket.get` wrapped in try/catch → 503 on R2 errors.
- Content-type allowlist: if the stored content type doesn't start with `image/`,
  the response is served as `application/octet-stream`.
- `X-Content-Type-Options: nosniff` added to responses.
- Existing cache headers unchanged.

**Files:** `src/pages/objects/images/[...path].ts`

**Operator actions:** none.

---

## Operator checklist (summary)

- [ ] ~~Set/rotate PRIVYR_WEBHOOK_URL~~ — NOT needed (Privyr retired; see amended section 1). Leave the secret unset.
- [ ] Delete/disable the incoming-leads webhook in the Privyr dashboard when closing the account (kills the git-history leak)
- [ ] Schedule follow-up: full Content-Security-Policy with nonces for inline scripts
- [ ] Schedule follow-up: parser-based HTML sanitisation at content-import time
