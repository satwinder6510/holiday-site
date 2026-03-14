# Flights and Packages - Holiday Site

## Project

Astro 5 hybrid site (SSG + SSR) for a holiday booking website. Holiday pages are SSR (live data from Neon Postgres via Hyperdrive). Blog, destination, and static pages remain SSG. Tailwind CSS v3 for utility classes, scoped `<style>` blocks for complex page-specific CSS. No React — pure Astro components with vanilla JS in `<script>` tags.

## Tech Stack

- **Framework:** Astro 5.18 (`output: "hybrid"`, `site: 'https://holidays.flightsandpackages.com'`)
- **Database:** Neon Postgres via Cloudflare Hyperdrive (ID: `c69bec26333a4d76865bf2fe22445eca`)
- **ORM:** Drizzle ORM with node-postgres driver
- **Styling:** Tailwind CSS 3 + scoped CSS in `<style>` blocks
- **Carousel:** Embla Carousel 8 (with fade plugin)
- **SEO:** `@astrojs/sitemap` integration (auto-generates sitemap-index.xml)
- **Build:** `npm run build` outputs to `dist/`
- **Dev:** `npm run dev` on port 4321
- **Deploy:** `CLOUDFLARE_ACCOUNT_ID=30ceb1f7e533bfb798699af40a2bcaca npx wrangler pages deploy dist/ --project-name=holiday-site`

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
    collections-static.ts  # Static collection definitions (no data imports)
    holiday-export.json    # 139 holidays from live site (SSG fallback)
    cruise-export.json     # 160 river cruise offers (used by SSR pages directly)
    blog-export.json       # 140 blog posts from live site
    pricing-export.json    # Date-wise pricing data (SSG fallback)
  lib/           # Shared libraries for SSR + SSG
    holiday-transforms.ts  # Pure transform functions: transformHoliday, transformCruise, slugify, etc.
    pricing-transforms.ts  # Pure pricing transforms: transformHolidayPricing, formatPrice, etc.
    db.ts                  # pg Pool factory from Hyperdrive connection string
    db-schema.ts           # Drizzle schema for flight_packages + package_pricing
    get-db.ts              # getDb(Astro) helper — extracts DB from Astro.locals.runtime.env.HYPERDRIVE
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

## Key Patterns

- **Layout:** All pages use `BaseLayout.astro` which includes Header, Footer, MobileNav, MobileCallCTA
- **Hero:** Use `PageHero.astro` for standard heroes. Holiday detail and country pages have custom inline heroes.
- **SSR pages (live data):** Holiday detail `[slug].astro`, country/collection `[country]/index.astro`, search, river-cruises — use `export const prerender = false` and query Neon DB via `getDb(Astro)` + functions from `holidays-db.ts`. New offers/prices appear within ~60s (Hyperdrive caching).
- **SSG pages (build-time):** Blog, destinations, collections listing, about, contact, T&Cs — use `getStaticPaths()` and data from JSON exports in `src/data/`.
- **Country/Collection merged route:** `[country]/index.astro` handles both country pages (`/Holidays/italy/`) and collection pages (`/Holidays/Beach`). It checks `allCollections` first, falls back to country lookup.
- **Data layer:** Pure transform functions live in `src/lib/holiday-transforms.ts` and `src/lib/pricing-transforms.ts`, shared by both SSR (DB rows → RawHoliday → HolidayDetail) and SSG (JSON → same pipeline).
- **Pricing data layer:** SSR pages get pricing from `package_pricing` table. SSG pages use `pricing-export.json` as fallback. Both use `transformHolidayPricing()` from `pricing-transforms.ts`.
- **Holiday images:** All relative paths need `https://holidays.flightsandpackages.com` base URL prepended (handled by `resolveImageUrl()` in holiday-transforms.ts)
- **Blog images:** Already absolute URLs from `admin.citiesandbeaches.com`
- **Pricing calendar:** Holiday detail pages with pricing data show an inline airport/date picker section, a single-month calendar modal with prev/next navigation, and a mobile bottom bar. Pricing data is embedded via `<script type="application/json">` and driven by vanilla JS. Uses `:global()` CSS selectors for JS-rendered elements (Astro scoped CSS workaround).
- **Responsive:** Desktop-first with breakpoints at 1360, 1260, 1100, 940, 768, 610, 450px
- **Section container:** `.section-container` class = `max-width: 1240px; margin: 0 auto;` with responsive padding

## River Cruises

River cruise offers are **mixed in with regular holidays** — no separate `/cruises` section.

- **Data source:** `cruise-export.json` (160 offers) generated by `holiday-admin-api/scripts/export-cruises.ts`
- **Transform:** `holidays.ts` → `transformCruise()` converts each cruise into a `HolidayDetail` object
- **Tags:** All cruises automatically tagged `['River Cruise']` for filtering
- **Operators:** CroisiEurope (117 offers) + A-Rosa (43 offers)
- **URL pattern:** `/Holidays/[country]/[slug]` — same as regular holidays
- **Country distribution:** Most (99) under `/Holidays/europe/`, rest under france, portugal, spain, germany, italy, netherlands, hungary, austria, romania, switzerland, czech-republic
- **ID offset:** Cruise offer IDs start at 10001+ to avoid collisions with flight_packages IDs
- **To update cruise data:** Re-run the pipeline in holiday-admin-api (sync → batch-create-offers → export), then rebuild + deploy this site

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

## Conventions

- Scoped `<style>` for page-specific CSS (not Tailwind) when porting complex layouts from the original CSS files
- Vanilla `<script>` tags for interactivity (accordions, tabs, carousels, filter toggles) — no framework JS
- SVG icons stored in `public/icons/` and referenced via `<img src="/icons/name.svg">`
- Image paths use absolute URLs from the original site's CDN where available, local paths in `public/images/` otherwise
- **R2-served images:** `/objects/images/...` and `/api/media/...` paths are served from Cloudflare R2 bucket `holidays-images` via SSR API routes. ~10,148 images migrated from Replit (2026-03-14).

## Analytics & Tracking (in BaseLayout.astro `<head>`)
- **Facebook Pixel:** ID `2922972984621050` — PageView on every page
- **PostHog:** Project `phc_CncpMTolnthosh7c98z3b7iqSHbhB1vokNzW2WgrC2R`, EU host (`eu.i.posthog.com`)
- **Traffic source tracking:** vanilla JS, stores `lead_source` + `landing_page` in sessionStorage
- **HappyFox Live Chat:** 9am–6pm UTC only, embed token `0799b060-00fb-11f1-a7bb-77728896a359`
- **Cookie banner:** UK PECR/GDPR compliant, sets `cookie_consent=1` cookie for 1 year

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
