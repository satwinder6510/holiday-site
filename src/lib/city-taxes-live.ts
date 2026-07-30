import type { Database } from './db';
import { cityTaxes } from './db-schema';
import type { CityTaxEntry } from './holiday-transforms';

/**
 * Live city-tax rules from D1 — the same table the admin edits — converted to
 * the shape the calculator uses. Cached per worker isolate for 5 minutes so
 * an admin rate edit reaches package pages within minutes with no deploy.
 * Any failure returns null and the baked deploy-time snapshot stays in force.
 */

// GBP per unit of foreign currency for the "≈ £x payable locally" estimate.
// Keep in step with scripts/sync-city-taxes.mjs (the deploy-time snapshot).
const GBP_RATES: Record<string, number> = {
  GBP: 1, EUR: 0.84, USD: 0.79, CHF: 0.87, AED: 0.21,
  MAD: 0.079, CZK: 0.033, ISK: 0.0055, BGN: 0.43, HUF: 0.0021, JPY: 0.0052,
};

const CACHE_MS = 5 * 60 * 1000;
let cached: CityTaxEntry[] | null = null;
let cachedAt = 0;

export async function loadCityTaxesLive(db: Database): Promise<CityTaxEntry[] | null> {
  if (cached && Date.now() - cachedAt < CACHE_MS) return cached;
  try {
    const rows = await db.select().from(cityTaxes);
    if (rows.length < 10) return null; // half-empty table → trust the snapshot
    const entries: CityTaxEntry[] = [];
    for (const r of rows) {
      const fx = GBP_RATES[r.currency];
      if (fx === undefined) continue; // unknown currency → skip row, keep the rest
      const hasStars = [r.rate1Star, r.rate2Star, r.rate3Star, r.rate4Star, r.rate5Star].some((v) => v != null);
      entries.push({
        id: r.id,
        cityName: r.city,
        countryCode: r.countryCode ?? '',
        pricingType: hasStars ? 'star_rating' : 'flat',
        taxPerNightPerPerson: hasStars ? 0 : (r.fixedAmount ?? 0),
        rate1Star: r.rate1Star,
        rate2Star: r.rate2Star,
        rate3Star: r.rate3Star,
        rate4Star: r.rate4Star,
        rate5Star: r.rate5Star,
        currency: r.currency,
        exchangeRate: fx,
        capNights: r.capNights,
        notes: r.notes ?? '',
      });
    }
    cached = entries;
    cachedAt = Date.now();
    return entries;
  } catch {
    return null; // D1 hiccup — fall back to the baked snapshot
  }
}
