# Flights and Packages - Holiday Site

## Project

Astro 5 hybrid site (SSG + SSR) for a holiday booking website. Holiday pages are SSR (live data from Cloudflare D1). Blog, destination, and static pages remain SSG. Tailwind CSS v3 for utility classes, scoped `<style>` blocks for complex page-specific CSS. No React — pure Astro components with vanilla JS in `<script>` tags.

## Tech Stack

- **Framework:** Astro 5.18 (`output: "hybrid"`, `site: 'https://holidays.flightsandpackages.com'`)
- **Database:** Cloudflare D1 (ID: `fd1870e7-9ad7-45a3-97fc-71f904189066`, holiday-flights-db)
- **ORM:** Drizzle ORM with D1 driver
- **Styling:** Tailwind CSS 3 + scoped CSS in `<style>` blocks
- **Carousel:** Embla Carousel 8 (with fade plugin)
- **SEO:** `@astrojs/sitemap` integration (auto-generates sitemap-index.xml)
- **Build:** `npm run build` outputs to `dist/`
- **Dev:** `npm run dev` on port 4321
- **Deploy:** `cd /Users/admin/holiday-site && ./deploy.sh` (builds, verifies dist/ is Astro not admin SPA, deploys, smoke-tests)

## Brand

- **Name:** Flights and Packages
- **Primary colour:** `#20A1AA` (teal)
- **Secondary colour:** `#424242` (dark grey)
- **Header/Footer bg:** `#073140` (dark navy)
- **CTA orange:** `#ff7f00`
- **Fonts:** BentonSans (body, 7 weights via @font-face in `public/fonts/`), CaslonGraphiqueEF (display/headings, `font-family: 'CaslonGraphiqueEF'`)

## Project Structure

```
src/
  components/    # Astro components (Header, Footer, PageHero, carousels, cards, BreadcrumbSchema)
  data/          # Data layer: JSON exports + TypeScript transformation modules (used by SSG pages)
    holidays.ts  # Re-exports from lib/holiday-transforms, used by SSG pages
    blogs.ts     # Transforms blog-export.json → typed Blog arrays
    pricing.ts   # Re-exports from lib/pricing-transforms, used by SSG pages
    countries.ts # Country card data for homepage carousel (49 countries, local images)
    navigation.ts # Nav menu items + buildDestinationRegions() for dynamic nav
    collections-static.ts  # Static collection definitions (no data imports)
    holiday-export.json    # 139 holidays from live site (SSG fallback)
    cruise-export.json     # 160 river cruise offers (used by SSR pages directly)
    blog-export.json       # 140 blog posts from live site
    pricing-export.json    # Date-wise pricing data (SSG fallback)
  lib/           # Shared libraries for SSR + SSG
    holiday-transforms.ts  # Pure transform functions: transformHoliday, transformCruise, slugify, etc.
    pricing-transforms.ts  # Pure pricing transforms: transformHolidayPricing, formatPrice, etc.
    db.ts                  # D1 database client factory
    db-schema.ts           # Drizzle D1 schema for flight_packages + package_pricing
    get-db.ts              # getDb(Astro) helper — extracts DB from Astro.locals.runtime.env.DB
    holidays-db.ts         # SSR query functions: getHolidayBySlugFromDb, getAllListedHolidaysFromDb, etc.
  layouts/       # BaseLayout.astro (html wrapper, head, SEO meta, font imports)
  pages/         # Astro pages — file-based routing
    Holidays/    # SSR: search, country/collection, holiday detail, river-cruises (capital H)
    blog/        # SSG: Blog listing and post pages
    destinations/# SSG: Region pages
public/
  fonts/         # BentonSans + CaslonGraphiqueEF font files
  icons/         # SVG icons
  images/        # Heroes, collections, countries, destinations
  robots.txt     # Crawl directives + sitemap reference
  llms.txt       # AI crawler site description
```

## City Tax & Price Rounding

### Price Display Formula

All customer-facing prices use this formula:
```
displayPrice ?? roundToNine(basePrice + localChargesPp)
```

1. `basePrice + localChargesPp` — adds exact per-person local charges (city tax + port fees) to the base price
2. `roundToNine()` — rounds the combined total to the nearest price point ending in 9 (09, 19, 29, …, 99)

