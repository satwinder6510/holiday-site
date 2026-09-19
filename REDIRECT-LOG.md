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

## 2026-09-16 — legacy PascalCase static pages (TODO-redirects.md row "Other pages")

| Date | Source (404, verified) | Target (verified 200) | Evidence |
|---|---|---|---|
| 2026-09-16 | `/AboutUs` | `/about/` | site_errors ids 768-775 (2026-09-15 22:22-22:24, two UAs: Win10 Chrome/148 + zh-cn Android MQQBrowser) beaconed the 404 page's trust logos from this URL; 14 hits on this URL since 2026-07-28 (ids 372-382 were the same scanner pair on the same page, folded into the icons-batch class before the page-url check existed). `/AboutUs` is named explicitly in TODO-redirects.md ("Other pages ~5: /AboutUs, ..."). Source curls 404 (63,223 B "Page Not Found") with and without trailing slash. Target `/about/` curls 200 (75,927 B); `/about` is a 308 to `/about/`, so the rule points at the slashed form to save a hop. |
| 2026-09-16 | `/PrivacyPolicy` | `/privacy-policy` | site_errors ids 776-780 (2026-09-15 22:26-22:27, same two UAs, 2 min after the /AboutUs hits — the scanner walked the old site's footer links). First appearance of this URL (5 hits). Source curls 404 with and without trailing slash. Target `/privacy-policy` curls 200 (75,747 B) both with and without trailing slash; `src/pages/privacy-policy.astro` exists. |

Not done 2026-09-16: `/ContactUs` also curls 404 but has never been beaconed and is not in
TODO-redirects.md (which lists `/contact`, already live) — no drive-by rules.

Deploy note 2026-09-16: NOT deployed by Site Doctor. The working tree was already dirty with
the owner's regenerated `blog-export.json` + `cruise-export.json` (deploy side-effect from the
owner's 2026-09-15 evening deploy), and the A1 lane only auto-deploys when the diff is limited to
`public/_redirects` + this file. The rules go live with the owner's next `./deploy.sh`; verify
then with `curl -sI https://holidays.flightsandpackages.com/AboutUs` (expect 301 → `/about/`).
Verified 2026-09-17: both live, 301 → 200 in one hop (owner deployed on 2026-09-16).

## 2026-09-17 — legacy numeric country listings, batch 2 (TODO-redirects.md row "Numeric country listings")

| Date | Source (404, verified) | Target (verified 200) | Evidence |
|---|---|---|---|
| 2026-09-17 | `/Holidays/Europe/Montenegro/34` | `/Holidays/montenegro` | site_errors ids 782-783 (2026-09-16 10:27, meta-webindexer) beaconed the 404 page's own layout images from this URL. Source curls 404 (63,223 B, title "Page Not Found") with and without trailing slash. Target curls 200 (84,874 B, title "Montenegro Holidays") with and without trailing slash; `/Holidays/Montenegro` (capital) is 404, hence a per-URL lowercase rule. |
| 2026-09-17 | `/Holidays/Europe/Germany/16` | `/Holidays/germany` | site_errors id 784 (2026-09-16 23:56, meta-webindexer). Same class. Source 404 (title "Page Not Found") with and without trailing slash. Target 200 (328,602 B, title "Germany Holidays") with and without trailing slash; `/Holidays/Germany` is 404. |
| 2026-09-17 | `/Holidays/Americas/Argentina/2` | `/Holidays/argentina` | site_errors id 785 (2026-09-17 00:11, meta-webindexer). Same class. Source 404 with and without trailing slash. Target 200 (79,644 B, title "Argentina Holidays") with and without trailing slash. |

Process note 2026-09-17: the `public/_redirects` edit landed a few seconds BEFORE this entry
(the first write attempt for this entry was refused by the permission layer while the rules
edit, issued in parallel, succeeded). Content was fully verified before either write.

Deploy note 2026-09-17: tree was clean before the edit, and main's latest code commit (`63faf85`,
VIVA inclusions) was already live (checked on a VIVA detail page), so a redirects-only
`./deploy.sh` publishes nothing new of the owner's apart from the usual D1 export re-sync.

## 2026-09-19 — legacy numeric country listings, batch 3 (TODO-redirects.md row "Numeric country listings")

| Date | Source (404, verified) | Target (verified 200) | Evidence |
|---|---|---|---|
| 2026-09-19 | `/Holidays/Asia/Japan/61` | `/Holidays/japan` | site_errors ids 806-809 (2026-09-18 23:26, Win10 Chrome/148 — the same scanner pair that walked /about/ + /privacy-policy minutes earlier) beaconed the 404 page's own layout images from this URL. Source curls 404 (63,223 B, title "Page Not Found") with and without trailing slash. Target curls 200 (82,493 B, title "Japan Holidays") with and without trailing slash; `/Holidays/Japan` (capital) is 404, hence a per-URL lowercase rule. |
