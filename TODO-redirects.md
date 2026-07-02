# Holiday Site — Legacy URL Redirects

## Problem
402 URLs from the old Replit site now 404 on the Cloudflare Pages site.
Discovered via Wayback Machine crawl (2026-04-25).

## URL Categories

| Type | Count | Example | Notes |
|------|-------|---------|-------|
| Category/filter pages | 25 | `/Holidays/Beach`, `/Holidays/Adults-Only` | Browse-by-tag pages, don't exist on new site |
| Numeric country listings | 52 | `/Holidays/Europe/Italy/11` | Old format: `/Region/Country/ID` |
| PascalCase holiday pages | ~200 | `/Holidays/Greece/7-Nights-5-Star-All-Inclusive-Crete-Holiday` | Old slugs, PascalCase countries |
| Blog pages | ~130 | `/blog/Florence-holidays` | All returning 308, old format `/blog/Title-Case-Slug` |
| Other pages | ~5 | `/AboutUs`, `/Golden-triangle-holidays`, `/contact` | Misc legacy pages |

## Plan
1. Build redirect map matching old holiday URLs to current `/Holidays/[country]/[slug]` equivalents
2. Match old blog URLs to current blog slugs
3. Map old category pages to search or country pages
4. Add rules to Cloudflare Pages `_redirects` file (or `[...path].astro` catch-all)

## Data Source
Full URL list from Wayback Machine CDX API:
```
curl -s "https://web.archive.org/cdx/search/cdx?url=holidays.flightsandpackages.com/*&output=json&fl=original,statuscode,timestamp&collapse=urlkey&limit=2000"
```

## Priority
- Holiday pages (~200) — highest SEO impact, many likely still indexed
- Blog pages (~130) — FAQ/guide content with backlinks
- Category pages (25) — redirect to search or country listing
- Numeric ID pages (52) — redirect to country listing