**Important:** Add local charges first, THEN round the combined total. Never round the base price separately.

### City Tax System

- **Data:** `src/data/city-taxes.json` — per-city tax rates by star rating, with exchange rates
- **Transform:** `calculateLocalCharges()` in `holiday-transforms.ts` — returns `{ total, items: LocalChargeItem[] }`
- **Per-city config:** Each holiday can have `cityTaxConfig[]` with city, nights, optional starRating per stop
- **Fallback:** If no per-city config, uses highest rate for the country based on star rating
- **Additional charges:** Port fees etc. processed independently via `additionalCharge*` fields
- **Display:** Detail pages show local charges breakdown below the main price
- **DB fields:** `city_tax_enabled` (boolean), `city_tax_config` (JSON array), `display_price` (manual override)

### Display Price Overrides

`displayPrice` field on holidays allows manual price override. Priority: `displayPrice` > auto-calculated price.

## Key Patterns

- **Layout:** All pages use `BaseLayout.astro` which includes Header, Footer, MobileNav, MobileCallCTA
- **Hero:** Use `PageHero.astro` for standard heroes. Holiday detail and country pages have custom inline heroes. Detail page hero hides `.hero-content` (discover label + h1) at ≤610px — only the overlay bar (`.search-section`) shows on mobile.
- **SSR pages (live data):** Holiday detail `[slug].astro`, country/collection `[country]/index.astro`, search, river-cruises — use `export const prerender = false` and query D1 via `getDb(Astro)` + functions from `holidays-db.ts`. New offers/prices appear instantly from D1.
- **SSG pages (build-time):** Blog, destinations, collections listing, about, contact, T&Cs — use `getStaticPaths()` and data from JSON exports in `src/data/`.
- **Dynamic navigation:** Header.astro and MobileNav.astro query D1 for active countries on SSR pages, falling back to static data from `navigation.ts` on SSG pages. `buildDestinationRegions()` in `navigation.ts` accepts any country list and groups into regions. `getNavCountriesFromDb()` in `holidays-db.ts` provides the lightweight DB query.
- **Country/Collection merged route:** `[country]/index.astro` handles both country pages (`/Holidays/italy/`) and collection pages (`/Holidays/Beach`). It checks `allCollections` first, falls back to country lookup.
- **Data layer:** Pure transform functions live in `src/lib/holiday-transforms.ts` and `src/lib/pricing-transforms.ts`, shared by both SSR (DB rows → RawHoliday → HolidayDetail) and SSG (JSON → same pipeline).
- **Pricing data layer:** SSR pages get pricing from D1 `package_pricing` table (filtered to future dates via `gte(departureDate, today)`). SSG pages use `pricing-export.json` as fallback (also filtered at export time). Both use `transformHolidayPricing()` from `pricing-transforms.ts`, which filters past dates and returns `null` when no future dates remain.
- **Holiday images:** All relative paths need `https://holidays.flightsandpackages.com` base URL prepended (handled by `resolveImageUrl()` in holiday-transforms.ts)
- **Blog images:** Already absolute URLs from `admin.citiesandbeaches.com`
- **Pricing calendar:** Holiday detail pages with pricing data show an inline airport/date picker section, a single-month calendar modal with prev/next navigation, and a mobile bottom bar. Pricing data is embedded via `<script type="application/json">` and driven by vanilla JS. Uses `:global()` CSS selectors for JS-rendered elements (Astro scoped CSS workaround).
- **Past-date filtering:** Three layers prevent stale prices: (1) DB query filters `departure_date >= today`, (2) `transformHolidayPricing()` filters individual dates and returns null if empty, (3) export script filters at query time. Callers handle null return gracefully.
- **Responsive:** Desktop-first with breakpoints at 1360, 1260, 1100, 940, 768, 610, 450px
- **Section container:** `.section-container` class = `max-width: 1240px; margin: 0 auto;` with responsive padding
- **Country hero overrides:** `heroOverrides` map in `[country]/index.astro` provides custom hero images for select countries (Italy, Spain, France, Hungary, Austria, Greece) and collections (Special Offer). Falls back to first holiday's hero image.
- **Ref lookup API:** `GET /api/ref?id=123` — SSR endpoint that redirects to the correct holiday detail page by package ID (checks cruises first, then DB)

## River Cruises

