# Experiential Blog Generator — holiday-site

**Goal:** Give Claude Code a tour URL → it produces a new, editable **experiential
blog post** as a *draft*, with labelled slots for **images and videos**. You swap in
media and tweak copy, preview it locally, then publish with one explicit command.
The holiday product page template is never touched.

This file is the spec + documentation of record. See `STACK.md` for how the blog
actually works, and `CHANGELOG.md` for the log of generated/published posts.
Keep all three updated when the workflow changes.

> This README has been reconciled with the **real** holiday-site stack (Astro 5,
> JSON-defined posts, R2-served legacy images). The original generic spec assumed
> Next.js / filesystem media — those assumptions were corrected. See "Resolved
> decisions" below and `STACK.md` §"The four forks".

---

## 0. Stack facts (confirmed in Phase 1)

| Fact | Value |
|---|---|
| Repo root | `/Users/admin/holiday-site/` |
| Framework / SSG | Astro 5.18, `output: "hybrid"` (blog = SSG) |
| Standard post format | object in `src/data/blog-export.json` → `src/data/blogs.ts` → rendered by `src/pages/blog/[slug].astro` (HTML `content` blob in a sidebar shell) |
| Experiential post format | **structured** object in `src/data/experiences.ts` → `src/layouts/ExperientialPost.astro` → `src/pages/blog/experiences/[slug].astro` |
| Example existing post | `/blog/viva-one-ship-guide` (id 412) |
| Experiential media dir | `public/blog-media/<slug>/{images,videos}/` (static — **not** the R2 `/objects/images/blog/` path) |
| Dev / Build / Deploy | `npm run dev` (4321) / `npm run build` / `./deploy.sh` |
| Canonical template | `src/layouts/ExperientialPost.astro` (on-brand: BentonSans + CaslonGraphiqueEF, teal `#20A1AA`, orange `#ff7f00`, navy `#073140`) |

## Resolved decisions
1. Experiential posts have their **own layout + route** — they compose the site
   Header/Footer but do **not** fork `blog/[slug].astro` or the product template.
2. Media lives in **`public/blog-media/<slug>/`** (instant swap-and-preview; no R2
   upload, no video route required).
3. A **draft renders in DEV only** (`import.meta.env.DEV`), is `noindex`, and never
   reaches the production build, sitemap, or any feed.
4. **Brand fonts/colours match the site** — no per-post reskin.

---

## 1. Hard rules
1. **Read before you write.** Match what the site already does (see `STACK.md`).
2. **Never modify the holiday/product page template** or shared components. If a
   change would touch a shared component, stop and ask.
3. **Drafts are never live.** `draft: true` → DEV-only, `noindex`, out of feeds and
   sitemap. Publishing is a separate explicit command (§6).
4. **Original prose only.** Third-party source URLs (e.g. a cruise line): extract
   *facts and structure*, rewrite **all** copy in our own voice. Copy nothing verbatim.
5. **Every post links back to its bookable product page.** `cta.bookingUrl` is
   mandatory before publish; until known, use the `TODO:BOOKING_URL` marker (the
   layout degrades to an "Enquire" CTA so nothing breaks).
6. **Document every change.** Append a line to `CHANGELOG.md`.
7. **No auto-deploy.** Show the diff + preview; wait for explicit confirmation.

---

## 2. Phase 1 — Discover & document
Done — see `STACK.md`. Re-run only if the blog system changes.

---

## 3. Phase 2 — The generator (repeatable)
**Trigger:** a tour URL.

a. **Fetch** with `curl -sL <URL>` and parse the HTML.
b. **Extract facts:** title, destination(s), duration, board/price, protection flags,
   overview, highlights, day-by-day itinerary, ships/hotels, gallery image URLs, and
   the canonical booking URL (our product page if the source is ours; else ask which
   of our product pages it maps to, or leave `TODO:BOOKING_URL`).
c. **Synthesise** into the `Experience` model (rewrite all prose):
   `hero` (evocative title, eyebrow, meta) · `intro` (2 paras) · `glance` (3 cards:
   route / best-for / what's-handled) · `chapters[]` (group the itinerary into **5–7
   narrative chapters** by place/region — each = number, title, place, 1 sensory
   paragraph, one media slot) · `gallery` (5 slots) · `cta` (headline, price,
   bookingUrl, phone) · `seo`.
