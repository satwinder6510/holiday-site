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
    holidays.ts  # SSG package data (no cruises — those are live from D1)
    blogs.ts     # Transforms blog-export.json → typed Blog arrays
    pricing.ts   # Re-exports from lib/pricing-transforms, used by SSG pages
    countries.ts # Country card data for homepage carousel (49 countries, local images)
    navigation.ts # Nav menu items + buildDestinationRegions() for dynamic nav
    collections-static.ts  # Static collection definitions (no data imports)
    holiday-export.json    # 139 holidays from live site (SSG fallback)
    blog-export.json       # 140 blog posts from live site
    pricing-export.json    # Date-wise pricing data (SSG fallback)
  lib/           # Shared libraries for SSR + SSG
    holiday-transforms.ts  # Pure transform functions: transformHoliday, transformCruise, slugify, etc.
    pricing-transforms.ts  # Pure pricing transforms: transformHolidayPricing, formatPrice, etc.
    db.ts                  # D1 database client factory
    db-schema.ts           # Drizzle D1 schema for flight_packages + package_pricing
    get-db.ts              # getDb(Astro) helper — extracts DB from Astro.locals.runtime.env.DB
    holidays-db.ts         # SSR query functions: getHolidayBySlugFromDb, getAllListedHolidaysFromDb, etc.
    cruise-catalogue.ts    # The river-cruise catalogue, read from D1 per request (60s memo)
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
- **Per-hotel stars (2026-07-07):** accommodation cards show each hotel's OWN rating, resolved LIVE from `hotel_library` at SSR render (`applyLibraryStars()` in `holidays-db.ts`, matched by `normaliseHotelName()` — keep names stable in the library!). A library edit reflects on every offer on next page load. The accommodations JSON `stars` (copied on admin library-pick; backfill: `holiday-admin-api/scripts/backfill-accommodation-stars.mjs`) is only the fallback for hotels missing from the library. `null` = no stars shown. NEVER paint the package-level `hotel_override` rating onto hotel cards — it put 4★ on known 3-star hotels (holiday 414). `extractStars(hotel_override)` remains for city-tax fallback only.

## River Cruises

River cruise offers are **mixed in with regular holidays** — no separate `/cruises` section.

- **Data source:** D1, read per request by `src/lib/cruise-catalogue.ts`. There is no export file and no export script — an offer built in the admin appears on the site within a minute, no deploy.
- **Three cache layers, measured on production via `/api/catalogue-health`:** isolate memo 0ms (warm) → per-colo Cache API 15–83ms (cold isolate) → D1 243ms + 95ms to write the cache (once per colo per minute). The memo alone was not enough: Cloudflare spreads requests across many isolates, so cold ones were common. The catalogue is on the critical path of EVERY SSR page because the header's country nav needs it, which is why this is layered rather than simple.
- **Do not join `cruise_ships` into the offers query.** Ship rows carry the whole Widgety blob in `raw_data`; joined per offer that is 18.9 MB on the wire against 1.2 MB for the rest. The ships are fetched once separately and looked up by id.
- **Transform:** `holidays.ts` → `transformCruise()` converts each cruise into a `HolidayDetail` object
- **Tags:** All cruises automatically tagged `['River Cruise']` for filtering
- **Operators:** CroisiEurope + A-Rosa
- **URL pattern:** `/Holidays/[country]/[slug]` — same as regular holidays
- **Country distribution:** Most under `/Holidays/europe/`, rest under country-specific routes
- **ID offset:** Cruise offer IDs start at 10001+ to avoid collisions with flight_packages IDs
- **Deduplication:** Sailings deduplicated by date in the catalogue — cheapest cabin price wins when several cabin types share a departure date. Offers sharing a route slug are deduplicated too: most sailings wins, cheaper price breaks a tie.

### Pricing

