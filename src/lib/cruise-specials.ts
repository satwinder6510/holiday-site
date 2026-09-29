/**
 * Cruise special offers (cruise_offer_specials, built in the admin on an automated
 * cruise offer). A special is live while it is enabled AND today falls between its
 * start and end dates; the check is here, per request, so when the end date passes
 * the cruise goes back to its standard prices and card with nothing to undo.
 *
 * Its prices sit beside the standard ones in cruise_flight_prices.special_price_pp
 * (ticked sailings only); the "from" price is cruise_offers.special_cheapest_pp.
 */
import { and, eq, gte, lte, inArray, isNotNull } from 'drizzle-orm';
import type { Database } from './db';
import { cruiseOfferSpecials, cruiseOffers, cruiseFlightPrices } from './db-schema';
import type { HolidayDetail, RawCruiseHotel } from './holiday-transforms';

export interface ActiveSpecial {
  /** D1 cruise_offers.id (holiday-site id minus 10000). */
  offerId: number;
  endsOn: string;
  discountPercent: number;
  sailingIds: Set<number>;
  inclusions: string[];
  badges: string[];
  /** Admin-entered "was" price; null = the standard price is the "was". */
  wasPricePp: number | null;
  isFeatured: boolean;
  hotels: RawCruiseHotel[];
  /** Hotel + transfer cost per person inside the special price (hotel rates are per room of two). */
  extrasPp: number;
  /** Hold luggage in the special's price. */
  includeLuggage: boolean;
  /** Transfer wording, when the special adds one. */
  transferLabel: string | null;
  /** The page's title and overview (plain text) while live; null = the cruise's own. */
  title: string | null;
  overview: string | null;
  /** Cheapest future special price, and the standard price of that same sailing + airport. */
  cheapestPp: number | null;
  standardAtCheapest: number | null;
  cheapestDate: string | null;
}

const CRUISE_ID_OFFSET = 10000;
const MEMO_MS = 30_000;
let memo: { at: number; value: Map<number, ActiveSpecial> } | null = null;

const today = () => new Date().toISOString().slice(0, 10);

