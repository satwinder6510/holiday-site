// SSR query functions — fetch holidays + pricing from D1
import { eq, and, inArray, gte, sql } from 'drizzle-orm';
import type { Database } from './db';
import { flightPackages, packagePricing, cruiseFlightPrices, cruiseOffers as cruiseOffersTable, cruiseSailings, cruiseOfferSailingCabins, hotelLibrary } from './db-schema';
import {
  type RawHoliday,
  type RawCruise,
  type HolidayDetail,
  transformHoliday,
  transformCruise,
  slugify,
  normaliseCountryName,
  normaliseHotelName,
  setCityTaxRates,
} from './holiday-transforms';
import { loadCityTaxesLive } from './city-taxes-live';
import {
  type RawHolidayPricing,
  type RawDeparture,
  type HolidayPricing,
  transformHolidayPricing,
  roundToNine,
} from './pricing-transforms';
import rawCruises from '../data/cruise-export.json';

// ── DB row → RawHoliday adapter ─────────────────────────────────────

type DbRow = typeof flightPackages.$inferSelect;

function dbRowToRawHoliday(row: DbRow): RawHoliday {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    operator_name: row.operatorName ?? null,
    price: row.price,
    currency: row.currency,
    price_label: row.priceLabel,
    description: row.description,
    excerpt: row.excerpt,
    whats_included: (row.whatsIncluded ?? []) as string[],
    highlights: (row.highlights ?? []) as string[],
    itinerary: (row.itinerary ?? []) as RawHoliday['itinerary'],
    accommodations: (row.accommodations ?? []) as RawHoliday['accommodations'],
    other_info: row.otherInfo,
    featured_image: row.featuredImage ?? '',
    gallery: (row.gallery ?? []) as string[],
    duration: row.duration ?? '',
    meta_title: row.metaTitle ?? '',
    meta_description: row.metaDescription ?? '',
    is_published: row.isPublished,
    display_order: row.displayOrder,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
    source_url: row.sourceUrl,
    tags: (row.tags ?? []) as string[],
    videos: (row.videos ?? []) as string[],
    single_price: row.singlePrice,
    pricing_display: row.pricingDisplay,
    excluded: row.excluded ?? null,
    requirements: row.requirements ?? null,
    attention: row.attention ?? null,
    is_special_offer: row.isSpecialOffer,
    countries: (row.countries ?? []) as string[],
    pricing_module: row.pricingModule,
    flight_api_source: row.flightApiSource,
    review: row.review,
    auto_refresh_enabled: row.autoRefreshEnabled,
    last_flight_refresh_at: row.lastFlightRefreshAt,
    flight_refresh_config: row.flightRefreshConfig,
    is_unlisted: row.isUnlisted,
    mobile_hero_video: row.mobileHeroVideo ?? '',
    enabled_hotel_categories: (row.enabledHotelCategories ?? []) as string[],
    desktop_hero_video: row.desktopHeroVideo ?? '',
    custom_exclusions: (row.customExclusions ?? []) as string[],
    board_basis_override: row.boardBasisOverride ?? '',
    hotel_override: row.hotelOverride ?? '',
    city_tax_config: (row.cityTaxConfig ?? []) as unknown[],
    additional_charge_name: row.additionalChargeName ?? '',
    additional_charge_exchange_rate: row.additionalChargeExchangeRate ?? '0',
    additional_charge_currency: row.additionalChargeCurrency ?? '',
    additional_charge_foreign_amount: row.additionalChargeForeignAmount,
    city_tax_enabled: row.cityTaxEnabled,
    include_airlines: row.includeAirlines,
    display_price: row.displayPrice ?? null,
    cities: (row.cities ?? []) as string[],
  };
}

// ── Pricing helpers ─────────────────────────────────────────────────

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function getPricingForIds(db: Database, ids: number[]): Promise<Map<number, HolidayPricing>> {
  if (ids.length === 0) return new Map();

  const today = new Date().toISOString().slice(0, 10);

  // D1 has ~100 parameter limit — chunk large ID lists
  const chunks = chunkArray(ids, 80);
  const rows: (typeof packagePricing.$inferSelect)[] = [];
  for (const chunk of chunks) {
    const chunkRows = await db
      .select()
      .from(packagePricing)
      .where(and(
        inArray(packagePricing.packageId, chunk),
        gte(packagePricing.departureDate, today)
      ));
    rows.push(...chunkRows);
  }

  // Group by package_id
  const grouped = new Map<number, RawHolidayPricing>();
  for (const row of rows) {
    if (!grouped.has(row.packageId)) {
      grouped.set(row.packageId, { holiday_id: row.packageId, departures: [] });
    }
    grouped.get(row.packageId)!.departures.push({
      date: row.departureDate,
      airport_code: row.departureAirport,
      airport_name: row.departureAirportName,
      price_pp: row.price,
      availability: row.isAvailable ? 'available' : 'sold_out',
    });
  }

  const result = new Map<number, HolidayPricing>();
  for (const [id, raw] of grouped) {
    if (raw.departures.length > 0) {
      const pricing = transformHolidayPricing(raw);
      if (pricing) result.set(id, pricing);
    }
  }
  return result;
}

