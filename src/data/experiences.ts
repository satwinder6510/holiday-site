// Experiential blog posts — long-form, storytelling layout.
//
// These are a SEPARATE artifact from the standard blog (src/data/blogs.ts +
// blog-export.json). A standard blog post is a single HTML `content` blob
// rendered inside the sidebar shell; an Experience is a STRUCTURED post
// (hero / intro / chapters / gallery / CTA) rendered full-bleed by
// src/layouts/ExperientialPost.astro at /blog/experiences/<slug>.
//
// Rules of the road (see docs/experiential-blog/README.md):
//  • Drafts are never live. `draft: true` posts render in DEV only and are
//    excluded from the production build, the sitemap, and every public feed.
//  • Prose is original. When sourced from a third-party page we extract facts
//    and structure only, then rewrite everything in our own voice.
//  • Media is never embedded at generation time. Every slot starts as a
//    `placeholder` with a label + intended path; you swap in <img>/<video>
//    by hand from public/blog-media/<slug>/.

/** A single image / video / placeholder slot. Keep `ar` on every slot so the
 *  layout never shifts when media is swapped in. */
export interface MediaSlot {
  kind: 'placeholder' | 'image' | 'video';
  /** CSS aspect ratio, e.g. '4/3', '16/9', '3/2'. */
  ar: string;
  /** Human label — shown inside the placeholder, and used as the suggested filename stem. */
  label: string;
  /** Alt text for images / aria-label for videos. Always write real alt text. */
  alt?: string;
  /** Image src, or video poster. Path under /blog-media/<slug>/images/. */
  src?: string;
  /** Video sources (mp4 always; webm optional). Paths under /blog-media/<slug>/videos/. */
  mp4?: string;
  webm?: string;
  /** HLS manifest (.m3u8) for adaptive streaming — e.g. a Cloudflare Stream URL.
   *  On an ambient hero, hls.js streams it (Safari plays it natively), with any
   *  mp4/webm below as fallback. Empty/omitted → the hero shows the poster only. */
  hls?: string;
  /** Hero ambient video — silent, looping background. Honours prefers-reduced-motion. */
  ambient?: boolean;
}

export interface Chapter {
  /** Itinerary-day label shown as the chapter marker, e.g. 'Day 3' or 'Days 5–7'. */
  day: string;
  title: string;
  /** Short place label, e.g. 'Chobe National Park · Botswana'. */
  place: string;
  /** One short, sensory paragraph (original prose). */
  body: string;
  media: MediaSlot;
}

export interface GlanceCard {
  label: string;
  value: string;
}

export interface Experience {
  slug: string;
  draft: boolean;
  tags: string[];
  /** Display date, e.g. '13 June 2026'. */
  date: string;
  /** ISO timestamp for schema. */
  publishedAt: string;
  author: string;

  hero: {
    /** Evocative line — NOT the SEO product title. */
    title: string;
    /** Small uppercase eyebrow above the title. */
    eyebrow: string;
    /** Byline meta: duration · route · date. */
    meta: string;
    media: MediaSlot;
  };

  /** 2-paragraph hook. */
  intro: string[];

  /** Exactly 3 quick cards: route / best-for / what's-handled. */
  glance: GlanceCard[];

  /** 5–7 narrative chapters grouped by place/region. */
  chapters: Chapter[];

  /** 5 gallery slots. */
  gallery: MediaSlot[];

  cta: {
    headline: string;
    /** Price line, e.g. 'from £2,499pp'. */
    price: string;
    /** Bookable product page URL. MANDATORY before publish. */
    bookingUrl: string;
    phone: string;
  };

  seo: {
    metaTitle: string;
    metaDescription: string;
    /** Used in feeds/cards once published. */
    excerpt: string;
    /** Card / OG image. Falls back to hero poster. */
    image: string;
  };
}

// ── Posts ──────────────────────────────────────────────────────────────

const ZAMBEZI_SLUG = 'southern-africa-zambezi-safari-cruise';
const M = `/blog-media/${ZAMBEZI_SLUG}`;