Everything is live from D1. `cruise_flight_prices` (written by the weekly cron
queue) drives the calendar via `getCruisePricingFromDb()` in `holidays-db.ts`;
`cruise_offers.cheapest_total_pp` drives the cards. No deploy is involved in any
price change. The old static `cruisePricingMap` fallback is gone.
- **Pricing calendar:** Same UI as regular holidays — airport dropdown → date grid → per-person price

### Non-Price Data (persists, never overwritten by cron)
- **Itinerary:** JSONB in `cruise_routes.itinerary` — 230/284 routes populated from Widgety port_visits. Rendered in Itinerary tab
- **Description:** 245/284 routes have description text
- **Gallery:** 100/284 routes — the catalogue uses the first gallery image or the ship cover as the featured_image fallback
- **Ship details:** 100% complete — description, cover image, class, cabin images from Widgety raw_data
- **Duration:** `vacation_days - 1` (full trip including hotel stays), not just `cruise_nights`

### Update Procedures
- **Price-only refresh:** Automated weekly via cron — no action needed
- **Full re-sync (new routes/offers):** Run pipeline in holiday-admin-api: sync-widgety → batch-create-offers. No export, no deploy — the site reads D1.
- **New route itinerary:** Run `POST /api/cruises/sync-itineraries` on holiday-admin-api. Live within a minute.

### River Cruise DETAIL page (rebuilt 2026-09-20)

Cruises no longer render through the shared package template. `[country]/[slug].astro`
keeps the URL, the legacy-slug `redirects` map and the canonical-country 301, and
delegates the body to `src/components/cruise/CruiseDetail.astro` when
`useCruiseTemplate` is true — i.e. the holiday is tagged River Cruise AND has a cabin
ladder AND has pricing. Anything short of that falls back to the old template, so
manually-created cruise holidays (`flight_packages` rows, id < 10000) are unaffected.

- **Why:** the package template's date picker is a flight calendar (any day, any month,
  then an airport). A river cruise has a handful of fixed sailings and the decision is
  which sailing, then which cabin on which deck, at a price that moves with the airport.