function applyPricing(holidays: HolidayDetail[], pricingMap: Map<number, HolidayPricing>): void {
  for (const h of holidays) {
    const pricing = pricingMap.get(h.id);
    if (pricing) {
      h.price = pricing.cheapestPrice;
    }
  }
}

// ── Cruise data (static) ────────────────────────────────────────────

const cruiseHolidays: HolidayDetail[] = (rawCruises as RawCruise[]).map(transformCruise);

// Build cruise pricing lookup from enriched sailing departures (for listing pages)
const cruisePricingMap = new Map<number, HolidayPricing>();
for (const raw of rawCruises as RawCruise[]) {
  if (!raw.sailings) continue;
  const departures: RawDeparture[] = [];
  for (const sailing of raw.sailings) {
    if (sailing.departures) {
      for (const dep of sailing.departures) {
        departures.push({
          date: sailing.date,
          airport_code: dep.airport_code,
          airport_name: dep.airport_name,
          price_pp: dep.price_pp,
          availability: 'available',
        });
      }
    }
  }
  if (departures.length > 0) {
    const pricing = transformHolidayPricing({ holiday_id: raw.id, departures });
    if (pricing) {
      cruisePricingMap.set(raw.id, pricing);
      // Update the shared cruise holiday price to cheapest fly-cruise price
      const cruise = cruiseHolidays.find(c => c.id === raw.id);
      if (cruise) cruise.price = pricing.cheapestPrice;
    }
  }
}

// ── DB-backed cruise pricing ────────────────────────────────────────

// Cruise IDs in cruise-export.json are offset by 10000 to avoid collision with flight_packages IDs
const CRUISE_ID_OFFSET = 10000;

