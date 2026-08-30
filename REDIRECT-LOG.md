# Redirect log (Site Doctor, lane A1)

Every rule the Site Doctor appends to `public/_redirects` is recorded here BEFORE the
edit is made. Strategy: `TODO-redirects.md`. Targets must curl 200 at the time of writing.

Note on evidence: the site's error beacon only records `broken_image` and `js_error`
(there is no `http_404` type), so legacy 404s surface indirectly — a crawler lands on the
404 page and beacons that page's own layout images (`/images/clia-logo.png` etc.).
The `src` column is the 404 page URL from that beacon; the asset in the beacon is a red
herring (always 200).

| Date | Source (404, verified) | Target (verified 200) | Evidence |
|---|---|---|---|
| 2026-08-30 | `/Holidays/Europe/Slovakia/14` | `/Holidays/slovakia` | site_errors id 661 (2026-08-30 07:49, meta-webindexer). Legacy numeric listing (`/Region/Country/ID`, TODO-redirects.md row "Numeric country listings → country page"). Source curls 404 (title "Page Not Found"), also with trailing slash and with `/Holidays/Slovakia/` (capital) — case matters, so per-URL rules rather than a `:country` placeholder. Target curls 200 with and without trailing slash. |
| 2026-08-30 | `/Holidays/Europe/Cyprus/33` | `/Holidays/cyprus` | site_errors id 585 (2026-08-14, meta-webindexer). Same class. Source 404, target 200. |
| 2026-08-30 | `/Holidays/Europe/Latvia/13` | `/Holidays/latvia` | site_errors id 640 (2026-08-23, meta-webindexer). Same class. Source 404, target 200. |
| 2026-08-30 | `/Holidays/Asia/India/24` | `/Holidays/india` | site_errors id 603 (2026-08-17, meta-webindexer). Same class. Source 404, target 200. |

Skipped 2026-08-30: `/Holidays/Europe/Iceland/73` (id 638) — `/Holidays/iceland` itself
returns 404 (no listed Iceland holidays), so there is no confident 200 target. Revisit if
Iceland gets a live country page.

Not done: a blanket `/Holidays/:region/:country/:id` rule. The country-index route is
case-sensitive (`/Holidays/Slovakia/` → 404, `/Holidays/slovakia/` → 200) and Cloudflare
placeholders preserve case, so a wildcard would 301 into a 404. The remaining ~48 numeric
legacy URLs in TODO-redirects.md would need an explicit lowercase map — owner call.
