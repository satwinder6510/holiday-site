/**
 * Shared helpers for the river-cruise offer card (landing page + listing).
 * Pure functions only; data lookups stay in the pages.
 */
import type { HolidayDetail } from './holiday-transforms';
import type { DepartureWindow } from './holidays-db';
import { roundToNine } from './pricing-transforms';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const fromPrice = (h: HolidayDetail) => h.displayPrice ?? roundToNine(h.price + h.localChargesPp);

/** Saving only when the admin-entered brochure price beats ours by a real amount. */
export const savingOf = (h: HolidayDetail) =>
  h.wasPrice && h.wasPrice - fromPrice(h) >= 20 ? Math.round(h.wasPrice - fromPrice(h)) : 0;

export const nightsOf = (h: HolidayDetail) => {
  const m = h.duration.match(/(\d+)\s*Nights/i);
  return m ? parseInt(m[1], 10) : 0;
};

export const monthLabel = (ym: string) => `${MONTHS[parseInt(ym.slice(5, 7), 10) - 1]} ${ym.slice(0, 4)}`;

export const dateLabel = (iso: string) => {
  const d = new Date(iso.slice(0, 10) + 'T00:00:00Z');
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

export function sailsLabel(w: DepartureWindow | undefined): string {
  if (!w) return '';
  const a = w.first.slice(0, 7), b = w.last.slice(0, 7);
  if (a === b) return `Sails ${monthLabel(a)}`;
  if (a.slice(0, 4) === b.slice(0, 4)) return `Sails ${MONTHS[parseInt(a.slice(5, 7), 10) - 1]} to ${monthLabel(b)}`;
  return `Sails ${monthLabel(a)} to ${monthLabel(b)}`;
}

/** Manual packages list the ship under accommodations next to a pre-cruise hotel; keep the non-hotel. */
export function shipFromAccommodations(names: string[]): string {
  const ships = names.filter(n => n && !/\b(hotel|inn|palace|palazzo|plaza|palais|resort|apartments?)\b/i.test(n));
  return (ships[ships.length - 1] || '').trim();
}

/**
 * What else is in the price. Supplier lists are free text ("Alcohol and Soft
 * Drinks during Bar hours", "1 Nights stay at PLAZA INN Amedia Wien"), so read
 * them for the facts a buyer compares on, in a fixed order, at most four.
 */
export function inclusionChips(included: string[], boardBasis: string): string[] {
  const lines = included.map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const text = lines.join(' | ').toLowerCase();
  const board = (boardBasis || '').toLowerCase();
  const chips: string[] = [];
  if (/flight/.test(text)) chips.push('Return flights');
  if (/all[- ]inclusive/.test(board) || /all[- ]inclusive/.test(text)) chips.push('All inclusive on board');
  else if (/full[- ]board/.test(board) || /full[- ]board/.test(text)) chips.push('Full board on board');
  const WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4 };
  const hotel = lines.find(l => /\b(\d+|one|two|three|four)\s*nights?\b.*\b(hotel|stay|inn|hôtel)\b/i.test(l) && !/cruise/i.test(l));
  if (hotel) {
    const n = hotel.match(/\b(\d+|one|two|three|four)\s*nights?/i);
    const count = n ? (WORDS[n[1].toLowerCase()] ?? Number(n[1])) : 1;
    // One or two capitalised words after "in" or a comma; a trailing "Hotel" is dropped.
    const cityFrom = (l: string) =>
      l.match(/(?:\b(?:in|In|IN)\b|,)\s*([A-Z][\wÀ-ſ'-]+(?:\s+[A-Z][\wÀ-ſ'-]+)?)/)?.[1]?.replace(/\s+Hotel$/i, '').trim();
    const city = cityFrom(hotel) || lines.map(cityFrom).find(Boolean) || '';
    chips.push(`${count} hotel night${count > 1 ? 's' : ''}${city ? ' in ' + city : ''}`);
  }
  if (!chips.some(c => c.startsWith('All inclusive')) && /drink|open bar|\bbar\b/.test(text)) chips.push('Drinks with meals');
  if (/excursion/.test(text)) chips.push('Excursions');
  if (/transfer/.test(text)) chips.push('Transfers');
  if (/\btips?\b|gratuit/.test(text)) chips.push('Tips');
  if (/wi-?fi|wlan/.test(text)) chips.push('Wifi');
  if (/luggage|baggage/.test(text)) chips.push('Hold luggage');
  return chips.slice(0, 4);
}