- **Airport first.** The selling price is per date AND per airport
  (`cruise_flight_prices.total_price_pp`, or the admin's flat retail overlay). The
  cheapest airport is NOT the same one every week, so each row shows what the best
  airport would save. Every airport's price is server-rendered as `data-price-CODE`;
  the script only swaps text, so the numbers are in the HTML for crawlers and no-JS.
- **Cabin ladder per sailing**, grouped by deck, with grades not sold that week shown
  as sold out rather than dropped. `getSailingLadders()` in `src/lib/cruise-detail.ts`.
- **Port calls with real times** — arrival, departure and dwell duration, read LIVE from
  `cruise_routes.itinerary` via `getCruiseCalls()`. The catalogue flattens the itinerary
  to `{day, port, country, description}` and throws the times and the UN/LOCODE away;
  that is why the detail page reads `cruise_routes` directly rather than the catalogue.
- **Route map** (`RouteMap.astro`, rebuilt 2026-09-26) is real geography drawn
  server-side as SVG: land, lakes and river centrelines from Natural Earth (public
  domain) in `src/data/basemap.json` (442 KB raw / 160 KB gzipped; built by
  `scripts/build-basemap.py` from the three NE GeoJSON files, kept only within 4° of a
  port in `src/data/port-coords.json`, Douglas-Peucker simplified). At render the
  window is the route plus room (never under ~220 km across), features are clipped to
  it (Sutherland–Hodgman for rings, Liang–Barsky for lines) so a page carries ~8–15 KB
  of SVG. The river the ship sails = the named river passing within ~22 km of ≥2
  ports (count per NAME — NE cuts a river into segments); it is drawn heavy and each
  matched port is SNAPPED onto it (UN/LOCODE points are town centres — Rüdesheim's is
  14 km from the Rhine). No river found → the old dashed schematic spline. Two
  layouts, landscape 1080×520 and portrait 600×600 with bigger type, CSS picks one at
  600px — the map now shows on phones. Port coordinates come from `port-coords.json`
  (373/373 ports, UN/LOCODE + GeoNames, resolved offline, no API).
- **`parseCabinGrade()`** handles all three supplier formats: CroisiEurope's bracketed
  deck (`Cat B Suite (Main Deck, 2 Single Beds)`), A-ROSA's leading deck
  (`Main Deck 2 Adjustable Twin Beds`), VIVA's trailing gemstone (`Double Cabin aft
  Ruby`). It uses a CLOSED deck vocabulary on purpose — an open "last capitalised word"
  rule reads "Beds", "Window" and "Person" as decks and is wrong on 54 of the 74 cabin
  strings in the table. Unrecognised grades keep their full name under "Other".
- **Indexes (added 2026-09-20):** `cruise_offer_sailing_cabins(offer_id, sailing_id)`,
  `cruise_sailings(route_id, departure_date)`, `cruise_sailings(departure_date)`,
  `cruise_flight_prices(offer_id, departure_date)`. Before these, every cruise detail
  view full-scanned ~23k rows; the cabin query read 11,609 rows and now reads 88.
- **Ship vs hotel.** Many cruises sell as flight + hotel + cruise and `accommodations`
  holds the HOTEL first, the ship second — `accommodations[0]` is NOT the ship. The
  `cruise_ships` table decides (67 rows, matched case-insensitively: the feed writes
  "Ms Vivaldi", the table holds "MS Vivaldi"). Anything not in that table is treated
  as a hotel and gets its own section. Never label an accommodation a ship by position.
- **Month chips + show-more** appear above 12 sailings (the Zambezi runs 69). Every row
  is in the HTML; the script only toggles visibility.
- **⚠️ Never use the `margin` shorthand on an element that also carries
  `.section-container`.** The container centres with `margin-inline: auto`, and the
  shorthand zeroes it, so the band pins to the left window edge above 1240px while
  every other band stays centred. It bit `.cd-glance dl`, which used `margin: 0` only
  to kill the browser's default `dl` margin; `margin-block: 0` does that job without
  taking the inline axis. Astro's scoping gives the component rule higher specificity
  than `.section-container` and its stylesheet loads later, so it wins twice over.
  Fixed 2026-09-20 after the owner spotted the page was off-centre.
- **Admin-made cruise packages** (`flight_packages` rows tagged River Cruise, 30 of
  them) use this template too — they carry `package_pricing` by date and airport but no
  cabin grid, so cabin panels drop out and the route falls back to the holiday's own
  day-by-day itinerary. All sampled detail pages now use the cruise template.
- **Overview tidy.** Supplier overviews open with a promo block that repeats the
  sailings table; `tidyOverview()` strips the "For the following departures:" list
  always and drops a "Book by <date>" line once that date has passed. Descriptions are
  NOT refreshed by the weekly cron — only a full re-sync changes them.
- **Feed encoding:** the Widgety feed mangles curly apostrophes to "¿"
  ("Europe¿s Geniuses"); `fixFeedText()` repairs it between two letters.
- **Type scale on the cruise page (UX audit 2026-09-26, owner: "some font sizes
  don't look right"):** follow the HOLIDAY DETAIL TEMPLATE, not global.css — h1 Caslon
  48/50 (768: 38/40, 450: 36/36), h2 Caslon 40/42 (768: 32/34, 450: 26/28), h3 Caslon
  28/32, a ship/hotel name is `.acc-title` = BentonSans 500 / 30px (768: 26, 610: 20,
  450: 18), prose 14/26 (768: 12/24), prices Caslon on the 40/36/32/28 ladder (28 is the
  smallest), phone number BentonSans 900 / 30px / 3px, orange CTA 16px / 500 / 1px.
  Eyebrows: section 14/24/700/2.5px `#0d6066`, micro-label 12/20/700/2px. BentonSans
  has NO 600 face (500 and 700 only) — a 600 silently renders as bold. Link colour
  `#1b8f97` fails AA on white; use `#0d6066`. Breakpoints 940/768/610/450, never
  920/600. Sizes off the scale (11, 13, 15, 17, 23) were all removed.
- **Cabin descriptions (2026-09-26):** `src/lib/cabin-types.ts` reads the ship's
  Widgety record (`cruise_ships.raw_data.accomodation_types`, their spelling) — size,
  deck, French balcony / fixed window, the equipment list and the cabin type's own
  photos — and `matchCabinTypes()` pairs them with the grades the offer sells by word
  overlap (deck and the words accessible/single/suite must agree; ≥80% of the grade's
  words must appear in the type). A grade with no honest match keeps its name-only row.
  One ship row per detail page, ~50 KB; never join it into the catalogue query.
- **Written quote (2026-09-26):** the enquiry modal renders on both templates; the
  picker's rows/cabins and the bottom band open it via `window.__openEnquiryModal`
  with date/airport/ship/cabin/price. River cruise pages ALWAYS show the form
  (`data-form-always` on the modal) — the 9am–6pm call/chat panel is for the rest.
- **Landing test (2026-09-26):** `FEATURED_CRUISE_IDS` in `river-cruises/index.astro`
  puts a real Widgety cruise (VIVA "Hungary Short Trip", offer 447 → id 10447) in the
  first special-offer slot ahead of the admin-built offers.
- **Still open:** breadcrumb still points at the country page rather than the river
  (owner's call, 2026-09-20); no sibling-cruise internal links; no deck plans. "Time in
  port" was built then removed — CroisiEurope records arrival == departure on many
  calls, so it rarely said anything.

### Footer overflow, fixed 2026-09-20

Two faults in `src/components/Footer.astro` gave EVERY page a horizontal scrollbar.
Both are worth knowing because both look like content problems and are not.

- **A column flex list with `flex-wrap: wrap` wraps SIDEWAYS.** The footer columns are
  flex siblings stretched to the tallest, so `.footer-accordion-content` has a definite
  height; `wrap` therefore spilled the overflowing links into a second column drawn
  outside the box, 64px past the viewport at 768px wide, between 761px and 1240px. The
  visible symptom was a stray "Cookies Policy" link on the right edge, which reads as a
  long-link problem and is not. Only `.footer-links--two-col` ever wanted wrapping, so
  the default list is now `nowrap` and the wrap lives on the variant.
- **The three accreditation badges** are 48px tall with auto width in a no-wrap row, so
  their total is whatever the artwork happens to be. They ran 9px past a 320px viewport.
  `flex-wrap: wrap` is now the guard; below 360px the gap drops to 12px and the height
  to 44px so all three still sit on one line.

**How to check this rather than eyeball it.** Serve `dist/` and load a same-origin
harness page that iframes a built page, sets `iframe.width`, and compares each
element's `getBoundingClientRect().right` against `documentElement.clientWidth`. Run it
under `--headless=new --dump-dom` and write the result into the DOM, because headless
Chrome gives you no other way to read a value back. Resizing a real browser window is
NOT a substitute: the tab used here reported `innerWidth` 360 no matter what it was
resized to. Verified clean at 1864, 1440, 1240, 1100, 1024, 940, 820, 768, 761, 700,
600, 500, 430, 390, 360, 340 and 320.

### River Cruises Listing Page

- **Route:** `src/pages/Holidays/river-cruises/[...river].astro` — SSR catch-all route
- **URL pattern:** `/Holidays/river-cruises/` (all rivers) or `/Holidays/river-cruises/danube` (specific river)
- **Data source:** `getAllListedHolidaysFromDb` → cruises from the live catalogue (`getCruiseHolidays`, D1) **+** any `flight_packages` rows tagged `'River Cruise'` (manually-created cruise holidays, also D1). Both are filtered by `tags.includes('River Cruise')`.
- **Sidebar:** Accordion nav grouped by river name, with collapsible route listings
- **`slugifyRiver()`** in `holiday-transforms.ts` — converts river names to URL slugs
- **Filters:** Price range (min/max), duration, board type, cabin type, operator — all via JS-driven accordion sidebar. **Operator match is case-insensitive** (cards emit `operator_name` e.g. `A-ROSA`; checkbox value is `A-Rosa`).
- **Sort:** Price (low/high), duration (short/long), departure date — ARIA listbox with keyboard navigation (ArrowUp/Down/Home/End)

#### Card design (2026-06, promo-style — `public/promo/viva-cruises/index.html` reference)
Horizontal `.cruise-card` (kept `class="cruise-card holiday"` + `data-country/duration/operator/price` so the filter/sort/load-more JS is unchanged):
- **Image = a gallery:** the **main image fills the column (cover-crop, `flex:1 1 auto; min-height:210px`)** so every card is a uniform height regardless of body length/photo count; a **fixed 2-row thumbnail strip** (`grid-auto-rows:62px; flex:0 0 auto`) is pinned below it. (Earlier kept a 4:3 no-crop main with flex-filling thumbnails, but that ballooned thumbnails on the ~18 cards with 2–3 photos — switched to cover-crop for uniformity, 2026-06-29.) Images = `[holiday.image, ...cabinImages, ...galleryImages]` deduped. Thumbnail click swaps the main (delegated JS on `holidaysContainer`).
- **UX pass (2026-06-29, ux-designer agent):** badge reads "N nights" (was "5 Days / 04 Nights"); real `BentonSansBold` faces (was faux-bold); route line + small greys darkened to pass WCAG AA (`#0d6066` / `#6b6b6b`); price separated with a hairline + 30px figure; flight-note flattened from a boxed panel to a ✓ line; SSR results heading ("N river cruises"); sticky filter sidebar; CTAs stack at 610px.
- **Title** clamped to 2 lines; **route line** = full cleaned port sequence (`buildPortSequence()` strips Widgety junk like "Board your ship"/"River Day", dedupes, caps long ones), falls back to `routeFrom → routeTo`.
- **Cabin prices** = collapsible `<details>` ("Cabin options"), cheapest pp per cabin type from live D1 via **`getCabinPricingForOfferIds`** (`holidays-db.ts`), **scoped to the cheapest-entry SHIP** (a route can run on several ships with different decks). CroisiEurope: `bucketByDeck()` collapses "Cat X" (=position, irrelevant) → cheapest per **deck** (Main/Middle/Upper) + Suite. A-ROSA: keeps cabin-type names via `shortenCabinName()`. Headline "from" = cheapest cabin row.
- **Call to Book** (`tel:`) + **View More** CTAs; operator + duration badges on the image.
- New Drizzle tables in `db-schema.ts`: `cruiseSailings` (id, ship_id, departure_date), `cruiseOfferSailingCabins` (offer×sailing×cabin_type×net_cost_pp).

#### Multi-ship cruises (detail page + calendar)
A cruise = a route that can be sailed by **multiple ships** on different dates (~43% of offers), with different decks/cabins/prices. Everything anchors to the **cheapest-entry ship**:
- **The catalogue** (`src/lib/cruise-catalogue.ts`) emits `ships[]` (all ships with future sailings + details) and sets the primary `ship` = cheapest. Ties are common (six ships tie at £771 on offer 103), so the order is cheapest → earliest sailing → ship id. Do not remove that tie-break: without it the hero ship changes every time the cache refreshes.
- **Detail page** (`[country]/[slug].astro`): renders a card per ship ("Your Ship(s)" heading) + an **"Operated by X & Y on selected dates"** line (`operatedByLabel` from `transformCruise`, multi-ship only).
- **Pricing calendar shows the ship per date** — `getCruisePricingFromDb` joins `cruise_sailings.ship_id`, dedupes to cheapest per (date,airport), maps shipId→name via the export `ships[]`. `Departure`/`RawDeparture` carry `shipId`/`shipName`. Shown on date cards, calendar cells (`.cal-day__ship`), the selected-date summary, and the enquiry payload (`enquiryExtra.ship`).
- **Canonical-country redirect:** cruise country is derived from ports (itinerary), so it can change. `[country]/[slug].astro` looks up by slug (country-agnostic) and 301-redirects a mismatched/stale country to the canonical URL (keeps old `…/europe/…` links alive, avoids duplicate content). Applies to regular holidays too (normalises case).

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
- **Call/chat-first experiment (2026-09-02):** 9am–6pm UK (`callHoursNow()`, Europe/London via Intl) the modal shows a call button (0208 183 0518) + "Chat with us" (opens Tidio) INSTEAD of the form; out of hours the form shows as before. Chat click falls back to the form if Tidio isn't loaded. PostHog events `enquiry_modal_open` (variant), `enquiry_call_click`, `enquiry_chat_click`, all carrying `lead_source`. Agents log resulting calls/chats as manual leads with a secondary source (admin New Lead form) so attribution survives.
- **Form fields:** first_name, last_name, email, phone (all required)
- **API endpoint:** `POST /api/contact` (`src/pages/api/contact.ts`) — relays to Privyr webhook (`PRIVYR_WEBHOOK_URL` env)
- **Payload (Package Enquiry):** Form Type, Package Name, Package ID, Departure Date, Departure Airport, Number of Adults, Price Per Person, Total Price, Source (UTM → sessionStorage), Landing Page, Page URL
- **Payload (Contact Form):** Form Type, Booking Reference, Reason, Message, Source, Landing Page, Page URL
- **Calendar → Enquiry bridge:** `enquiryExtra` object populated by `openEnquiryModal()` when coming from pricing calendar — carries date, airport, adults, price pp, total price
- **Contact page:** `src/pages/contact.astro` — standalone form (no calendar), different fields (booking_ref, reason, message)

## Newsletter & Exit Popup (Spotler Mail+)

- **Inline newsletter** (`src/components/Newsletter.astro`, on most pages via the footer area): embeds the Spotler Mail+ **Dynamic** form (`#mpform1302`, uid `503101206`). Scripts (jQuery/jQuery UI/validate + Spotler loader) are **lazy-loaded on scroll** (IntersectionObserver) to protect page speed. **Gotcha:** Spotler's loader self-inits on the `window.load` event, which has already fired by the time we lazy-load it, so we trigger it manually: `window['initShowHide' + formId]()` (mount `mpform1302` → `initShowHideform1302`). The loader uses **JSONP** (`callback=?`) so it is NOT domain-restricted; a blank box = the lazy-load/`window.load` timing issue, not CORS. Brand-styled via `:global(.mpForm …)`.
- **Exit-intent popup** (`src/components/NewsletterPopup.astro`, mounted globally in `BaseLayout`): a SECOND Spotler form (`#mpform1303`, feid `uK9T7KIKqIUPpxKvyZdK`) — the inline form can't be reused on the same page (duplicate `#mpformXXXX` ids break it). Desktop exit-intent + mobile 25s/60%-scroll trigger; 30-day frequency cookie (`fp_newsletter_popup`); suppressed for subscribers (`fp_newsletter_subscribed`, set on the thank-you page). **Must stay hidden when closed via `.np-overlay[hidden]{display:none}`** — the `.np-overlay{display:flex}` rule otherwise overrides the `hidden` attribute and the invisible full-screen layer swallows all clicks site-wide.
- **Thank-you page:** `src/pages/newsletter-thank-you.astro` (`noindex`) — Spotler's post-submit redirect target.
- Spotler forms have a built-in **anti-spam "sum" field** (auto-filled by their JS) — submissions need it; if a form ever rejects with "incorrect sum total", check the form's spam setting in Spotler.

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


## Docs portal proxy (2026-07-28)
`src/pages/docs/[...path].ts` proxies `/docs/*` → the admin API worker's public
customer documents portal (`/portal/docs/*`) so customers see the brand domain,
never workers.dev. Forwards GET+POST, strips content-encoding/length. The
flightsandpackages.com zone is NOT in Cloudflare (external IT DNS) — this proxy
is why; a Workers custom domain cannot bind. Don't remove this route without
replacing the customer document links it serves.
