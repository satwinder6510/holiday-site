/**
 * Cruise detail page data — the parts the static cruise export can't carry.
 *
 * The export (src/data/cruise-export.json) flattens an itinerary day to
 * {day, port, country, description}, dropping the arrival/departure times and the
 * UN/LOCODE that D1 actually holds. And the cabin grid it feeds is aggregated to the
 * cheapest price per grade across every sailing, which is the wrong shape for a page
 * where the customer picks one sailing and then one cabin on it.
 *
 * Both queries here are read-only, indexed, and degrade to an empty result rather
 * than throwing — a cruise page without a map is fine, a 503 is not.
 */
import { and, eq, gte } from 'drizzle-orm';
import type { Database } from './db';
import { cruiseOffers, cruiseRoutes, cruiseSailings, cruiseOfferSailingCabins } from './db-schema';
import { roundToNine } from './pricing-transforms';
import portCoords from '../data/port-coords.json';

/** holiday-site cruise ids are the D1 offer id plus this offset. */
const CRUISE_ID_OFFSET = 10000;

const COORDS = portCoords as Record<string, { name: string; lat: number; lng: number; src: string }>;

// ── Port calls ──────────────────────────────────────────────────────

export interface PortCall {
  day: number;
  port: string;
  country: string | null;
  unlocode: string | null;
  /** "13:00", or null where the feed only carries a date. */
  arrival: string | null;
  departure: string | null;
  overnight: boolean;
  /** Minutes alongside, where both ends of the call are known. */
  minutesInPort: number | null;
  lat: number | null;
  lng: number | null;
}

/** "2026-09-28 13:00:00" → "13:00". Midnight is the feed's date-only marker. */
function clockOf(ts: string | null | undefined): string | null {
  const t = (ts || '').slice(11, 16);
  return t && t !== '00:00' ? t : null;
}

interface RawItineraryDay {
  dayNumber?: number;
  portName?: string | null;
  country?: string | null;
  unlocode?: string | null;
  arrival?: string | null;
  departure?: string | null;
  overnight?: boolean;
}

/**
 * Port calls for one cruise, with times and coordinates.
 * One row per CALL, not per day — a day can hold two calls (Dürnstein then Melk).
 */
export async function getCruiseCalls(db: Database, holidaySiteId: number): Promise<PortCall[]> {
  const offerId = holidaySiteId - CRUISE_ID_OFFSET;
  if (offerId <= 0) return [];

  try {
    const rows = await db
      .select({ itinerary: cruiseRoutes.itinerary })
      .from(cruiseOffers)
      .innerJoin(cruiseRoutes, eq(cruiseRoutes.id, cruiseOffers.routeId))
      .where(eq(cruiseOffers.id, offerId))
      .limit(1);

    const raw = rows[0]?.itinerary as RawItineraryDay[] | string | null | undefined;
    if (!raw) return [];
    const days: RawItineraryDay[] = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(days)) return [];

    return days
      .filter(d => d && d.portName)
      .map((d, i) => {
        const code = (d.unlocode || '').trim().toUpperCase();
        const geo = code ? COORDS[code] : undefined;
        const arrival = clockOf(d.arrival);
        const departure = clockOf(d.departure);

        // A late call can depart after midnight, so wrap instead of going negative.
        let minutesInPort: number | null = null;
        if (arrival && departure) {
          const mins = toMinutes(departure) - toMinutes(arrival);
          minutesInPort = mins < 0 ? mins + 24 * 60 : mins;
        }

        return {
          day: d.dayNumber ?? i + 1,
          port: d.portName as string,
          country: d.country ?? null,
          unlocode: code || null,
          arrival,
          departure,
          overnight: !!d.overnight,
          minutesInPort,
          lat: geo?.lat ?? null,
          lng: geo?.lng ?? null,
        };
      });
  } catch (e) {
    console.error('getCruiseCalls failed', e);
    return [];
  }
}

const toMinutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3));