/** Query cruise_flight_prices for a specific offer, return HolidayPricing or null. */
async function getCruisePricingFromDb(db: Database, offerId: number): Promise<HolidayPricing | null> {
  // offerId here is the holiday-site ID (offset by 10000), convert to DB offer ID
  const dbOfferId = offerId - CRUISE_ID_OFFSET;
  if (dbOfferId <= 0) return null;

  const today = new Date().toISOString().slice(0, 10);

  // ── Live flight pricing (per date × airport, from the weekly cron) ──
  const rows = await db
    .select({
      departureDate: cruiseFlightPrices.departureDate,
      airportCode: cruiseFlightPrices.airportCode,
      airportName: cruiseFlightPrices.airportName,
      totalPricePp: cruiseFlightPrices.totalPricePp,
      shipId: cruiseSailings.shipId,
    })
    .from(cruiseFlightPrices)
    .innerJoin(cruiseSailings, eq(cruiseFlightPrices.sailingId, cruiseSailings.id))
    .where(and(
      eq(cruiseFlightPrices.offerId, dbOfferId),
      gte(cruiseFlightPrices.departureDate, today),
    ));

  // shipId → name from the cruise export entry (already in memory).
  const raw = (rawCruises as unknown as RawCruise[]).find(c => c.id === offerId);
  const shipNameById = new Map<number, string>();
  for (const s of raw?.ships ?? []) { if (s.shipId != null) shipNameById.set(s.shipId, s.name); }

  // A route can have two ships on the same date+airport — keep the cheapest, and
  // remember which ship it is (so the calendar shows the right ship per date).
  const cheapestByKey = new Map<string, { date: string; airportCode: string; airportName: string; price: number; shipId: number | null }>();
  const airportNames = new Map<string, string>();
  for (const r of rows) {
    const price = Number(r.totalPricePp);
    if (!(price > 0)) continue;
    airportNames.set(r.airportCode, r.airportName);
    const key = `${r.departureDate}|${r.airportCode}`;
    const ex = cheapestByKey.get(key);
    if (!ex || price < ex.price) {
      cheapestByKey.set(key, { date: r.departureDate, airportCode: r.airportCode, airportName: r.airportName, price, shipId: r.shipId ?? null });
    }
  }

  // ── Offers-panel retail overlay (the admin's manual selling price) ──
  // Where a sailing has a retail price set in the offer's cabin grid, show THAT
  // per sailing date, flat across every airport, overriding the live flight price.
  // Sailings with no retail keep the live pricing — "show the special offer where
  // it exists, not every date". Retail is the all-in fly-cruise selling price.
  const retailRows = await db
    .select({
      date: cruiseSailings.departureDate,
      shipId: cruiseSailings.shipId,
      retail: cruiseOfferSailingCabins.retailPricePp,
    })
    .from(cruiseOfferSailingCabins)
    .innerJoin(cruiseSailings, eq(cruiseOfferSailingCabins.sailingId, cruiseSailings.id))
    .where(and(
      eq(cruiseOfferSailingCabins.offerId, dbOfferId),
      gte(cruiseSailings.departureDate, today),
    ));

  const retailByDate = new Map<string, { price: number; shipId: number | null }>();
  for (const r of retailRows) {
    const price = Number(r.retail);
    if (!(price > 0)) continue; // null / '' / 0 → no retail set for this row
    // cruise_sailings.departure_date is a full ISO timestamp; flight prices are
    // date-only — normalise to YYYY-MM-DD so the overlay keys line up.
    const date = (r.date || '').slice(0, 10);
    if (!date) continue;
    const ex = retailByDate.get(date);
    if (!ex || price < ex.price) retailByDate.set(date, { price, shipId: r.shipId ?? null });
  }

  if (retailByDate.size > 0) {
    // Airports to show the flat retail under: reuse the live-priced airports so the
    // dropdown is consistent; fall back to Heathrow if this offer has no live prices.
    const airportList = airportNames.size > 0
      ? [...airportNames.entries()].map(([code, name]) => ({ code, name }))
      : [{ code: 'LHR', name: 'London Heathrow' }];
    for (const [date, info] of retailByDate) {
      for (const k of [...cheapestByKey.keys()]) {
        if (k.startsWith(`${date}|`)) cheapestByKey.delete(k); // drop live prices for this date
      }
      for (const ap of airportList) {
        cheapestByKey.set(`${date}|${ap.code}`, {
          date, airportCode: ap.code, airportName: ap.name, price: info.price, shipId: info.shipId,
        });
      }
    }
  }

  if (cheapestByKey.size === 0) return null;

  const departures: RawDeparture[] = [...cheapestByKey.values()].map(d => ({
    date: d.date,
    airport_code: d.airportCode,
    airport_name: d.airportName,
    price_pp: d.price,
    availability: 'available' as const,
    ship_id: d.shipId ?? undefined,
    ship_name: d.shipId != null ? shipNameById.get(d.shipId) : undefined,
  }));

  return transformHolidayPricing({ holiday_id: offerId, departures });
}

// ── Query functions ─────────────────────────────────────────────────

/** Get a single holiday by slug, with full pricing data. */
/**
 * LIVE per-hotel stars: override each accommodation's stars with the CURRENT
 * hotel_library rating (matched by normalised name), so a rating edited in
 * the admin library reflects on every offer on the next page load — no
 * backfill, no deploy. The JSON `stars` copy remains the fallback for hotels
 * not in the library. Failure-safe: any DB error leaves the fallback intact.
 */
async function applyLibraryStars(db: Database, holiday: HolidayDetail): Promise<void> {
  if (!holiday.accommodations?.length) return;
  try {
    const rated = await db
      .select({ name: hotelLibrary.name, starRating: hotelLibrary.starRating })
      .from(hotelLibrary)
      .where(sql`${hotelLibrary.starRating} IS NOT NULL`);
    if (!rated.length) return;
    const byName = new Map(rated.map(h => [normaliseHotelName(h.name), h.starRating]));
    for (const acc of holiday.accommodations) {
      const lib = byName.get(normaliseHotelName(acc.name));
      if (lib != null) acc.stars = lib;
    }
  } catch {
    // library lookup is an enhancement — the JSON fallback already rendered
  }
}

