# Media — Southern Africa Zambezi Safari Cruise

Drop image and video files in here, then swap the matching `placeholder` slots
in `src/data/experiences.ts` to `kind: 'image'` (or `'video'`). Files placed in
`public/` are served at the same path minus `public/` — e.g.
`public/blog-media/southern-africa-zambezi-safari-cruise/images/hero-poster.jpg`
→ `/blog-media/southern-africa-zambezi-safari-cruise/images/hero-poster.jpg`.

Keep the `ar` (aspect ratio) on each slot so the layout never shifts.

## Suggested files

### images/
| File | Slot | Aspect |
|---|---|---|
| `hero-poster.jpg`        | hero (also the poster if you use a hero video) | 21/9 |
| `chapter-1-johannesburg.jpg` | Day 1 — Soweto / Mandela house     | 4/3  |
| `chapter-2-border-boat.jpg`  | Day 2 — small boat river crossing  | 3/2  |
| `chapter-3-chobe.jpg`        | Day 3 — Chobe game drive           | 3/2  |
| `chapter-4-impalila.jpg`     | Day 4 — Impalila sunset cruise     | 4/3  |
| `chapter-5-kariba.jpg`       | Days 5–7 — ship on Lake Kariba     | 16/9 |
| `chapter-6-vic-falls.jpg`    | Day 8 — Victoria Falls in spray    | 3/2  |
| `gallery-1.jpg` … `gallery-5.jpg` | Gallery tiles                 | 3/2  |

### videos/ (optional)
| File | Notes |
|---|---|
| `hero.mp4` / `hero.webm` | Silent ambient hero loop, ≤ ~15s, ≤ ~6 MB, ≤ 1080p. Always pair with `hero-poster.jpg`. |

## How to switch a slot on
In `src/data/experiences.ts`, change e.g.:
```ts
{ kind: 'placeholder', ar: '3/2', label: '…', alt: '…', src: `${M}/images/gallery-1.jpg` }
```
to:
```ts
{ kind: 'image', ar: '3/2', alt: 'Real descriptive alt text', src: `${M}/images/gallery-1.jpg` }
```
For a video slot, set `kind: 'video'` and provide `mp4` (and optionally `webm`),
with `src` as the poster. For the hero ambient loop, keep `ambient: true`.
