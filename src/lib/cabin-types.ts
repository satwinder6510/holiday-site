/**
 * Cabin descriptions for the sailing picker.
 *
 * A cabin grade in the fare feed is a bare name ("Double Cabin Ruby"). The ship
 * record Widgety gives us carries the rest under `accomodation_types` (their
 * spelling): size, deck, French balcony or fixed window, the equipment list and
 * photos of that cabin type. Owner 2026-09-26 on the VIVA Hungary page: "there's
 * no cabin description just a name". This reads those types off the ship's raw
 * record and matches them to the grades the offer sells.
 *
 * Matching is by words, not codes: the fare rows we store carry the grade name
 * only. The two operators write the same cabin two ways —
 *   VIVA          fare "Double Cabin Ruby"                    type "Double Cabin | Ruby Deck"
 *   CroisiEurope  fare "Cat C (Main Deck, Adjustable Twin Beds)"  type "Main Deck 2 Adjustable Twin Beds Cat C"
 * — so a type wins when it shares most of its words with the grade (Jaccard over
 * the word sets, digits and filler dropped) and the deck agrees. An unmatched
 * grade simply keeps today's name-only row; nothing is invented.
 *
 * Read-only, one indexed query, degrades to {} rather than throwing.
 */
import { eq } from 'drizzle-orm';
import type { Database } from './db';
import { cruiseOffers, cruiseRoutes, cruiseShips } from './db-schema';

const CRUISE_ID_OFFSET = 10000;

export interface CabinTypeInfo {
  /** Widgety's name for the type, e.g. "Double Cabin | Ruby Deck". */
  name: string;
  /** Square metres, from the type's stats (Widgety gives square feet). */
  sizeSqm: number | null;
  /** Up to N guests. */
  sleeps: number | null;
  /** "French balcony", "Balcony", "Window (cannot be opened)" … the outlook line. */
  outlook: string | null;
  /** One plain-text line for the row: the supplier's prose, or its highlight bullets. */
  summary: string;
  /** The supplier's equipment list, plain text, for the expandable detail. */
  equipment: string[];
  /** https photo URLs of this cabin type, first is the lead. */
  images: string[];
}

interface RawAccomType {
  name?: string;
  description?: string | null;
  accom_stats?: { type?: string; min_occupancy?: number; max_occupancy?: number; min_size?: number; max_size?: number } | null;
  facilities?: Array<string | { name?: string }> | null;
  images?: Array<{ href?: string }> | null;
}

// ── HTML → text ─────────────────────────────────────────────────────

const decode = (s: string) =>
  s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
   .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
const text = (html: string) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

/** Every <li> in document order, as plain text. */
function listItems(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
    const t = text(m[1]);
    if (t) out.push(t);
  }
  return out;
}

/** Every non-empty <p> that is not inside a list, as plain text. */
function paragraphs(html: string): string[] {
  const noLists = html.replace(/<ul[\s\S]*?<\/ul>/gi, ' ');
  const out: string[] = [];
  for (const m of noLists.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = text(m[1]);
    if (t) out.push(t);
  }
  return out;
}

const OUTLOOK = /french balcony|juliet balcony|balcony|panoramic window|window \(cannot be opened\)|fixed window|window|porthole/i;
const SIZE = /(\d+(?:[.,]\d+)?)\s*m²|(\d+(?:[.,]\d+)?)\s*sq\.?\s*m\b/i;

function parseType(a: RawAccomType): CabinTypeInfo | null {
  const name = (a.name || '').replace(/\s+/g, ' ').trim();
  if (!name) return null;
  const html = a.description || '';
  const items = listItems(html);
  const prose = paragraphs(html);

  // Size: the stats carry square feet; the description often says "15 m²".
  let sizeSqm: number | null = null;
  const sizeInText = html.match(SIZE);
  if (sizeInText) sizeSqm = Math.round(Number((sizeInText[1] || sizeInText[2]).replace(',', '.')));
  else if (a.accom_stats?.min_size) sizeSqm = Math.round(a.accom_stats.min_size * 0.0929);

  const outlookHit = items.map(i => i.match(OUTLOOK)).find(Boolean) || text(html).match(OUTLOOK);
  let outlook: string | null = null;
  if (outlookHit) {
    const w = outlookHit[0].toLowerCase();
    outlook = w.includes('cannot be opened') || w === 'fixed window' ? 'Fixed window'
      : w.charAt(0).toUpperCase() + w.slice(1);
  }

  // The supplier's text splits at an "EQUIPMENT" / "Amenities" heading: highlight
  // bullets before it, the kit list after. VIVA writes bullets only; CroisiEurope
  // writes a prose paragraph, the heading, the list, then a note in italics.
  const headingAt = html.search(/equipment|amenities/i);
  let highlights: string[] = [];
  let equipment: string[] = [];
  if (headingAt >= 0) {
    highlights = listItems(html.slice(0, headingAt));
    equipment = listItems(html.slice(headingAt));
  } else {
    equipment = items;
  }
  // Size and deck already show as facts; the rest of the highlights are the line.
  const isFact = (s: string) => SIZE.test(s) || /\bdeck\b/i.test(s) || OUTLOOK.test(s);
  // A bare heading paragraph is not prose. The first real paragraph is the
  // summary; any later ones (CroisiEurope's "no laundry service" note) go with
  // the equipment, where the reader who opens the detail will see them.
  const proseLines = prose.filter(p => !/^(equipment|amenities|facilities|features)\s*:?\s*$/i.test(p));
  const summary = proseLines.length
    ? proseLines[0]
    : highlights.filter(s => !isFact(s)).join(' · ');
  equipment = [...equipment, ...proseLines.slice(1)];

  const images = (a.images || [])
    .map(i => (i.href || '').trim())
    .filter(Boolean)
    .map(h => (h.startsWith('//') ? `https:${h}` : h));

  return {
    name,
    sizeSqm,
    sleeps: a.accom_stats?.max_occupancy ?? null,
    outlook,
    summary,
    equipment: [...new Set(equipment.filter(e => !isFact(e) || !highlights.includes(e)))],
    images,
  };
}

