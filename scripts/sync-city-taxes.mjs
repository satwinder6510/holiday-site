#!/usr/bin/env node
/**
 * Regenerate src/data/city-taxes.json from the city_taxes table in D1
 * (holiday-flights-db) — the same table the admin quote tool reads.
 * Run automatically by deploy.sh before the build; can be run standalone:
 *   node scripts/sync-city-taxes.mjs
 * Requires wrangler authed on the Flights & Packages Cloudflare account.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// GBP per unit of foreign currency, used for the "≈ £x payable locally"
// estimate on package pages. Update occasionally; precision is not critical.
const GBP_RATES = {
  GBP: 1, EUR: 0.84, USD: 0.79, CHF: 0.87, AED: 0.21,
  MAD: 0.079, CZK: 0.033, ISK: 0.0055, BGN: 0.43, HUF: 0.0021,
};

const SQL =
  'SELECT id, city, country_code, basis, currency, fixed_amount, cap_nights, notes, ' +
  'rate_1_star, rate_2_star, rate_3_star, rate_4_star, rate_5_star ' +
  'FROM city_taxes ORDER BY city';

const out = execFileSync(
  'npx',
  ['wrangler', 'd1', 'execute', 'holiday-flights-db', '--remote', '--json', '--command', SQL],
  { cwd: join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'holiday-admin-api'), encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
);
const rows = JSON.parse(out)[0].results;
if (!Array.isArray(rows) || rows.length < 50) {
  throw new Error(`city_taxes returned ${rows?.length ?? 0} rows — refusing to overwrite JSON`);
}

const entries = rows.map((r) => {
  const fx = GBP_RATES[r.currency];
  if (fx === undefined) throw new Error(`No GBP rate for currency ${r.currency} (${r.city})`);
  const hasStars = [r.rate_1_star, r.rate_2_star, r.rate_3_star, r.rate_4_star, r.rate_5_star]
    .some((v) => v != null);
  const notes = [r.notes, r.basis === 'per_room_per_night' ? 'Charged per room, not per person' : '']
    .filter(Boolean).join('. ');
  return {
    id: r.id,
    cityName: r.city,
    countryCode: r.country_code,
    pricingType: hasStars ? 'star_rating' : 'flat',
    taxPerNightPerPerson: hasStars ? 0 : (r.fixed_amount ?? 0),
    rate1Star: r.rate_1_star,
    rate2Star: r.rate_2_star,
    rate3Star: r.rate_3_star,
    rate4Star: r.rate_4_star,
    rate5Star: r.rate_5_star,
    currency: r.currency,
    exchangeRate: fx,
    capNights: r.cap_nights,
    notes,
  };
});

const target = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'city-taxes.json');
writeFileSync(target, JSON.stringify(entries, null, 2) + '\n');
console.log(`city-taxes.json regenerated from D1: ${entries.length} rules`);
