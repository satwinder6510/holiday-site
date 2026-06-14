# Experiential Blog — Changelog

One line per generated or published post. Newest first.

| Date | Action | Slug | Source URL | Files touched |
|---|---|---|---|---|
| 2026-06-13 | Surfaced in blog listing + DEPLOYED | `southern-africa-zambezi-safari-cruise` | live | `src/pages/blog/index.astro` merges `publishedExperiences` into the card grid (first card, links to /blog/experiences/<slug>) |
| 2026-06-13 | PUBLISHED + DEPLOYED | `southern-africa-zambezi-safari-cruise` | live | `src/data/experiences.ts` (draft:false), built + `./deploy.sh` → https://holidays.flightsandpackages.com/blog/experiences/southern-africa-zambezi-safari-cruise/ |
| 2026-06-13 | Media: hero photo + Day 8 video | `southern-africa-zambezi-safari-cruise` | author photos/video | `src/data/experiences.ts`, `public/blog-media/.../images/`, `public/blog-media/.../videos/` |
| 2026-06-13 | Day-aligned chapter markers | `southern-africa-zambezi-safari-cruise` | author day map | `src/data/experiences.ts`, `src/layouts/ExperientialPost.astro`, `public/blog-media/.../README.md` |
| 2026-06-13 | REWRITE from first-hand trip notes | `southern-africa-zambezi-safari-cruise` | author trip notes | `src/data/experiences.ts` |
| 2026-06-13 | FACT-CHECK fixes | `southern-africa-zambezi-safari-cruise` | (same) | `src/data/experiences.ts` |
| 2026-06-13 | DRAFT generated | `southern-africa-zambezi-safari-cruise` | https://www.croisieurope.co.uk/cruise/southern-africa-travel-ends-earth-port-to-port-cruise-classic | `src/data/experiences.ts`, `src/layouts/ExperientialPost.astro`, `src/components/experiential/Figure.astro`, `src/pages/blog/experiences/[slug].astro`, `public/blog-media/southern-africa-zambezi-safari-cruise/` |

## Notes
- 2026-06-13 — Generator infrastructure built (Phase 1 + first draft). Prose rewritten
  originally from CroisiEurope facts; all media are placeholders. Open markers:
  `TODO:BOOKING_URL` (no matching bookable product in `cruise-export.json`) and
  `TODO:PRICE` (no public price on source page).
- 2026-06-13 — Fact-check pass against the source page. Removed an unsourced (and
  likely wrong) passenger count ("barely a hundred guests" → "an intimate
  five-anchor ship"); added South Africa to the hero country list (was 3, trip
  visits 4); dropped "private" from the water-safari inclusion; removed the
  unsourced "Kololo people" attribution for Mosi-oa-Tunya; folded the omitted Day 1
  (Johannesburg / Apartheid Museum) into Chapter 1 so all 9 days are covered.
- 2026-06-13 — Rewrote all 7 chapters from the author's first-hand trip notes.
  Key corrections vs. the synthesised draft: Chobe game drives produce no guaranteed
  big game (notes recorded "no elephants or leopards today"), so removed the
  "belongs entirely to them" elephant promise and reframed it as variable sightings;
  moved the elephant/lion/zebra/giraffe spectacle to the real 45-minute land transfer
  to the Lake Kariba ship (Ch4), and the matching gallery slot from "Chobe waterline"
  to "Lake Kariba shore". Added authentic detail: the four-country amphibious border
  crossing into Namibia by boat, Soweto (Mandela & Tutu houses), Rosebank hotel,
  BBQ lunch + line fishing on Impalila, the Vic-Falls-immigration flight routing,
  the Kariba Dam stop, and Victoria Falls Safari Lodge (waterhole + 1pm vulture
  feeding). Voice kept editorial 2nd-person; not first-person.
  NOTE: practical info still UNUSED — tips guidance ($20–30pp/day, USD preferred),
  Namibia+Zimbabwe e-visas, and the mobility caveat (high safari vehicles, 3–4 steps)
  could become a "Know before you go" box if wanted (needs a small layout addition).
- 2026-06-13 — The 1–7 chapter numerals read like mismatched "days" (9-day trip).
  Replaced the `Chapter.number` (int) with a `day` string label and consolidated to
  6 day-aligned chapters per the author's day map: Day 1 Johannesburg · Day 2 to the
  Impalila lodge (four-country boat crossing) · Day 3 Chobe · Day 4 Impalila ·
  Days 5–7 Lake Kariba (transfer + Matusadona) · Day 8 Victoria Falls. Layout renders
  `ch.day` (numeral restyled 56px→30px, nowrap). Media filenames renamed to match
  (chapter-1-johannesburg … chapter-6-vic-falls); per-post README table updated.