// ── Matching a grade to a type ──────────────────────────────────────

const FILLER = new Set(['cabin', 'cabins', 'deck', 'and', 'the', 'with', 'a', 'of', 'bed', 'beds']);
// Same closed deck vocabulary as parseCabinGrade in cruise-detail.ts.
const DECKS = new Set(['main', 'middle', 'upper', 'lower', 'sun', 'panorama', 'emerald', 'ruby', 'diamond', 'sapphire', 'amber', 'opal', 'pearl']);

// Words that change what the cabin IS: both sides must agree on each of them.
// Without this "Cat B (Upper Deck, Double Bed)" took the wheelchair-accessible
// type on the same deck and "Cat C (Main Deck, Double Bed)" took a single cabin.
const MUST_AGREE = ['accessible', 'single', 'suite'];

function words(s: string): Set<string> {
  return new Set(
    s.toLowerCase()
      .replace(/[|(),\-–/]/g, ' ')
      .split(/\s+/)
      .map(w => (w === 'wheelchair' ? 'accessible' : w))
      .filter(w => w && !/^\d+$/.test(w) && !FILLER.has(w)),
  );
}
const deckOf = (ws: Set<string>) => [...ws].find(w => DECKS.has(w)) ?? null;

function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

/**
 * The best type for each grade name. Deck and the MUST_AGREE words have to match,
 * nearly every word of the grade must appear in the type (one may be missing:
 * "Wheelchair Accessible" vs "Accessible Cabin"), and among what is left the
 * closest word set wins — so "Double Cabin Ruby" takes "Double Cabin | Ruby Deck"
 * and not "Double Cabin Aft | Ruby Deck". No candidate, no description.
 */
export function matchCabinTypes(gradeNames: string[], types: CabinTypeInfo[]): Record<string, CabinTypeInfo> {
  const out: Record<string, CabinTypeInfo> = {};
  const typeWords = types.map(t => words(t.name));
  for (const grade of gradeNames) {
    const gw = words(grade);
    if (!gw.size) continue;
    let best: { score: number; type: CabinTypeInfo } | null = null;
    const gDeck = deckOf(gw);
    types.forEach((t, i) => {
      const tw = typeWords[i];
      const tDeck = deckOf(tw);
      if (gDeck && tDeck && gDeck !== tDeck) return;
      if (MUST_AGREE.some(w => gw.has(w) !== tw.has(w))) return;
      let covered = 0;
      for (const w of gw) if (tw.has(w)) covered++;
      if (covered / gw.size < 0.8) return;
      const score = jaccard(gw, tw);
      if (score > (best?.score ?? 0)) best = { score, type: t };
    });
    if (best) out[grade] = best.type;
  }
  return out;
}

/** The ship's cabin types for a holiday-site cruise id, or [] for anything else. */
export async function getCabinTypes(db: Database, holidaySiteId: number): Promise<CabinTypeInfo[]> {
  const offerId = holidaySiteId - CRUISE_ID_OFFSET;
  if (offerId <= 0) return [];
  try {
    const rows = await db
      .select({ raw: cruiseShips.rawData })
      .from(cruiseOffers)
      .innerJoin(cruiseRoutes, eq(cruiseRoutes.id, cruiseOffers.routeId))
      .innerJoin(cruiseShips, eq(cruiseShips.id, cruiseRoutes.shipId))
      .where(eq(cruiseOffers.id, offerId))
      .limit(1);
    const raw = rows[0]?.raw;
    if (!raw) return [];
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const types: RawAccomType[] = Array.isArray(data?.accomodation_types) ? data.accomodation_types : [];
    return types.map(parseType).filter((t): t is CabinTypeInfo => !!t);
  } catch (e) {
    console.error('getCabinTypes failed', e);
    return [];
  }
}
