# Flights and Packages - Page Build Log

## Project Overview

Holiday booking website for **Flights and Packages** (formerly "Cities and Beaches"). Built as an Astro static site with Tailwind CSS. All pages are wired to real data from JSON exports (holidays + blogs).

---

## Static Pages (Complete)

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/index.astro` | Homepage with hero carousel, search form, featured tour, offers carousel, destinations carousel, collections carousel, welcome section |
| `/about` | `src/pages/about.astro` | About page |
| `/contact` | `src/pages/contact.astro` | Contact page |
| `/collections` | `src/pages/collections.astro` | Collections listing with card grid + carousel |
| `/cookies-policy` | `src/pages/cookies-policy.astro` | Cookies policy |
| `/privacy-policy` | `src/pages/privacy-policy.astro` | Privacy policy |
| `/terms-and-conditions` | `src/pages/terms-and-conditions.astro` | Terms and conditions |

## Destination Pages (Complete)

| Route | File | Description |
|-------|------|-------------|
| `/destinations/[slug]` | `src/pages/destinations/[slug].astro` | Region pages (Europe, Americas, Africa, Asia, Middle East, Indian Ocean). Shows country cards filtered by region. |

**6 pages generated** from `src/data/destinations.ts`.

## Holiday Pages (Complete — Real Data)

| Route | File | Description |
|-------|------|-------------|
| `/holidays/search` | `src/pages/holidays/search.astro` | Search results with sidebar filters (board basis, price range, airport), sort bar, holiday cards, "Load More Results" button. Dynamic board basis checkboxes from real data. |
| `/holidays/[country]` | `src/pages/holidays/[country]/index.astro` | Country page with hero banner, search form overlay, intro section, holiday listings filtered by country. |
| `/holidays/[country]/[slug]` | `src/pages/holidays/[country]/[slug].astro` | Holiday detail with tabbed content (Overview, Itinerary, Accommodation, Gallery, Other Info — conditional), gallery lightbox, sidebar with pricing and CTA, "Can't decide?" CTA section, blog posts section, newsletter subscription. |

**Pages generated:**
- 28 country pages (from `holidayCountries` in `holidays.ts`)
- 139 holiday detail pages (from `allPublishedHolidays` in `holidays.ts`, includes 4 unlisted)

### Holiday Detail Page Features
- **Conditional tabs:** Overview (always), Itinerary (53 holidays), Accommodation (all), Gallery (all), Other Info (67 holidays)
- **What's Included:** Rendered in Overview tab before Highlights (not a separate tab)
- **Gallery lightbox:** Custom overlay with prev/next arrows, keyboard navigation (Escape/Arrow keys), counter
- **Below-tab sections:** Call Expert CTA (background image), Blog Posts grid (4 cards, black bg), Newsletter subscription (ocean background with gradient blend)

## Blog Pages (Complete — Real Data)

| Route | File | Description |
|-------|------|-------------|
| `/blog` | `src/pages/blog/index.astro` | Blog listing with card grid, sidebar with dynamically populated Popular Tags. |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` | Blog post detail with HTML content via `set:html`, prev/next pagination, sidebar with author info, tag pills, related posts. |

**140 blog post pages generated** from `allBlogs` in `blogs.ts`.

---

## Total: 322 pages

---

## Data Files

| File | Contents |
|------|----------|
| `src/data/holiday-export.json` | 139 holidays exported from live site. Fields: id, title, slug, category, price, description, excerpt, whats_included[], highlights[], itinerary[], accommodations[], gallery[], duration, board_basis_override, hotel_override, tags[], is_special_offer, is_unlisted, display_order, etc. |
| `src/data/holidays.ts` | Transformation layer. Normalises duration, board basis, hotel class, country names. Resolves relative image URLs. Exports: `listedHolidays` (135), `allPublishedHolidays` (139), `holidayCountries` (~28), `getHolidaysByCountry()`, `getHolidayBySlug()`, `priceRange`, `boardBasisOptions`. |
| `src/data/blog-export.json` | 140 blog posts exported from live site. Fields: id, title, slug, content (HTML), excerpt, metaTitle, metaDescription, featuredImage, author (messy — contains name + date + tags), isPublished, publishedAt. |
| `src/data/blogs.ts` | Transformation layer. Parses author field to extract name, date, and tags. Exports: `allBlogs` (140), `blogTags`, `getBlogBySlug()`. |

---

## Components

| Component | Used By |
|-----------|---------|
| `BaseLayout.astro` | All pages (via `<html>` wrapper) |
| `Header.astro` | All pages |
| `Footer.astro` | All pages |
| `MobileNav.astro` | All pages |
| `MobileCallCTA.astro` | All pages |
| `PageHero.astro` | Static pages, destinations, blog listing |
| `SearchForm.astro` | Homepage |
| `HeroCarousel.astro` | Homepage |
| `FeaturedTour.astro` | Homepage |
| `OfferCarousel.astro` / `OfferCard.astro` | Homepage |
| `DestinationsCarousel.astro` / `DestinationCard.astro` | Homepage |
| `CollectionsCarousel.astro` / `CollectionCard.astro` | Homepage, Collections |
| `CountriesSection.astro` / `CountryCard.astro` | Destinations |
| `WelcomeSection.astro` | Homepage |

---

## Assets

### Hero Images (`public/images/heroes/`)
- `search.jpg` - Search results hero
- `country.jpg` - Country page hero
- `blog.jpg` - Blog listing hero
- `blog-post.jpg` - Blog post hero
- Plus existing heroes for homepage, about, contact, collections, etc.

### Background Images (`public/images/`)
- `call-expert-background.jpg` - "Can't decide on a destination?" CTA section
- `mink-mingle-unsplash.jpeg` - Newsletter section ocean background (with CSS gradient blend from black)

### Icons (`public/icons/`)
Template page icons added:
- `filter-icon.svg` - Mobile filter toggle
- `camera-icon.svg` - Gallery count overlay
- `calendar-icon-black.svg` - Blog date icon
- `sort-by-icon.svg` - Sort dropdown
- `tick.svg` - Checkbox tick
- `plus-icon.svg` / `minus-icon.svg` - Accordion expand/collapse
- `bulletpoint.svg` - Custom bullet points
- `expand-icon.svg` - Gallery expand
- `compass-black.svg` - Destination meta icon
- `nights-black.svg` - Duration meta icon
- `board-basis-black.svg` - Board basis meta icon
- `pagination-left.svg` - Blog prev/next arrows

---

## Responsive Breakpoints

Desktop-first approach with these breakpoints:
- `1360px` - Large desktop adjustments
- `1260px` - Standard desktop
- `1100px` - Small desktop
- `940px` - Tablet landscape (blog sidebar goes inline)
- `768px` - Tablet portrait (sidebars hide, mobile nav, stacked layouts)
- `760px` - Blog cards stack
- `610px` - Small tablet
- `530px` - Large phone
- `450px` - Phone
- `394px` / `350px` - Small phone

---

## Reference Files

Original templates and CSS used as reference are in:
- `backup/070722/Views/` - CSHTML templates
- `assets/css/` - Original CSS files (search.css, itinerary.css, country.css, blogs.css, blogpost.css)
- `Downloads/Itinerary/` - Original itinerary page HTML + CSS (used for call-expert, blog posts, newsletter sections)