export async function getHolidayBySlugFromDb(
  db: Database,
  slug: string
): Promise<{ holiday: HolidayDetail; pricing: HolidayPricing | null } | null> {
  // Check cruises first
  const cruise = cruiseHolidays.find(c => c.slug === slug);
  if (cruise) {
    // Try DB pricing first, fall back to static cruisePricingMap
    const dbPricing = await getCruisePricingFromDb(db, cruise.id);
    const pricing = dbPricing ?? cruisePricingMap.get(cruise.id) ?? null;
    if (pricing) {
      cruise.price = pricing.cheapestPrice;
    }
    return { holiday: cruise, pricing };
  }

  const rows = await db
    .select()
    .from(flightPackages)
    .where(and(eq(flightPackages.slug, slug), eq(flightPackages.isPublished, true)))
    .limit(1);

  if (rows.length === 0) return null;

  setCityTaxRates(await loadCityTaxesLive(db));
  const holiday = transformHoliday(dbRowToRawHoliday(rows[0]));
  await applyLibraryStars(db, holiday);
  const pricingMap = await getPricingForIds(db, [holiday.id]);
  const pricing = pricingMap.get(holiday.id) ?? null;
  if (pricing) {
    holiday.price = pricing.cheapestPrice;
  }

  return { holiday, pricing };
}

/** Get all published, non-unlisted holidays + cruises, with cheapest prices. */
export async function getAllListedHolidaysFromDb(db: Database): Promise<HolidayDetail[]> {
  const rows = await db
    .select()
    .from(flightPackages)
    .where(and(eq(flightPackages.isPublished, true), eq(flightPackages.isUnlisted, false)));

  setCityTaxRates(await loadCityTaxesLive(db));
  const holidays = rows.map(row => transformHoliday(dbRowToRawHoliday(row)));
  const ids = holidays.map(h => h.id);
  const pricingMap = await getPricingForIds(db, ids);
  applyPricing(holidays, pricingMap);

  // Merge in cruises
  const all = [...holidays, ...cruiseHolidays];

  // Overlay DB lead prices on cruise holidays (from cruise_offers.cheapest_total_pp)
  const dbCruiseIds = cruiseHolidays.map(c => c.id - CRUISE_ID_OFFSET).filter(id => id > 0);
  if (dbCruiseIds.length > 0) {
    const offerChunks = chunkArray(dbCruiseIds, 80);
    const offerRows: { id: number; cheapestTotalPp: string | null }[] = [];
    for (const chunk of offerChunks) {
      const chunkRows = await db
        .select({ id: cruiseOffersTable.id, cheapestTotalPp: cruiseOffersTable.cheapestTotalPp })
        .from(cruiseOffersTable)
        .where(inArray(cruiseOffersTable.id, chunk));
      offerRows.push(...chunkRows);
    }

    for (const row of offerRows) {
      if (row.cheapestTotalPp) {
        const price = Number(row.cheapestTotalPp);
        if (price > 0) {
          // Map DB offer ID back to holiday-site ID (add offset)
          const cruise = all.find(h => h.id === row.id + CRUISE_ID_OFFSET);
          if (cruise) cruise.price = price;
        }
      }
    }
  }

  all.sort((a, b) => a.displayOrder - b.displayOrder);

  return all;
}

export interface CabinPrice {
  cabinType: string;
  pricePp: number;
}

/**
 * Cheapest all-in fly-cruise price per cabin type, per cruise, over FUTURE sailings.
 * Returns a Map keyed by holiday-site cruise id (DB offer id + CRUISE_ID_OFFSET),
 * each value sorted cheapest-first. Used by the river-cruise listing cabin grid.
 *
 * `net_cost_pp` = discounted cruise + flight + luggage + port fee pp (the same all-in
 * basis as the card "from" price). Never throws — returns whatever it gathered so the
 * page degrades to "no cabin grid" rather than 503ing.
 */