River cruise offers are **mixed in with regular holidays** — no separate `/cruises` section.

- **Data source:** `cruise-export.json` (198 offers) generated by `holiday-admin-api/scripts/export-cruises.ts` + enriched by `price-cruise-flights.ts`
- **Transform:** `holidays.ts` → `transformCruise()` converts each cruise into a `HolidayDetail` object
- **Tags:** All cruises automatically tagged `['River Cruise']` for filtering
- **Operators:** CroisiEurope + A-Rosa
- **URL pattern:** `/Holidays/[country]/[slug]` — same as regular holidays
- **Country distribution:** Most under `/Holidays/europe/`, rest under country-specific routes
- **ID offset:** Cruise offer IDs start at 10001+ to avoid collisions with flight_packages IDs
- **Deduplication:** Sailings deduplicated by date in export — cheapest cabin price wins when multiple cabin types share same departure date

### Two Pricing Paths (both active)

| Path | Source | Updated by | Deploy needed? |
|------|--------|-----------|---------------|
| **Static JSON** | `cruise-export.json` → `cruisePricingMap` (module-level) | Manual scripts + deploy | Yes |
| **Live DB** | `cruise_flight_prices` table via D1 | Weekly cron queue (automatic) | No |

- **Detail pages try DB first** (`getCruisePricingFromDb()` in `holidays-db.ts`), fall back to static `cruisePricingMap`
- **Pricing calendar:** Same UI as regular holidays — airport dropdown → date grid → per-person price

### Non-Price Data (persists, never overwritten by cron)
- **Itinerary:** JSONB in `cruise_routes.itinerary` — 230/284 routes populated from Widgety port_visits. Rendered in Itinerary tab
- **Description:** 245/284 routes have description text
- **Gallery:** 100/284 routes — export uses first gallery image or ship cover as featured_image fallback
- **Ship details:** 100% complete — description, cover image, class, cabin images from Widgety raw_data
- **Duration:** `vacation_days - 1` (full trip including hotel stays), not just `cruise_nights`

### Update Procedures
- **Price-only refresh:** Automated weekly via cron — no action needed
- **Full re-sync (new routes/offers):** Run pipeline in holiday-admin-api: sync-widgety → batch-create-offers → export-cruises → price-cruise-flights, then rebuild + deploy this site
- **New route itinerary:** Run `POST /api/cruises/sync-itineraries` on holiday-admin-api, then re-export + deploy

### River Cruises Listing Page

- **Route:** `src/pages/Holidays/river-cruises/[...river].astro` — SSR catch-all route
- **URL pattern:** `/Holidays/river-cruises/` (all rivers) or `/Holidays/river-cruises/danube` (specific river)
- **Sidebar:** Accordion nav grouped by river name, with collapsible route listings
- **`slugifyRiver()`** in `holiday-transforms.ts` — converts river names to URL slugs
- **Filters:** Price range (min/max), duration, board type, cabin type, operator — all via JS-driven accordion sidebar
- **Sort:** Price (low/high), duration (short/long), departure date — ARIA listbox with keyboard navigation (ArrowUp/Down/Home/End)

## SEO Infrastructure

- **URL routing:** Pages directory is `src/pages/Holidays/` (capital H). `slugify()` lowercases country names. URLs match live site: `/Holidays/italy/slug`.
- **BaseLayout props:** `title`, `description`, `image`, `type` (og:type), `noindex`. Includes canonical URL, OG tags, Twitter Card, and Organization JSON-LD on every page.
- **`<slot name="head" />`** in BaseLayout for injecting page-specific JSON-LD schemas.
- **BreadcrumbSchema.astro:** Reusable component — pass `items` array with `{name, url?}`. Used on holiday detail, country, and blog pages.
- **Product JSON-LD:** Holiday detail pages output `Product` schema with `Offer` or `AggregateOffer` (when pricing data exists).
- **BlogPosting JSON-LD:** Blog post pages output `BlogPosting` schema.
- **Sitemap:** Auto-generated by `@astrojs/sitemap`. Search page filtered out.
- **robots.txt / llms.txt:** Static files in `public/`.
- **Blog cross-linking:** Holiday detail pages show destination-relevant blog cards (filtered by country name), falling back to latest 4 if fewer than 2 matches.

## Accessibility (UX audit applied 2026-03-15)

