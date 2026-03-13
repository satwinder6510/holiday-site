// Date-wise pricing module — mock data, will be replaced by admin API export
import pricingExport from './pricing-export.json';

// ── Raw JSON shape (matches admin API export) ──────────────────────
interface RawDeparture {
  date: string;
  airport_code: string;
  airport_name: string;
  price_pp: number;
  availability: 'available' | 'sold_out';
}
interface RawHolidayPricing {
  holiday_id: number;
  departures: RawDeparture[];
}

// ── Public interfaces ──────────────────────────────────────────────
export type PriceTier = 'best' | 'mid' | 'peak';

export interface Departure {
  date: string;
  dateFormatted: string;
  dateShort: string;
  dayOfWeek: string;
  airportCode: string;
  airportName: string;
  pricePp: number;
  priceFormatted: string;
  availability: 'available' | 'sold_out';
  tier: PriceTier;
}

export interface Airport {
  code: string;
  name: string;
  cheapestPrice: number;
  cheapestPriceFormatted: string;
}

export interface HolidayPricing {
  holidayId: number;
  departures: Departure[];
  airports: Airport[];
  cheapestDeparture: Departure;
  cheapestPrice: number;
  cheapestPriceFormatted: string;
  months: string[];
}

// ── Helpers ────────────────────────────────────────────────────────
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatPrice(p: number): string {
  return '\u00A3' + Math.round(p).toLocaleString('en-GB');
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateShort(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

function getDayOfWeek(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return DAYS[d.getDay()];
}

function getMonthYear(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

function computeTier(price: number, cheapest: number, mostExpensive: number): PriceTier {
  const range = mostExpensive - cheapest;
  if (range === 0) return 'best';
  if (price <= cheapest * 1.05) return 'best';
  if (price >= cheapest + range * 0.67) return 'peak';
  return 'mid';
}

// ── Transform ──────────────────────────────────────────────────────
function transformHoliday(raw: RawHolidayPricing): HolidayPricing {
  const prices = raw.departures.map(d => d.price_pp);
  const cheapest = Math.min(...prices);
  const mostExpensive = Math.max(...prices);

  const departures: Departure[] = raw.departures
    .map(d => ({
      date: d.date,
      dateFormatted: formatDate(d.date),
      dateShort: formatDateShort(d.date),
      dayOfWeek: getDayOfWeek(d.date),
      airportCode: d.airport_code,
      airportName: d.airport_name,
      pricePp: d.price_pp,
      priceFormatted: formatPrice(d.price_pp),
      availability: d.availability,
      tier: computeTier(d.price_pp, cheapest, mostExpensive),
    }))
    .sort((a, b) => a.pricePp - b.pricePp || a.date.localeCompare(b.date));

  const airportMap = new Map<string, { code: string; name: string; cheapest: number }>();
  for (const dep of departures) {
    const existing = airportMap.get(dep.airportCode);
    if (!existing || dep.pricePp < existing.cheapest) {
      airportMap.set(dep.airportCode, { code: dep.airportCode, name: dep.airportName, cheapest: dep.pricePp });
    }
  }
  const airports: Airport[] = Array.from(airportMap.values())
    .sort((a, b) => a.cheapest - b.cheapest)
    .map(a => ({
      code: a.code,
      name: a.name,
      cheapestPrice: a.cheapest,
      cheapestPriceFormatted: formatPrice(a.cheapest),
    }));

  const monthSet = new Set<string>();
  for (const dep of departures) monthSet.add(getMonthYear(dep.date));

  return {
    holidayId: raw.holiday_id,
    departures,
    airports,
    cheapestDeparture: departures[0],
    cheapestPrice: cheapest,
    cheapestPriceFormatted: formatPrice(cheapest),
    months: Array.from(monthSet),
  };
}

// ── Build lookup ───────────────────────────────────────────────────
const pricingMap = new Map<number, HolidayPricing>();
for (const raw of pricingExport as RawHolidayPricing[]) {
  if (raw.departures.length > 0) {
    pricingMap.set(raw.holiday_id, transformHoliday(raw));
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