export async function getCabinPricingForOfferIds(
  db: Database,
  holidaySiteIds: number[],
): Promise<Map<number, CabinPrice[]>> {
  const result = new Map<number, CabinPrice[]>();
  const offerIds = holidaySiteIds.map(id => id - CRUISE_ID_OFFSET).filter(id => id > 0);
  if (offerIds.length === 0) return result;
  const today = new Date().toISOString().slice(0, 10);

  try {
    // Cheapest pp per offer × SHIP × cabin type, over future sailings.
    const perShip = new Map<number, Map<number, CabinPrice[]>>(); // offerId -> shipId -> cabins
    for (const chunk of chunkArray(offerIds, 80)) {
      const rows = await db
        .select({
          offerId: cruiseOfferSailingCabins.offerId,
          shipId: cruiseSailings.shipId,
          cabinType: cruiseOfferSailingCabins.cabinType,
          // Prefer the manual retail (offers-panel selling price) where set, else
          // the computed net — so the cabin grid matches the retail-folded headline.
          pp: sql<number>`MIN(CAST(COALESCE(NULLIF(${cruiseOfferSailingCabins.retailPricePp}, ''), ${cruiseOfferSailingCabins.netCostPp}) AS REAL))`,
        })
        .from(cruiseOfferSailingCabins)
        .innerJoin(cruiseSailings, eq(cruiseOfferSailingCabins.sailingId, cruiseSailings.id))
        .where(and(inArray(cruiseOfferSailingCabins.offerId, chunk), gte(cruiseSailings.departureDate, today)))
        .groupBy(cruiseOfferSailingCabins.offerId, cruiseSailings.shipId, cruiseOfferSailingCabins.cabinType);

      for (const r of rows) {
        if (r.pp == null || !(r.pp > 0)) continue;
        const shipKey = r.shipId ?? -1;
        let ships = perShip.get(r.offerId);
        if (!ships) { ships = new Map(); perShip.set(r.offerId, ships); }
        const list = ships.get(shipKey) ?? [];
        list.push({ cabinType: r.cabinType, pricePp: roundToNine(r.pp) });
        ships.set(shipKey, list);
      }
    }
    // A route can run on several ships with different deck layouts/prices. Use ONLY
    // the ship with the cheapest entry price, so the card aligns end-to-end:
    // cheapest date → that ship → that ship's real decks (no cross-ship pooling).
    for (const [offerId, ships] of perShip) {
      let best: CabinPrice[] | null = null;
      let bestMin = Infinity;
      for (const list of ships.values()) {
        const m = Math.min(...list.map(c => c.pricePp));
        if (m < bestMin) { bestMin = m; best = list; }
      }
      if (best) {
        best.sort((a, b) => a.pricePp - b.pricePp);
        result.set(offerId + CRUISE_ID_OFFSET, best);
      }
    }
  } catch (e) {
    console.error('getCabinPricingForOfferIds failed:', e);
  }
  return result;
}

/** Get holidays for a specific country slug. */
export async function getHolidaysByCountryFromDb(
  db: Database,
  countrySlug: string
): Promise<{ countryName: string; holidays: HolidayDetail[] } | null> {
  // Get all listed holidays (DB + cruises)
  const all = await getAllListedHolidaysFromDb(db);
  const matching = all.filter(h => h.countrySlug === countrySlug);

  if (matching.length === 0) return null;

  return {
    countryName: matching[0].country,
    holidays: matching,
  };
}

/** Get unique countries with counts from all listed holidays. */
export async function getHolidayCountriesFromDb(
  db: Database
): Promise<{ name: string; slug: string; count: number }[]> {
  const all = await getAllListedHolidaysFromDb(db);
  const map = new Map<string, number>();
  for (const h of all) {
    map.set(h.country, (map.get(h.country) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Lightweight: get active country names for navigation (DB holidays + cruises). */
export async function getNavCountriesFromDb(
  db: Database
): Promise<{ name: string; slug: string }[]> {
  const rows = await db
    .select({ category: flightPackages.category })
    .from(flightPackages)
    .where(and(eq(flightPackages.isPublished, true), eq(flightPackages.isUnlisted, false)));

  const names = new Set<string>();
  for (const row of rows) {
    names.add(row.category);
  }
  // Also add cruise countries
  for (const c of cruiseHolidays) {
    names.add(c.country);
  }
  return Array.from(names)
    .map(name => ({ name, slug: slugify(name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Compute filter data from a list of holidays. */
export function getFilterData(holidays: HolidayDetail[]) {
  const boardBasisOptions = [
    ...new Set(holidays.map(h => h.boardBasis).filter(Boolean)),
  ].sort();

  const prices = holidays.map(h => h.displayPrice ?? roundToNine(h.price + h.localChargesPp));
  const priceRange = {
    min: prices.length > 0 ? Math.min(...prices) : 0,
    max: prices.length > 0 ? Math.max(...prices) : 0,
  };

  // Collect unique cities across all holidays, with counts
  const cityMap = new Map<string, number>();
  for (const h of holidays) {
    for (const city of h.cities) {
      cityMap.set(city, (cityMap.get(city) || 0) + 1);
    }
  }
  const cityOptions = Array.from(cityMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { boardBasisOptions, priceRange, cityOptions };
}