function parseArray<T>(json: string | null): T[] {
  try {
    const v = JSON.parse(json || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

const perPerson = (nights: number, rate: string | null) => {
  const r = Number(rate) || 0;
  return nights > 0 && r > 0 ? (nights * r) / 2 : 0;
};

/** Specials live today, keyed by D1 offer id. Never throws: a failure means no specials. */
export async function getActiveSpecials(db: Database): Promise<Map<number, ActiveSpecial>> {
  if (memo && Date.now() - memo.at < MEMO_MS) return memo.value;
  const out = new Map<number, ActiveSpecial>();
  try {
    const day = today();
    const rows = await db
      .select({
        s: cruiseOfferSpecials,
        cheapest: cruiseOffers.specialCheapestPp,
      })
      .from(cruiseOfferSpecials)
      .innerJoin(cruiseOffers, eq(cruiseOffers.id, cruiseOfferSpecials.offerId))
      .where(and(
        eq(cruiseOfferSpecials.isEnabled, true),
        lte(cruiseOfferSpecials.startsOn, day),
        gte(cruiseOfferSpecials.endsOn, day),
        eq(cruiseOffers.isActive, true),
      ));
    for (const { s, cheapest } of rows) {
      const hotels: RawCruiseHotel[] = [];
      if (s.preHotelNights > 0 && s.preHotelName) {
        hotels.push({ name: s.preHotelName, city: s.preHotelCityName || '', nights: s.preHotelNights, stars: s.preHotelStarRating ?? null, when: 'before' });
      }
      if (s.postHotelNights > 0 && s.postHotelName) {
        hotels.push({ name: s.postHotelName, city: s.postHotelCityName || '', nights: s.postHotelNights, stars: s.postHotelStarRating ?? null, when: 'after' });
      }
      const was = Number(s.wasPricePp);
      const from = Number(cheapest);
      out.set(s.offerId, {
        offerId: s.offerId,
        endsOn: s.endsOn,
        discountPercent: Number(s.discountPercent) || 0,
        sailingIds: new Set(parseArray<number>(s.sailingIds).map(Number)),
        inclusions: parseArray<string>(s.inclusions).map(String).filter(Boolean),
        badges: parseArray<string>(s.badges).map(b => String(b).trim()).filter(Boolean).slice(0, 3),
        wasPricePp: was > 0 ? was : null,
        isFeatured: s.isFeatured,
        hotels,
        extrasPp: perPerson(s.preHotelNights, s.preHotelRatePerNight) + perPerson(s.postHotelNights, s.postHotelRatePerNight)
          + (Number(s.transferCostPp) || 0),
        includeLuggage: s.includeLuggage,
        title: s.title?.trim() || null,
        overview: s.overview?.trim() || null,
        transferLabel: Number(s.transferCostPp) > 0 ? (s.transferLabel || 'Return airport transfers') : null,
        cheapestPp: from > 0 ? from : null,
        standardAtCheapest: null,
        cheapestDate: null,
      });
    }

    // Which sailing + airport the "from" price is, and its standard price (the "was").
    if (out.size > 0) {
      const priced = await db
        .select({
          offerId: cruiseFlightPrices.offerId,
          date: cruiseFlightPrices.departureDate,
          total: cruiseFlightPrices.totalPricePp,
          special: cruiseFlightPrices.specialPricePp,
        })
        .from(cruiseFlightPrices)
        .where(and(
          inArray(cruiseFlightPrices.offerId, [...out.keys()]),
          gte(cruiseFlightPrices.departureDate, day),
          isNotNull(cruiseFlightPrices.specialPricePp),
        ));
      const best = new Map<number, { special: number; total: number; date: string }>();
      for (const r of priced) {
        const special = Number(r.special);
        if (!(special > 0)) continue;
        const b = best.get(r.offerId);
        if (!b || special < b.special) best.set(r.offerId, { special, total: Number(r.total), date: r.date.slice(0, 10) });
      }
      for (const [id, b] of best) {
        const sp = out.get(id)!;
        sp.cheapestPp = b.special;
        sp.standardAtCheapest = b.total > 0 ? b.total : null;
        sp.cheapestDate = b.date;
      }
    }
  } catch (e) {
    console.error('getActiveSpecials failed', e);
  }
  memo = { at: Date.now(), value: out };
  return out;
}

export function specialFor(specials: Map<number, ActiveSpecial>, holidaySiteId: number): ActiveSpecial | undefined {
  return holidaySiteId > CRUISE_ID_OFFSET ? specials.get(holidaySiteId - CRUISE_ID_OFFSET) : undefined;
}

/**
 * The special's hotel nights as inclusion lines. Worded so the card's
 * inclusionChips() reads them ("2 hotel nights in Vienna"): it wants "N nights"
 * and "hotel" in the line, and skips any line that says "cruise".
 */
function hotelLines(sp: ActiveSpecial): string[] {
  return sp.hotels.map(h =>
    `${h.nights} night${h.nights === 1 ? '' : 's'} hotel stay${h.city ? ' in ' + h.city : ''} (${h.name}${h.stars ? ', ' + h.stars + '★' : ''})`);
}

const escapeHtml = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Staff-typed blurb → paragraphs (blank line = new paragraph). */
function overviewHtml(text: string): string {
  return text.split(/\n\s*\n/).map(p => `<p>${escapeHtml(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
}

/**
 * A cruise as its special. While a special is live the page IS the special
 * (owner 2026-09-29): its title and blurb, its price and pills, a "was" (the
 * admin's figure, else the standard price of the same sailing), its inclusions
 * ahead of the operator's, and only its own sailings (holidays-db / cruise-detail
 * filter those). Returns a new object: catalogue entries are shared across requests.
 */
export function withSpecial(h: HolidayDetail, sp: ActiveSpecial | undefined): HolidayDetail {
  if (!sp || !sp.cheapestPp) return h;
  const was = sp.wasPricePp ?? sp.standardAtCheapest;
  // Every sailing on show is the special, so luggage is simply in or out.
  const own = sp.includeLuggage ? h.whatsIncluded : h.whatsIncluded.filter(l => !/luggage|baggage/i.test(l));
  return {
    ...h,
    title: sp.title ?? h.title,
    description: sp.overview ? sp.overview.slice(0, 400) : h.description,
    // The special's blurb goes at the top of the page (specialOverviewHtml); the
    // cruise's own long description stays below as the background reading.
    specialOverviewHtml: sp.overview ? overviewHtml(sp.overview) : undefined,
    price: sp.cheapestPp,
    isSpecialOffer: true,
    wasPrice: was && was > sp.cheapestPp ? was : null,
    offerBadges: sp.badges,
    whatsIncluded: [...sp.inclusions, ...hotelLines(sp), ...(sp.transferLabel ? [sp.transferLabel] : []), ...own],
    specialEndsOn: sp.endsOn,
    specialFeatured: sp.isFeatured,
    specialInclusions: [...sp.inclusions, ...(sp.transferLabel ? [sp.transferLabel] : [])],
    specialHasHotel: sp.hotels.length > 0,
    specialNoLuggage: !sp.includeLuggage,
  };
}