Listing pages (`[country]/index.astro`, `river-cruises/[...river].astro`) have had 4 rounds of UX + 1 responsive audit:

- **Accordion headers:** Native `<button>` elements (not `<div role="button">`) with `aria-expanded`
- **Card titles:** `<a>` links (not `<div>`) with `focus-visible` outline
- **Decorative elements:** `aria-hidden="true"` on icon spans, gallery links, hero images
- **Price display:** `aria-label` with readable price, inner symbols `aria-hidden`
- **Sort selector:** ARIA listbox with Home/End/ArrowUp/ArrowDown/Enter/Space keyboard nav
- **Focus-visible states:** `.btn-primary`, card links, accordion headers, form inputs, sort options
- **Screen reader text:** `.sr-only` class in `global.css` for visually hidden labels
- **prefers-reduced-motion:** CSS transitions and JS scroll behavior
- **Search form:** `role="search"` + `aria-label` on country page
- **Responsive images:** `width: 100%; max-width: Xpx` pattern for fluid images
- **Touch targets:** Min 44px height on interactive elements at mobile
- **Breadcrumbs:** 13px font, `max-width: calc(100vw - 40px)` for mobile wrapping

## Conventions

- Scoped `<style>` for page-specific CSS (not Tailwind) when porting complex layouts from the original CSS files
- Vanilla `<script>` tags for interactivity (accordions, tabs, carousels, filter toggles) — no framework JS
- SVG icons stored in `public/icons/` and referenced via `<img src="/icons/name.svg">`
- **Country card images:** 49 local images in `public/images/countries/` (migrated from old CDN 2026-03-19). Referenced by `src/data/countries.ts` using `/images/countries/{Name}_icon.jpg` paths.
- Image paths use absolute URLs from the original site's CDN where available, local paths in `public/images/` otherwise
- **R2-served images:** `/objects/images/...` and `/api/media/...` paths are served from Cloudflare R2 bucket `holidays-images` via SSR API routes. ~10,148 images migrated from Replit (2026-03-14).
- **Global CSS utilities:** `global.css` has `.btn-primary` (with `:focus-visible`), `.sr-only`, `.section-container`

## Analytics & Tracking (in BaseLayout.astro `<head>`)
- **Facebook Pixel:** ID `2922972984621050` — PageView on every page
- **Microsoft Clarity:** Added for session replay and heatmaps
- **Traffic source tracking:** vanilla JS, stores `lead_source` + `landing_page` in sessionStorage
- **Cookie banner:** UK PECR/GDPR compliant, sets `cookie_consent=1` cookie for 1 year
- **Error monitoring:** JS beacon sends uncaught errors + broken images to `holiday-admin-api /api/monitor/errors`

## Holiday Detail Page (`[slug].astro`)

- **Sidebar:** 350px desktop, 280px tablet. Image from gallery (2nd image), falls back to hero.
- **Ref number:** Teal (`#20A1AA`), BentonSansMedium, 13px — displayed at top of sidebar
- **More Info tab:** Always visible. Shows default exclusion bullets (Travel Insurance, Personal Expenses, Gratuities, Optional Activities, Meals not included) plus DB-driven `excluded`, `requirements`, `attention` fields when populated. `toBulletList()` helper normalizes three DB data formats (plain text with `\n`, malformed HTML, proper `<ul><li>`) into consistent bullet lists with `custom-bullets` class.
- **Tabs:** Overview, Itinerary, Accommodation, More Info — vanilla JS tab switching

## Enquiry Form & Webhook

- **Enquiry modal:** In `[slug].astro` — triggered from pricing calendar "Request Booking" or standalone "Enquire" button
- **Form fields:** first_name, last_name, email, phone (all required)
- **API endpoint:** `POST /api/contact` (`src/pages/api/contact.ts`) — relays to Privyr webhook (`PRIVYR_WEBHOOK_URL` env)
- **Payload (Package Enquiry):** Form Type, Package Name, Package ID, Departure Date, Departure Airport, Number of Adults, Price Per Person, Total Price, Source (UTM → sessionStorage), Landing Page, Page URL
- **Payload (Contact Form):** Form Type, Booking Reference, Reason, Message, Source, Landing Page, Page URL
- **Calendar → Enquiry bridge:** `enquiryExtra` object populated by `openEnquiryModal()` when coming from pricing calendar — carries date, airport, adults, price pp, total price
- **Contact page:** `src/pages/contact.astro` — standalone form (no calendar), different fields (booking_ref, reason, message)