// Cloudflare Stream HLS manifest for the hero (adaptive, CDN-served).
// Paste the URL here AFTER uploading the hero clip to Stream — until then the
// hero gracefully shows the poster image, so the live page never breaks.
// Format: https://customer-<CODE>.cloudflarestream.com/<UID>/manifest/video.m3u8
const ZAMBEZI_HERO_HLS = 'https://customer-wj01kterp4hvns4u.cloudflarestream.com/4cf127b917f4dd107ae3e5fc270ffeee/manifest/video.m3u8';

const southernAfricaZambezi: Experience = {
  slug: ZAMBEZI_SLUG,
  draft: false,
  tags: ['River Cruise', 'Safari', 'Africa'],
  date: '13 June 2026',
  publishedAt: '2026-06-13T09:00:00.000Z',
  author: 'Flights and Packages',

  hero: {
    title: 'Where the River Meets the Wild',
    eyebrow: 'Southern Africa · River Safari',
    meta: '9 days · Johannesburg → Victoria Falls · South Africa, Botswana, Namibia, Zimbabwe',
    media: {
      kind: 'video',
      ambient: true,
      ar: '21/9',
      label: 'hero — five-anchor ship on Lake Kariba at golden hour',
      alt: 'A five-anchor cruise ship at anchor on Lake Kariba, mirrored in still water at sunset',
      src: `${M}/images/hero-video-poster.jpg`,
      mp4: `${M}/videos/hero.mp4`,
      hls: ZAMBEZI_HERO_HLS,
    },
  },

  intro: [
    'Some journeys you watch through a window. This one you feel on your skin — the warm hush of the Chobe at dawn, the spray that drifts off Victoria Falls and catches the light a mile away, the low rumble of a hippo somewhere out in the reeds. Over nine unhurried days you trade four countries between you and the wild, travelling by small boat, bush plane and an intimate, five-anchor ship.',
    'There are no long transfers and no logistics to untangle. Flights between camps, every meal, drinks at the bar and both land and water safaris are handled, so the only decision left to you each morning is which deck chair faces the better view. It is Africa at its most generous — close enough to touch, comfortable enough to savour.',
  ],

  glance: [
    {
      label: 'The route',
      value: 'Johannesburg to Victoria Falls, by lodge and ship — Chobe, Impalila Island, Lake Kariba and the Matusadona wilderness.',
    },
    {
      label: 'Best for',
      value: 'First-time safari-goers and old Africa hands alike who want big wildlife without roughing it — and the rare thrill of tracking game from the water.',
    },
    {
      label: 'What’s handled',
      value: 'Internal flights between camps, land and water safaris, all meals, drinks with meals and at the bar, lodge and five-anchor ship.',
    },
  ],

  chapters: [
    {
      day: 'Day 1',
      title: 'Beginning in Johannesburg',
      place: 'Johannesburg · South Africa',
      body: 'Before the wild, a day with South Africa’s story. You settle into a hotel in leafy Rosebank — wired straight into a smart mall — then spend the afternoon at the Apartheid Museum and out in Soweto, standing outside the modest house where Nelson Mandela once lived and, a few doors along, Archbishop Tutu’s: the only street in the world to have raised two Nobel Peace laureates. Dinner is back at the hotel, the bush still a flight away.',
      media: { kind: 'image', ar: '9/16', label: 'Day 1 — CroisiEurope welcome at the Johannesburg hotel', alt: 'The CroisiEurope welcome desk at the 54 on Bath hotel in Johannesburg, with a framed CroisiEurope logo and the group welcome letter', src: `${M}/images/chapter-1-croisi-welcome.jpg` },
    },
    {
      day: 'Day 2',
      title: 'Four Countries by Boat',
      place: 'Kasane → Impalila Island · Botswana to Namibia',
      body: 'A morning flight north drops you in Kasane, in Botswana, and from there the journey turns amphibious. A border post, a walk down to a small boat, a hop across the water into Namibia, then a final half-hour upriver to your island lodge — a crocodile sliding off the bank as you pass. By the time you reach Impalila Island the map has blurred: four countries meet within sight of the deck, and the evening belongs to the river and the bush settling in for the night.',
      media: { kind: 'video', ar: '9/16', label: 'Day 2 — the boat crossing to Kasane', alt: 'Video of the small-boat river crossing near Kasane', src: `${M}/images/chapter-2-kasane-poster.jpg`, mp4: `${M}/videos/chapter-2-kasane.mp4` },
    },
    {
      day: 'Day 3',
      title: 'A Day in Chobe',
      place: 'Chobe National Park · Botswana',
      body: 'Your full day in Chobe comes in two halves. The morning is an open-vehicle game drive across the park — a warm jacket is worth having against the wind — where the bush gives up whatever it chooses to that day; some mornings that means lion or a tower of giraffe, some mornings the quieter cast of antelope, buffalo and a sky full of birds. After an unhurried lunch you trade wheels for water, easing along the Chobe toward Sedudu Island, a cool box of drinks always within reach. Few places let you read the same wilderness from both the land and the river in a single day.',
      media: { kind: 'video', ar: '9/16', label: 'Day 3 — Chobe game drive', alt: 'Video from a game drive in Chobe National Park', src: `${M}/images/chapter-3-chobe-poster.jpg`, mp4: `${M}/videos/chapter-3-chobe.mp4` },
    },
    {
      day: 'Day 4',
      title: 'Island Time on the Zambezi',
      place: 'Impalila Island · Namibia',
      body: 'A gentler day, shaped entirely by the river. You visit a local village to meet the people who live along this watery border, then come back to the lodge for a barbecue lunch on the deck. The afternoon is yours to fish quietly from a small boat — line out, nothing much to do but wait — before a sunset cruise sends you back onto the water as the Zambezi turns to copper and the hippos start up somewhere in the reeds.',
      media: { kind: 'video', ar: '9/16', label: 'Day 4 — on the river at Impalila', alt: 'Video on the Zambezi near Impalila Island', src: `${M}/images/chapter-4-impalila-poster.jpg`, mp4: `${M}/videos/chapter-4-impalila.mp4` },
    },
    {
      day: 'Days 5–7',
      title: 'Slow Days on Lake Kariba',
      place: 'Lake Kariba · Matusadona National Park · Zimbabwe',
      body: 'Getting here is its own adventure: a small plane via Victoria Falls for immigration, the lake unfurling beneath the window, then a 45-minute drive to the ship that becomes a game drive of its own — elephant, lion, hippo, zebra and giraffe along the track, depending on the day. The days that follow are the slow, golden heart of the trip. Each morning the ship’s small boats nose into the Matusadona’s quiet channels to watch game from the water, close among drowned trees that stand like sculpture in the shallows; the ship sails on toward the southern reaches of the lake, and the afternoons drift between a fishing line over the side, a lake cruise and a deck chair. There is time, at last, to do gloriously little.',
      media: { kind: 'image', ar: '4/3', label: 'Days 5–7 — Lake Kariba at sunset', alt: 'A lone tree mirrored in the still water of Lake Kariba at sunset', src: `${M}/images/chapter-5-kariba.jpg` },
    },
    {
      day: 'Day 8',
      title: 'The Smoke That Thunders',
      place: 'Victoria Falls · Zimbabwe',
      body: 'An early start, with a pause at the great wall of the Kariba Dam before you fly back to Victoria Falls and check into the Safari Lodge — where a waterhole out back draws animals down to drink and, at one o’clock, the vultures come in to be fed. After a Zambezi lunch cruise upstream, all calm water and hippo pods, you go to meet the falls themselves: on foot along the rim of the widest sheet of falling water on earth, the spray rising in great clouds with rainbows strung through it. It is loud, drenching and unforgettable — the kind of place that resets your sense of scale, and a fitting last act before the morning flight home. Mosi-oa-Tunya, the locals call it: the smoke that thunders.',
      media: { kind: 'video', ar: '16/9', label: 'Day 8 — Victoria Falls (video)', alt: 'Video of Victoria Falls in full flow', src: `${M}/images/vic-falls-video-poster.jpg`, mp4: `${M}/videos/chapter-6-vic-falls.mp4` },
    },
  ],

  gallery: [
    { kind: 'image', ar: '4/3', label: 'gallery-1 — male lion', alt: 'A male lion standing in the bush on the Lake Kariba shore', src: `${M}/images/gallery-1.jpg` },
    { kind: 'image', ar: '7/5', label: 'gallery-2 — hippo', alt: 'A hippo surfacing in the still water, ringed by ripples', src: `${M}/images/gallery-2.jpg` },
    { kind: 'image', ar: '3/4', label: 'gallery-3 — the guides at a sundowner', alt: 'Two smiling CroisiAfrica safari guides with the sundowner spread on the boat at golden hour', src: `${M}/images/gallery-guides.jpg` },
    { kind: 'image', ar: '5/4', label: 'gallery-4 — crocodile', alt: 'A large crocodile basking on a sandbank along the river', src: `${M}/images/gallery-4.jpg` },
    { kind: 'image', ar: '1/1', label: 'gallery-5 — zebra', alt: 'A zebra framed by autumn-toned foliage in the bush', src: `${M}/images/gallery-5.jpg` },
    { kind: 'image', ar: '4/3', label: 'gallery-6 — hippo pod', alt: 'A pod of hippos in the water, one with its mouth wide open', src: `${M}/images/gallery-6.jpg` },
    { kind: 'image', ar: '3/4', label: 'gallery-7 — the bush plane', alt: 'A small bush plane on a remote airstrip behind a hedge of bright bougainvillea', src: `${M}/images/gallery-7.jpg` },
    { kind: 'video', ar: '9/16', label: 'gallery-8 — the bush plane landing', alt: 'Video of the small bush plane landing on the airstrip', src: `${M}/images/gallery-8-poster.jpg`, mp4: `${M}/videos/gallery-8.mp4` },
    { kind: 'image', ar: '9/16', label: 'gallery-9 — breakfast on the lodge deck', alt: 'Breakfast laid out on the lodge deck under palms beside the river, with staff in green', src: `${M}/images/gallery-9.jpg` },
  ],

  cta: {
    headline: 'Travel to the ends of the earth — and back in time for dinner.',
    price: 'Enquire for 2026 & 2027 pricing',
    bookingUrl: '', // no bookable product page yet — CTA falls back to enquire / browse cruises
    phone: '0208 183 0518',
  },

  seo: {
    metaTitle: 'Southern Africa Safari Cruise on the Zambezi | Flights and Packages',
    metaDescription: 'A 9-day Southern Africa safari cruise from Johannesburg to Victoria Falls — Chobe, Lake Kariba and the Matusadona by lodge and five-anchor ship, with land and water safaris, flights and all meals included.',
    excerpt: 'Nine unhurried days across four countries — tracking elephants from the water on the Chobe, cruising the Matusadona wilderness and standing in the spray of Victoria Falls, by lodge and five-anchor ship.',
    image: `${M}/images/hero-poster.jpg`,
  },
};

// ── Registry ─────────────────────────────────────────────────────────────

const allExperiences: Experience[] = [southernAfricaZambezi];

/** Published experiences only — safe for feeds, listings and the sitemap. */
export const publishedExperiences: Experience[] = allExperiences.filter((e) => !e.draft);

/**
 * Experiences visible at build time. In DEV we include drafts so they can be
 * previewed locally; in a production build only published posts get a route,
 * so drafts never appear in the public build or sitemap.
 */
export const buildExperiences: Experience[] = import.meta.env.DEV
  ? allExperiences
  : publishedExperiences;

export function getExperienceBySlug(slug: string): Experience | undefined {
  return allExperiences.find((e) => e.slug === slug);
}
