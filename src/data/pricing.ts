// Date-wise pricing module — transforms pricing-export.json
// Pure transform functions live in ../lib/pricing-transforms.ts (shared with SSR)

import pricingExport from './pricing-export.json';
import {
  type RawHolidayPricing,
  type HolidayPricing,
  type Departure,
  transformHolidayPricing,
} from '../lib/pricing-transforms';

// Re-export types for consumers
export type { PriceTier, Departure, Airport, HolidayPricing } from '../lib/pricing-transforms';

// ── Build lookup ───────────────────────────────────────────────────
const pricingMap = new Map<number, HolidayPricing>();
for (const raw of pricingExport as RawHolidayPricing[]) {
  if (raw.departures.length > 0) {
    pricingMap.set(raw.holiday_id, transformHolidayPricing(raw));
  }
}

// ── Exports ────────────────────────────────────────────────────────
export function getPricingForHoliday(holidayId: number): HolidayPricing | undefined {
  return pricingMap.get(holidayId);
}

export function getDeparturesForAirport(holidayId: number, airportCode: string): Departure[] {
  const pricing = pricingMap.get(holidayId);
  if (!pricing) return [];
  return pricing.departures.filter(d => d.airportCode === airportCode);
}

export function hasHolidayPricing(holidayId: number): boolean {
  return pricingMap.has(holidayId);
}
