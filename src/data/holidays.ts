// Data transformation layer — maps holiday-export.json + cruise-export.json to template interfaces
// Pure helper functions live in ../lib/holiday-transforms.ts (shared with SSR)

import {
  type RawHoliday,
  type RawCruise,
  type HolidayDetail,
  transformHoliday,
  transformCruise,
  slugify,
} from '../lib/holiday-transforms';

// Re-export types for consumers
export type { Holiday, HolidayDetail, LocalChargeItem } from '../lib/holiday-transforms';

import rawHolidays from './holiday-export.json';
import rawCruises from './cruise-export.json';
import { getPricingForHoliday } from './pricing';

const allHolidays: HolidayDetail[] = [
  ...(rawHolidays as RawHoliday[]).map(transformHoliday),
  ...(rawCruises as RawCruise[]).map(transformCruise),
];

// Override static base price with cheapest departure price from pricing system
for (const h of allHolidays) {
  const pricing = getPricingForHoliday(h.id);
  if (pricing) {
    h.price = pricing.cheapestPrice;
  }
}

/** Published, non-unlisted holidays sorted by display order. Use for search + country listings. */
export const listedHolidays: HolidayDetail[] = allHolidays
  .filter(h => h.isPublished && !h.isUnlisted)
  .sort((a, b) => a.displayOrder - b.displayOrder);

/** All published holidays including unlisted. Use for detail page generation. */
export const allPublishedHolidays: HolidayDetail[] = allHolidays.filter(h => h.isPublished);

/** Countries that have at least one listed holiday. */
export const holidayCountries: { name: string; slug: string; count: number }[] = (() => {
  const map = new Map<string, number>();
  for (const h of listedHolidays) {
    map.set(h.country, (map.get(h.country) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
})();

/** Get holidays for a specific country. */
export function getHolidaysByCountry(countryName: string): HolidayDetail[] {
  return listedHolidays.filter(h => h.country === countryName);
}

/** Get a single holiday by slug. */
export function getHolidayBySlug(slug: string): HolidayDetail | undefined {
  return allPublishedHolidays.find(h => h.slug === slug);
}

/** Price range across all listed holidays. */
export const priceRange = {
  min: Math.min(...listedHolidays.map(h => h.price + h.localChargesPp)),
  max: Math.max(...listedHolidays.map(h => h.price + h.localChargesPp)),
};

/** Unique board basis values for filter sidebar. */
export const boardBasisOptions: string[] = [
  ...new Set(listedHolidays.map(h => h.boardBasis).filter(Boolean)),
].sort();