## Experiential Blog Posts (long-form storytelling)

A SEPARATE artifact from the standard blog (`src/data/blogs.ts` + `blog-export.json`).

- **Route:** `src/pages/blog/experiences/[slug].astro` → URL `/blog/experiences/<slug>` (never collides with the 151 standard posts at `/blog/<slug>`)
- **Layout:** `src/layouts/ExperientialPost.astro` — full-bleed: hero → bookable strip → intro → at-a-glance → journey chapters → gallery → teal CTA → related. Composes site Header/Footer (does NOT fork the product template).
- **Data:** `src/data/experiences.ts` — structured `Experience` objects (hero / intro / chapters / gallery / cta / seo). Drafts (`draft: true`) render in DEV only, excluded from prod build + sitemap.
- **Media:** every image/video is a `MediaSlot` (`kind: 'placeholder' | 'image' | 'video'`) rendered by `src/components/experiential/Figure.astro`. Slots keep an `ar` (aspect ratio) so swapping media never shifts layout. Files live under `public/blog-media/<slug>/{images,videos}/`.

### Hero video — self-hosted MP4 and/or adaptive HLS (Cloudflare Stream)

The hero `MediaSlot` supports `kind: 'video', ambient: true` with any of: `mp4`/`webm` (self-hosted), `hls` (a `.m3u8` manifest), and `src` (poster). Behaviour:

- **`hls` set** → `Figure.astro` adds `data-hls`; the inline player in `ExperientialPost.astro` streams it: Safari plays HLS natively, other browsers **lazy-load hls.js from jsDelivr only when an HLS hero is present**. The mp4/webm `<source>` stays as automatic fallback.
- **No `hls`, only `mp4`/`webm`** → plays the self-hosted file directly, no JS.
- **No playable source at all** → Figure renders the poster `src` as a plain `<img>`, so a half-configured hero never breaks the live page.
- **prefers-reduced-motion** → autoplay removed, poster shown (handled in the layout's inline script).

**Rule of thumb:** short clips (≲10 MB) → self-host MP4 (free, simple). Long/heavy hero loops → Cloudflare Stream (adaptive HLS + CDN). Same Cloudflare account; ~$5/1000 min stored + $1/1000 min delivered.

**Prep a self-hosted clip** (strip audio for muted hero, add fast-start, pull a matching poster frame):
```bash
ffmpeg -y -i in.mp4 -c:v copy -an -movflags +faststart public/blog-media/<slug>/videos/hero.mp4
ffmpeg -y -ss 0.3 -i in.mp4 -frames:v 1 -q:v 3 public/blog-media/<slug>/images/hero-video-poster.jpg
```

**Put a hero on Cloudflare Stream:**
1. Dashboard → Media → Stream → Videos → **Upload video**; wait for "Ready".
2. Open the video → **Video details** → copy the **HLS Manifest URL** (`https://customer-<CODE>.cloudflarestream.com/<UID>/manifest/video.m3u8`). (Every video is also reachable at `https://videodelivery.net/<UID>/manifest/video.m3u8`.)
3. In `experiences.ts`, set the post's hero `hls` to that URL (keep the mp4 as fallback if present).
4. `npm run build` then `./deploy.sh`.

**Live example:** Zambezi post hero — `customer-wj01kterp4hvns4u.cloudflarestream.com` (Stream HLS) + `videos/hero.mp4` fallback.

## Reference

- Original CSHTML templates: `backup/070722/Views/`
- Original CSS: `assets/css/`
- Page build log: `PAGES.md`

## Do Not

- Do not add React, Vue, or other UI framework components
- Do not change `output` from `"hybrid"` — holiday pages are SSR, blog/static pages are SSG
- Do not modify font files or font-face declarations
- Do not delete the `backup/` or `assets/` directories — they are the original reference
- Do not create a `[collection].astro` separate from `[country]/index.astro` — they share the same URL pattern and are merged into one handler
- Do not round the base price before adding local charges — always `roundToNine(base + localCharges)`, never `roundToNine(base) + localCharges`. The rounding must happen AFTER city tax and port fees are added, so the final customer-facing price ends in 9