/** "7h 30m", "30m", "10h". Null in, null out. */
export function formatDwell(mins: number | null): string | null {
  if (mins == null || mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? (m ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

// ── Cabin ladder, per sailing ───────────────────────────────────────

export interface CabinGrade {
  /** The supplier's own string, e.g. "Double Cabin aft Ruby". */
  cabinType: string;
  /** "Double Cabin, aft" — the grade without the deck. */
  name: string;
  /** "Ruby", or null where the string carries no deck. */
  deck: string | null;
  /** All-in per person for this grade on this sailing, before the airport is chosen. */
  netPp: number;
  /** Admin's manual selling price where one is set. */
  retailPp: number | null;
}

export interface SailingLadder {
  /** YYYY-MM-DD */
  date: string;
  shipId: number | null;
  grades: CabinGrade[];
  /** Cheapest grade on this sailing — the lead-in the airport price is quoted against. */
  leadPp: number;
}

/**
 * Deck + grade out of a supplier cabin string. Three formats are in the feed:
 *
 *   CroisiEurope  "Cat B Suite (Main Deck, 2 Single Beds)"   deck in brackets
 *   A-ROSA        "Main Deck 2 Adjustable Twin Beds"          deck leads
 *   VIVA          "Double Cabin aft Ruby"                     deck trails, a gemstone
 *
 * A closed vocabulary is deliberate. An open rule ("last capitalised word is the
 * deck") reads "Beds", "Window" and "Person" as decks — it was tried and it is
 * wrong on 54 of the 74 strings in the table. Anything unrecognised keeps its full
 * name and groups under "Other", which is honest rather than invented.
 */
const DECK_WORDS = new Set([
  'main', 'middle', 'upper', 'lower', 'sun', 'panorama',            // A-ROSA / CroisiEurope
  'emerald', 'ruby', 'diamond', 'sapphire', 'amber', 'opal', 'pearl', // VIVA gemstones
]);

const titleCase = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

export function parseCabinGrade(cabinType: string): { name: string; deck: string | null } {
  const raw = (cabinType || '').trim();
  if (!raw) return { name: '', deck: null };

  let deck: string | null = null;
  let rest = raw;

  // 1. "… (Upper Deck, Adjustable Twin Beds)" — deck inside the brackets.
  const bracketed = raw.match(/\(\s*([A-Za-z]+)\s+Deck\s*(?:,\s*)?/i);
  if (bracketed && DECK_WORDS.has(bracketed[1].toLowerCase())) {
    deck = `${titleCase(bracketed[1])} Deck`;
    rest = raw.replace(bracketed[0], '(').replace(/\(\s*\)/, '');
  } else {
    // 2. "Main Deck 2 Adjustable Twin Beds" — deck leads.
    const leading = raw.match(/^([A-Za-z]+)\s+Deck\b/i);
    if (leading && DECK_WORDS.has(leading[1].toLowerCase())) {
      deck = `${titleCase(leading[1])} Deck`;
      rest = raw.slice(leading[0].length);
    } else {
      // 3. "Double Cabin aft Ruby" — deck trails as a gemstone.
      const trailing = raw.match(/\s([A-Za-z]+)$/);
      if (trailing && DECK_WORDS.has(trailing[1].toLowerCase())) {
        deck = titleCase(trailing[1]);
        rest = raw.slice(0, raw.length - trailing[0].length);
      }
    }
  }

  // "Cat A" / "Cat B" is a position on the deck, not a grade the customer buys —
  // CroisiEurope sell them at one price per deck. Drop it, keep "Suite".
  // Pulling the deck out of the brackets leaves them unbalanced, so drop the
  // brackets entirely and let commas carry the structure.
  let name = rest
    .replace(/^Cat\s+[A-Z]\b\s*/i, '')
    .replace(/[()]/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s,-]+|[\s,-]+$/g, '')
    .trim();
  // "Suite 2 Single Beds" -> "Suite, 2 Single Beds"
  name = name.replace(/^(Suite|Junior Suite|Balcony Suite)\s+(?=\d|with\b)/i, '$1, ');

  // "Double Cabin aft" reads better as "Double Cabin, aft".
  name = name.replace(/\s+(aft|forward)$/i, ', $1');
  if (!name) name = deck ? 'Cabin' : raw;
  return { name, deck };
}

/**
 * Every cabin grade on every FUTURE sailing of one cruise, grouped by sailing date.
 * One query; the grouping and deck parsing happen in memory.
 */
export async function getSailingLadders(db: Database, holidaySiteId: number): Promise<SailingLadder[]> {
  const offerId = holidaySiteId - CRUISE_ID_OFFSET;
  if (offerId <= 0) return [];
  const today = new Date().toISOString().slice(0, 10);

  try {
    const rows = await db
      .select({
        date: cruiseSailings.departureDate,
        shipId: cruiseSailings.shipId,
        cabinType: cruiseOfferSailingCabins.cabinType,
        net: cruiseOfferSailingCabins.netCostPp,
        retail: cruiseOfferSailingCabins.retailPricePp,
      })
      .from(cruiseOfferSailingCabins)
      .innerJoin(cruiseSailings, eq(cruiseOfferSailingCabins.sailingId, cruiseSailings.id))
      .where(and(
        eq(cruiseOfferSailingCabins.offerId, offerId),
        gte(cruiseSailings.departureDate, today),
      ));

    const byDate = new Map<string, SailingLadder>();
    for (const r of rows) {
      const net = Number(r.net);
      if (!(net > 0)) continue;
      const date = (r.date || '').slice(0, 10);
      if (!date) continue;

      const { name, deck } = parseCabinGrade(r.cabinType);
      const retailRaw = Number(r.retail);
      const entry: SailingLadder = byDate.get(date)
        ?? { date, shipId: r.shipId ?? null, grades: [], leadPp: Infinity };
      entry.grades.push({
        cabinType: r.cabinType,
        name,
        deck,
        netPp: net,
        retailPp: retailRaw > 0 ? retailRaw : null,
      });
      if (net < entry.leadPp) entry.leadPp = net;
      byDate.set(date, entry);
    }

    const ladders = [...byDate.values()];
    for (const l of ladders) l.grades.sort((a, b) => a.netPp - b.netPp);
    ladders.sort((a, b) => a.date.localeCompare(b.date));
    return ladders;
  } catch (e) {
    console.error('getSailingLadders failed', e);
    return [];
  }
}

/**
 * Deck order, cheapest deck first, derived from the grades themselves rather than
 * a hardcoded list — operators name their decks differently and we carry three.
 */
export function deckOrder(ladders: SailingLadder[]): string[] {
  const cheapest = new Map<string, number>();
  for (const l of ladders) {
    for (const g of l.grades) {
      const key = g.deck ?? 'Other';
      const seen = cheapest.get(key);
      if (seen == null || g.netPp < seen) cheapest.set(key, g.netPp);
    }
  }
  return [...cheapest.entries()].sort((a, b) => a[1] - b[1]).map(([k]) => k);
}

/**
 * The grade catalogue across all sailings, so a sailing that doesn't sell a grade
 * can say so instead of silently dropping a row.
 */
export function gradeCatalogue(ladders: SailingLadder[]): CabinGrade[] {
  const byType = new Map<string, CabinGrade>();
  for (const l of ladders) {
    for (const g of l.grades) {
      const seen = byType.get(g.cabinType);
      if (!seen || g.netPp < seen.netPp) byType.set(g.cabinType, g);
    }
  }
  return [...byType.values()].sort((a, b) => a.netPp - b.netPp);
}

/**
 * What a grade costs on a given sailing from a given airport.
 *
 * The selling price is per date AND per airport (cruise_flight_prices.total_price_pp,
 * or the admin's flat retail overlay where one is set). A grade above the lead-in
 * adds that sailing's own supplement for the grade. Returns null where the grade
 * isn't sold on that sailing.
 */
export function gradePrice(
  ladder: SailingLadder,
  airportPricePp: number,
  cabinType: string,
): number | null {
  const grade = ladder.grades.find(g => g.cabinType === cabinType);
  if (!grade) return null;
  if (grade.retailPp != null) return roundToNine(grade.retailPp);
  return roundToNine(airportPricePp + (grade.netPp - ladder.leadPp));
}