- 2026-06-13 — First real media. Hero swapped from ambient-video placeholder to a
  still image (author photo of the African Dream on Lake Kariba at golden hour),
  `hero-poster.jpg`, kept at ar 21/9. Day 8 chapter switched from image placeholder
  to an inline click-to-play video (`videos/chapter-6-vic-falls.mp4`): author's own
  Victoria Falls footage, trimmed to 30s and compressed with ffmpeg (720p H.264,
  ~5 MB, faststart), poster auto-extracted to `images/chapter-6-vic-falls.jpg`, ar
  3/2→16/9 to match. Provenance confirmed by author ("yes it's mine") → publishable.
  UPDATE: author supplied a Vic Falls rainbow panorama (982×360, 2.73:1). Too wide for
  a 16/9 video poster, so it became the Day 8 chapter image (ar 982/360).
  CORRECTION: the "This Is Victoria Falls.mp4" clip was NOT the author's (a download) —
  removed entirely from disk and the post (no video anywhere now). Replaced with the
  author's own Victoria Falls photo in gallery tile 4 (`gallery-4.jpg`, 1024×576).
  All media on the post is now author-owned.
- 2026-06-13 — Author's REAL Victoria Falls video added (exported from iCloud Photos;
  1024×576, 16s, 2.7 MB, H.264/AAC). Remuxed with +faststart, poster extracted to
  `vic-falls-video-poster.jpg`. Final falls arrangement: Day 8 chapter = the video
  (inline click-to-play); gallery-1 (wide tile) = the rainbow panorama (ar 982/360);
  gallery-4 = the full-flow falls photo. Note: post is now falls-heavy (3 assets) —
  consider swapping gallery-4 for a Chobe/lodge shot once more photos arrive.
- 2026-06-13 — Finalised pre-publish copy/CTA. Ship kept generic ("five-anchor ship");
  hero alt generalised off "African Dream" (two ships rotate). Price → "Enquire for
  2026 & 2027 pricing". No booking URL (bookingUrl=''), so the page is enquiry-led:
  bookable strip + primary CTA are now tap-to-call (tel:) "Enquire — call 0208 183 0518",
  "Browse river cruises" demoted to secondary. All TODO markers cleared. Page is a
  taster (sense of the trip, not a full spec) that funnels to phone enquiry.
- 2026-06-13 — Visitor-review polish: (1) replaced all 5 video posters (Day 2/3/4/8 +
  gallery) with stronger mid-clip frames instead of the dull ~1s grab — Day 2 now the
  crocodile, Day 3 people on the boat, Day 8 the falls, etc.; (2) silenced all videos
  (audio track stripped, lossless remux); (3) expanded gallery 8→9 tiles (added lodge
  breakfast deck, IMG_6934) so the masonry balances to ~3/3/3 and the trailing gap
  closes. Posters keep same filenames (hard-refresh to bust cache).
- 2026-06-13 — ALL MEDIA IN (no placeholders left). Final media set, all author-owned:
  hero = African Dream/Lake Kariba; Day 1 = Apartheid Museum ticket (IMG_6713);
  Day 2 = Kasane boat video (IMG_6767); Day 3 = Chobe game-drive video (IMG_6909);
  Day 4 = Impalila river video (IMG_6967); Days 5–7 = Lake Kariba sunset (IMG_7019);
  Day 8 = Victoria Falls video. Gallery (5): lion, hippo, guides-at-sundowner (IMG_7001,
  rotated upright), crocodile, zebra. Gallery switched from the uniform portrait grid to
  a CSS-columns MASONRY so mixed portrait/landscape shots show at natural ratio (the wide
  croc/lion aren't cropped). Stock Unsplash Joburg image fully replaced. Photos resized to
  1600px long edge; iPhone .mov clips transcoded 720p H.264 + auto-rotated; one no-EXIF
  sideways JPG rotated 90°. PENDING for publish: TODO:BOOKING_URL, TODO:PRICE, confirm
  ship name in hero alt.
- 2026-06-13 — Day 2 set to author's Kasane boat-crossing video (Kasane.mov, 1920×1080,
  13.7s → downscaled 720p, 2.0 MB, faststart; poster chapter-2-kasane-poster.jpg).
  Kasane.mov had iPhone rotation metadata (stored 1920×1080, rotation −90); ffmpeg
  auto-rotated on transcode so the file is 406×720 portrait — slot ar corrected
  16/9 → 9/16. Chapter media CSS now gives BOTH images and videos natural-size display
  centred and capped at 74vh (portrait or landscape), so tall portrait clips don't
  dominate. Two videos on the post (Day 2 portrait + Day 8 landscape).
- 2026-06-13 — Portrait support (author's photos are mostly portrait). Chapter media
  now shows real photos at their natural ratio (centred, capped at 74vh) instead of
  cropping to a fixed landscape box; placeholders keep their ratio box. Chapter
  placeholders Day 2–4 set to 4/5 portrait (Days 5–7 left 16/9 for ship/lake). Gallery
  converted from the landscape span-grid to a uniform portrait grid (3 cols desktop /
  2 tablet / 1 mobile, tiles 4/5). Day 1 image swapped from an Unsplash stock shot to
  the author's own Apartheid Museum ticket photo (`IMG_6713`, resized to 1600px/516 KB,
  4:3). All on-page media now author-owned again.
- 2026-06-13 — Per author, removed both Vic Falls stills from the gallery (deleted
  gallery-1.jpg panorama + gallery-4.jpg full-flow photo; tiles reverted to
  placeholders). Falls now represented only by the Day 8 video. Gallery placeholders:
  ship · elephants · sundowner · big game on transfer · lodge.
