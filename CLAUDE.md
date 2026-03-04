# Flights and Packages - Holiday Site

## Project

Astro 5 static site (SSG) for a holiday booking website. Tailwind CSS v3 for utility classes, scoped `<style>` blocks for complex page-specific CSS. No React — pure Astro components with vanilla JS in `<script>` tags.

## Tech Stack

- **Framework:** Astro 5.18 (`output: "static"`)
- **Styling:** Tailwind CSS 3 + scoped CSS in `<style>` blocks
- **Carousel:** Embla Carousel 8 (with fade plugin)
- **Build:** `npm run build` outputs to `dist/`
- **Dev:** `npm run dev` on port 4321

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
  components/    # Astro components (Header, Footer, PageHero, carousels, cards)
  data/          # TypeScript data files (mock data, navigation, footer links, countries, etc.)
  layouts/       # BaseLayout.astro (html wrapper, head, font imports)
  pages/         # Astro pages — file-based routing
    holidays/    # Search, country, and holiday detail templates
    blog/        # Blog listing and post templates
    destinations/# Region pages
public/
  fonts/         # BentonSans + CaslonGraphiqueEF font files
  icons/         # SVG icons
  images/        # Heroes, collections, countries, destinations
```

## Key Patterns

- **Layout:** All pages use `BaseLayout.astro` which includes Header, Footer, MobileNav, MobileCallCTA
- **Hero:** Use `PageHero.astro` for standard heroes. Holiday detail and country pages have custom inline heroes.
- **Dynamic routes:** `getStaticPaths()` generates pages from data files (countries.ts, mockHolidays.ts, mockBlogs.ts)
- **Mock data:** Template pages use hardcoded data from `src/data/mock*.ts` files. These are designed to be replaced with DB/API calls later. Do not modify the mock data interfaces without updating the pages that consume them.
- **Responsive:** Desktop-first with breakpoints at 1360, 1260, 1100, 940, 768, 610, 450px
- **Section container:** `.section-container` class = `max-width: 1240px; margin: 0 auto;` with responsive padding

## Conventions

- Scoped `<style>` for page-specific CSS (not Tailwind) when porting complex layouts from the original CSS files
- Vanilla `<script>` tags for interactivity (accordions, tabs, carousels, filter toggles) — no framework JS
- SVG icons stored in `public/icons/` and referenced via `<img src="/icons/name.svg">`
- Image paths use absolute URLs from the original site's CDN where available, local paths in `public/images/` otherwise

## Reference

- Original CSHTML templates: `backup/070722/Views/`
- Original CSS: `assets/css/`
- Page build log: `PAGES.md`

## Do Not

- Do not add React, Vue, or other UI framework components
- Do not change `output` from `"static"` — the site is fully static
- Do not modify font files or font-face declarations
- Do not delete the `backup/` or `assets/` directories — they are the original reference
