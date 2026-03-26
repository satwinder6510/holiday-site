// SSR query functions — fetch holidays + pricing from Neon Postgres via Hyperdrive
import { eq, and, inArray, gte } from 'drizzle-orm';
import type { Database } from './db';
import { flightPackages, packagePricing } from './db-schema';
import {
  type RawHoliday,
  type RawCruise,
  type HolidayDetail,
  transformHoliday,
  transformCruise,
  slugify,
  normaliseCountryName,
} from './holiday-transforms';
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

async function getPricingForIds(db: Database, ids: number[]): Promise<Map<number, HolidayPricing>> {
  if (ids.length === 0) return new Map();

  const today = new Date().toISOString().slice(0, 10);
  const rows = await db
    .select()
    .from(packagePricing)
    .where(and(
      inArray(packagePricing.packageId, ids),
      gte(packagePricing.departureDate, today)
    ));

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

// ── Query functions ─────────────────────────────────────────────────

/** Get a single holiday by slug, with full pricing data. */
export async function getHolidayBySlugFromDb(
  db: Database,
  slug: string
): Promise<{ holiday: HolidayDetail; pricing: HolidayPricing | null } | null> {
  // Check cruises first (static data with per-airport pricing from cruise-export.json)
  const cruise = cruiseHolidays.find(c => c.slug === slug);
  if (cruise) {
    const pricing = cruisePricingMap.get(cruise.id) ?? null;
    return { holiday: cruise, pricing };
  }

  const rows = await db
    .select()
    .from(flightPackages)
    .where(and(eq(flightPackages.slug, slug), eq(flightPackages.isPublished, true)))
    .limit(1);

  if (rows.length === 0) return null;

  const holiday = transformHoliday(dbRowToRawHoliday(rows[0]));
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

  const holidays = rows.map(row => transformHoliday(dbRowToRawHoliday(row)));
  const ids = holidays.map(h => h.id);
  const pricingMap = await getPricingForIds(db, ids);
  applyPricing(holidays, pricingMap);

  // Merge in cruises
  const all = [...holidays, ...cruiseHolidays];
  all.sort((a, b) => a.displayOrder - b.displayOrder);

  return all;
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

  const prices = holidays.map(h => h.displayPrice ?? Math.round(roundToNine(h.price) + h.localChargesPp));
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