d. **Add the object to `src/data/experiences.ts`** with `draft: true`. Derive the
   slug (default `<destination>-<short-name>`).
e. **Media slots only — embed no final media.** Every slot starts as
   `kind: 'placeholder'` with a `label`, intended `src`/`mp4` path, real `alt`, and an
   `ar`. Hero + each chapter + each gallery tile = one slot (§4).
f. **Create media folders** `public/blog-media/<slug>/{images,videos}/` + a per-post
   README listing the expected files.
g. **Report:** files changed, local preview URL
   (`http://localhost:4321/blog/experiences/<slug>`), media-folder paths, any `TODO:`
   markers. Append to `CHANGELOG.md`.

---

## 4. Media system — images **and** videos
Slots are typed by `kind` in the `MediaSlot` interface. Keep `ar` on every slot so the
layout never shifts. `Figure.astro` renders all three kinds.

- **Placeholder** (default at generation): shows the label + path so you know what to drop in.
- **Image:** `kind:'image'`, `src` under `/blog-media/<slug>/images/`, real `alt`, `loading="lazy"`.
- **Inline video:** `kind:'video'`, `mp4` (always) + optional `webm`, `src` = poster JPG, `controls preload="none"`.
- **Hero ambient video:** `kind:'video'`, `ambient:true` — silent, looping, autoplay,
  with a poster; a reduced-motion guard pauses it and shows the poster instead.

**Rules:** MP4 (H.264) always, WebM (VP9) optional; poster always present (also the
fallback still); ≤ 1080p; hero clip ≤ ~15s and ≤ ~6 MB; inline `preload="none"`; real
`alt` on images. Switch a slot on by editing its object in `experiences.ts`
(`placeholder` → `image`/`video`) and dropping the file into the folder.

---

## 5. The template (design contract)
`src/layouts/ExperientialPost.astro`. Section order: site header → breadcrumb → hero
(image or ambient video) → "this trip is bookable" strip → intro → at-a-glance (3
cards) → journey (5–7 chapters, alternating media) → gallery (5 slots) → teal CTA →
related posts → site footer. Brand tokens are fixed (don't reskin per post): teal
`#20A1AA`, teal-deep `#177D85`, navy `#073140`, orange `#ff7f00` (chapter numerals),
display CaslonGraphiqueEF, body BentonSans. The bookable strip and CTA both point to
`cta.bookingUrl`.

---

## 6. Edit → Preview → Publish
1. **Edit:** drop files into `public/blog-media/<slug>/`, flip the matching slots to
   `image`/`video`, adjust copy.
2. **Preview:** `npm run dev` → `http://localhost:4321/blog/experiences/<slug>`.
   Drafts render locally only.
3. **Publish (explicit command):** set `draft: false`; supply a real `cta.bookingUrl`
   (no `TODO:` left); run `npm run build`; show the diff + preview. The post then gets
   a production route + enters the sitemap. Published experiences now also surface
   automatically at the top of the blog listing (`src/pages/blog/index.astro` merges
   `publishedExperiences` into the card grid, linking to `/blog/experiences/<slug>`).
4. **Deploy:** only after approval, run `./deploy.sh`. Append to `CHANGELOG.md`.

Publishing is reversible: set `draft` back to `true` (or revert) to fully unpublish.

---

## 7. Copy-paste prompts

**Generate a draft:**
```
Create an experiential blog DRAFT from this tour URL: <PASTE URL>
Follow docs/experiential-blog/README.md: fetch & extract facts, rewrite ALL prose
originally, add a draft Experience to src/data/experiences.ts, group the itinerary
into 5–7 chapters, leave labelled placeholder media slots (embed no final media),
create public/blog-media/<slug>/ folders. Do NOT publish/deploy or touch the product
template. Print files changed, the preview URL, media paths, and any TODO markers.
```

**Publish:**
```
Publish draft <slug>: set draft:false, supply the real cta.bookingUrl, run the build,
and show me the diff + preview before committing. Do not deploy until I confirm.
```
