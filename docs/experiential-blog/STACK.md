# STACK.md — How the holiday-site blog actually works (Phase 1 findings)

_Discovered 2026-06-13 against `/Users/admin/holiday-site`. This is the
documentation of record for the experiential-blog generator. The README's
generic placeholders (Next.js, `/blog/`, filesystem media) were **wrong for
this repo** — the real facts are below, and the four design forks they created
are resolved at the bottom._

## Framework / SSG
- **Astro 5.18**, `output: "hybrid"` — blog/static pages are SSG, holiday pages are SSR.
- `site: 'https://holidays.flightsandpackages.com'`, Cloudflare adapter.
- Dev: `npm run dev` (port 4321). Build: `npm run build` → `dist/`. Deploy: `./deploy.sh` (never raw wrangler).

## How a standard blog post is defined & rendered
- **Not files, not Markdown.** Posts live as objects in `src/data/blog-export.json`
  (151 posts), transformed by `src/data/blogs.ts` into a `Blog` interface.
- A `Blog` has: `title, slug, image, date, publishedAt, author, excerpt, tags[],
  content (raw HTML), metaTitle, metaDescription, updatedAt`.
- One shared route renders them all: `src/pages/blog/[slug].astro`. It wraps the
  post in the **site header + a sidebar shell** (author, tags, related, pagination)
  and injects `content` HTML into the body via `<Fragment set:html>`.
- `viva-one-ship-guide` exists (id 412) — its body is the HTML `content` blob.

## Hero & inline images
- Blog images use the `/objects/images/blog/...` path, **served from Cloudflare
  R2** (bucket `holidays-images`) via `src/pages/objects/images/[...path].ts`.
  They are **not** files in `public/`. Dropping a file in a local folder does
  nothing for these — they must be uploaded to R2.
- There is **no `/objects/videos/` route** — video serving did not exist.
- `public/` is served statically (e.g. `public/images/...` → `/images/...`).

## "Latest Blog Posts" feed
- Built on holiday detail pages (`src/pages/Holidays/[country]/[slug].astro`) by
  filtering `allBlogs` for the country name in title/excerpt, falling back to the
  latest 4. A card needs: `image, title, date, excerpt, slug`.
- Related-posts on a blog detail page = shared-tag match from `allBlogs`.

## Draft vs published
- Only mechanism: `isPublished` boolean in `blog-export.json`. `blogs.ts` filters
  `allBlogs` to `isPublished === true`. There is **no `draft` frontmatter**.
- Because the site is SSG, an unpublished post generates **no route at all** —
  so a draft cannot be previewed at its real URL with the existing system.

## Sitemap
- `@astrojs/sitemap`; filter excludes `/Holidays/search`. All generated routes
  (incl. each blog post) are included automatically. Drafts, having no route, are
  excluded for free.

## Brand (must match — no reskin per post)
- Fonts: **BentonSans** (body, `@font-face` in `public/fonts/`), **CaslonGraphiqueEF**
  (display/headings). Declared in `src/styles/fonts.css`, preloaded in `BaseLayout`.
- Colours: teal `#20A1AA`, teal-deep `#177D85`, navy `#073140` (header/footer),
  CTA orange `#ff7f00`, body grey `#424242`.
- `BaseLayout.astro` is just the `<head>` + `<body><main><slot/></main>` shell
  (SEO meta, fonts, analytics, cookie banner). Header/Footer are rendered per-page.

## The four forks — and how they were resolved
1. **Full-page experiential template vs the shared blog shell** → experiential
   posts get their **own layout + route** (`src/layouts/ExperientialPost.astro`,
   `src/pages/blog/experiences/[slug].astro`). They compose the site Header/Footer
   but do not fork `blog/[slug].astro` or the product template.
2. **Media location** → experiential media lives in **`public/blog-media/<slug>/`**
   (real static assets — instant in dev and prod, no R2 upload, no video route
   needed). This deliberately differs from the R2 convention used by legacy posts.
3. **Draft preview** → a draft (`draft: true`) renders in **DEV only**. The route's
   `getStaticPaths` uses `buildExperiences`, which includes drafts when
   `import.meta.env.DEV` and only published posts otherwise — so drafts are
   previewable locally yet never reach the production build or sitemap. Drafts also
   set `noindex`.
4. **Fonts** → experiential posts use the **real brand fonts** (BentonSans +
   CaslonGraphiqueEF), not Fraunces/Hanken. Orange `#ff7f00` is the accent for
   chapter numerals (the README's "gold" is not a brand colour).

## Files that make up the generator
- `src/data/experiences.ts` — `Experience` type + structured post data + draft filtering.
- `src/components/experiential/Figure.astro` — renders an image / video / placeholder slot.
- `src/layouts/ExperientialPost.astro` — the on-brand storytelling layout.
- `src/pages/blog/experiences/[slug].astro` — the route (DEV-draft aware).
- `public/blog-media/<slug>/{images,videos}/` — drop-in media + a per-post README.
