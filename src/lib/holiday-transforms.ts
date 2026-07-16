// Shared holiday/cruise transform functions — used by both SSG data layer and SSR DB layer
import cityTaxData from '../data/city-taxes.json';

// ── Raw interfaces (match DB / JSON shape) ──────────────────────────

export interface RawItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface RawAccommodation {
  name: string;
  images: string[];
  description: string;
  /** Per-hotel star rating (from hotel library via admin; null/absent = unknown). */
  stars?: number | null;
}

export interface RawHoliday {
  id: number;
  title: string;
  slug: string;
  category: string;
  operator_name?: string | null; // manual cruises (flight_packages) can carry an operator for the filter
  price: number;
  currency: string;
  price_label: string;
  description: string;
  excerpt: string | null;
  whats_included: string[];
  highlights: string[];
  itinerary: RawItineraryDay[];
  accommodations: RawAccommodation[];
  other_info: string | null;
  featured_image: string;
  gallery: string[];
  duration: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  source_url: string | null;
  tags: string[];
  videos: string[];
  single_price: number | null;
  pricing_display: string;
  excluded: string | null;
  requirements: string | null;
  attention: string | null;
  is_special_offer: boolean;
  countries: string[];
  pricing_module: string;
  flight_api_source: string;
  review: string | null;
  auto_refresh_enabled: boolean;
  last_flight_refresh_at: string | null;
  flight_refresh_config: unknown;
  is_unlisted: boolean;
  mobile_hero_video: string;
  enabled_hotel_categories: string[];
  desktop_hero_video: string;
  custom_exclusions: string[];
  board_basis_override: string;
  hotel_override: string;
  city_tax_config: unknown[];
  additional_charge_name: string;
  additional_charge_exchange_rate: string;
  additional_charge_currency: string;
  additional_charge_foreign_amount: number | string | null;
  city_tax_enabled: boolean;
  include_airlines: string | null;
  display_price: number | null;
  cities: string[];
}

export interface RawCruiseItinerary {
  day: number;
  port: string;
  country: string;
  description: string;
}

export interface RawCruiseShip {
  shipId?: number;
  name: string;
  description: string;
  cover_image: string;
  class: string;
  cabin_images: string[];
  firstSailingDate?: string;
  sailingCount?: number;
  facts: {
    capacity: number | null;
    cabins: number | null;
    decks: number | null;
    built: string | null;
    refurbished: string | null;
  };
}

export interface RawCruiseSailing {
  date: string;
  returnDate: string;
  pricePp: number;
  cabinPricePp: number;
  departures?: Array<{
    airport_code: string;
    airport_name: string;
    price_pp: number;
  }>;
}

export interface RawCruise {
  id: number;
  title: string;
  slug: string;
  price: number;
  destination: string;
  country: string;
  duration_nights: number;
  description: string;
  featured_image: string;
  gallery: string[];
  whats_included: string[];
  itinerary: RawCruiseItinerary[];
  operator_name: string;
  ship_name: string;
  ship: RawCruiseShip | null;       // primary (cheapest) ship
  ships?: RawCruiseShip[];          // all ships operating future sailings
  departure_port: string;
  disembark_port: string;
  board_basis: string;
  port_fee_pp?: number;
  sailings?: RawCruiseSailing[];
}

// ── Exported interfaces ─────────────────────────────────────────────

export interface LocalChargeItem {
  label: string;
  foreignAmount: number;
  currency: string;
  exchangeRate: number;
  gbpAmount: number;
}

export interface Holiday {
  id: number;
  image: string;
  title: string;
  destination: string;
  country: string;
  countrySlug: string;
  duration: string;
  boardBasis: string;
  price: number;
  localChargesPp: number;
  description: string;
  slug: string;
  galleryCount: number;
  tags: string[];
  isSpecialOffer: boolean;
  isPublished: boolean;
  isUnlisted: boolean;
  displayOrder: number;
  operator: string;
  displayPrice: number | null;
  cities: string[];
}

export interface HolidayDetail extends Holiday {
  heroImage: string;
  /** Optional hero background video — an HLS (.m3u8) manifest or a self-hosted mp4. Empty = image hero. */
  heroVideo: string;
  /** Optional mobile-specific hero video; falls back to heroVideo when blank. */
  heroVideoMobile: string;
  sidebarImage: string;
  overview: string;
  highlights: string[];
  whatsIncluded: string[];
  itinerary: { day: string; title: string; description: string }[];
  accommodations: { name: string; description: string; images: string[]; stars: number | null }[];
  galleryImages: string[];
  review: string;
  otherInfo: string;
  otherInfoBullets: string[];
  hotelClass: string;
  sourceUrl: string;
  localChargesBreakdown: LocalChargeItem[];
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
  /** Cruise only — embark/disembark ports for the route line (A → B). */
  routeFrom?: string;
  routeTo?: string;
  /** Cruise only — ship cabin image URLs, used as cabin-tile thumbnails (by index). */
  cabinImages?: string[];
  /** Cruise only — cheapest pp per cabin type, attached by the river-cruise listing page. */
  cabins?: { name: string; pricePp: number; thumb?: string }[];
  /** Cruise only — "Operated by MS Vivaldi & MS Douce France on selected dates" (multi-ship routes). */
  operatedByLabel?: string;
}

// ── Helpers ─────────────────────────────────────────────────────────

const IMAGE_BASE_URL = 'https://holidays.flightsandpackages.com';

export function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return IMAGE_BASE_URL + path;
}

export function slugify(text: string): string {
  return text.trim().replace(/\s+/g, '-').toLowerCase();
}

export function slugifyRiver(text: string): string {
  return text.trim().replace(/[,&]+/g, '').replace(/\s+/g, '-').toLowerCase();
}

function normaliseDuration(raw: string): string {
  if (!raw) return '';
  const cleaned = raw.trim();
  const match = cleaned.match(/(\d+)\s*days?\s*[\/]?\s*(\d+)?\s*(nights?)?/i);
  if (!match) return cleaned;
  const days = parseInt(match[1], 10);
  const nights = match[2] ? parseInt(match[2], 10) : null;
  if (nights !== null) {
    return `${days} Days / ${String(nights).padStart(2, '0')} Nights`;
  }
  return `${days} Days`;
}

function normaliseBoardBasis(raw: string | null): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  const mapping: Record<string, string> = {
    'bed and breakfast': 'Bed & Breakfast',
    'bed & breakfast': 'Bed & Breakfast',
    'half board': 'Half Board',
    'all inclusive': 'All Inclusive',
    'light all inclusive': 'Light All Inclusive',
    'room only': 'Room Only',
    'daily brunch': 'Daily Brunch',
    'various': 'Various',
  };
  return mapping[trimmed.toLowerCase()] || trimmed;
}

function normaliseHotelClass(raw: string | null): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return trimmed
    .replace(/-Star/gi, ' Star')
    .replace(/\s+/g, ' ')
    .replace(/(\d)\s+(\d)/g, '$1-$2')
    .trim();
}

export function normaliseCountryName(category: string): string {
  const fixes: Record<string, string> = {
    'Sri lanka': 'Sri Lanka',
    'Netherlands, Hungary, Germany ': 'Netherlands, Hungary, Germany',
    'City-Break': 'Italy',
  };
  const trimmed = category.trim();
  return fixes[trimmed] || trimmed;
}

function parseOtherInfo(raw: string | null): { text: string; bullets: string[] } {
  if (!raw) return { text: '', bullets: [] };

  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const bullets: string[] = [];
  const paragraphs: string[] = [];

  for (const line of lines) {
    if (line.startsWith('\u2981') || line.startsWith('\u2022') || line.startsWith('-')) {
      bullets.push(line.replace(/^[\u2981\u2022\-]\s*/, '').trim());
    } else {
      paragraphs.push(line);
    }
  }

  if (bullets.length === 0 && paragraphs.length > 1) {
    return { text: '', bullets: paragraphs };
  }

  return { text: paragraphs.join('\n\n'), bullets };
}

/** Normalise a hotel name for library matching (keep in sync with
 *  holiday-admin-api/scripts/backfill-accommodation-stars.mjs). */
export function normaliseHotelName(name: string): string {
  return (name || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();
}

export function extractStars(hotelOverride: string | null): number | null {
  if (!hotelOverride) return null;
  const match = hotelOverride.trim().match(/(\d)(?:\s*-\s*(\d))?\s*[- ]?Star/i);
  if (!match) return null;
  return match[2] ? parseInt(match[2], 10) : parseInt(match[1], 10);
}

// ── City tax / local charges ────────────────────────────────────────

interface CityTaxEntry {
  id: number;
  cityName: string;
  countryCode: string;
  pricingType: 'flat' | 'star_rating';
  taxPerNightPerPerson: number;
  rate1Star: number | null;
  rate2Star: number | null;
  rate3Star: number | null;
  rate4Star: number | null;
  rate5Star: number | null;
  currency: string;
  exchangeRate: number;
  notes: string;
}

const cityTaxes: CityTaxEntry[] = cityTaxData as CityTaxEntry[];

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  'Argentina': 'AR', 'Austria': 'AT', 'Belgium': 'BE', 'Bulgaria': 'BG',
  'Cape Verde': 'CV', 'Costa Rica': 'CR', 'Croatia': 'HR', 'Cyprus': 'CY',
  'Czech Republic': 'CZ', 'Denmark': 'DK', 'France': 'FR', 'Germany': 'DE',
  'Greece': 'GR', 'Hungary': 'HU', 'Iceland': 'IS', 'India': 'IN',
  'Indonesia': 'ID', 'Italy': 'IT', 'Japan': 'JP', 'Latvia': 'LV',
  'Malaysia': 'MY', 'Maldives': 'MV', 'Malta': 'MT', 'Mauritius': 'MU',
  'Montenegro': 'ME', 'Morocco': 'MA', 'Nepal': 'NP', 'Peru': 'PE',
  'Poland': 'PL', 'Portugal': 'PT', 'Romania': 'RO', 'Slovakia': 'SK',
  'Spain': 'ES', 'Sri Lanka': 'LK', 'Thailand': 'TH', 'Turkey': 'TR',
  'UAE': 'AE', 'USA': 'US', 'Vietnam': 'VN',
};

function parseNights(duration: string): number {
  const match = duration.match(/(\d+)\s*nights?/i);
  if (match) return parseInt(match[1], 10);
  const dayMatch = duration.match(/(\d+)\s*days?/i);
  if (dayMatch) return Math.max(parseInt(dayMatch[1], 10) - 1, 1);
  return 0;
}

function getRateForStars(entry: CityTaxEntry, stars: number): number {
  if (entry.pricingType === 'flat') return entry.taxPerNightPerPerson;
  const rounded = Math.round(stars);
  if (rounded <= 1) return entry.rate1Star ?? 0;
  if (rounded === 2) return entry.rate2Star ?? 0;
  if (rounded === 3) return entry.rate3Star ?? 0;
  if (rounded === 4) return entry.rate4Star ?? 0;
  return entry.rate5Star ?? 0;
}

const CITY_ALIASES: Record<string, string> = {
  'syracuse': 'siracusa',
};

function findCityTax(cityName: string): CityTaxEntry | undefined {
  const key = cityName.toLowerCase();
  const resolved = CITY_ALIASES[key] ?? key;
  return cityTaxes.find(t => t.cityName.toLowerCase() === resolved);
}

function findHighestRateForCountry(code: string, stars: number): CityTaxEntry | undefined {
  const entries = cityTaxes.filter(t => t.countryCode === code);
  if (entries.length === 0) return undefined;
  let best: CityTaxEntry | undefined;
  let bestRate = -1;
  for (const entry of entries) {
    const rate = getRateForStars(entry, stars);
    if (rate > bestRate) { bestRate = rate; best = entry; }
  }
  return best;
}

interface CityTaxConfigEntry {
  city: string;
  nights: number;
  starRating?: number;
}

export function calculateLocalCharges(raw: RawHoliday): { total: number; items: LocalChargeItem[] } {
  const items: LocalChargeItem[] = [];
  let total = 0;

  // City tax (only when enabled)
  if (raw.city_tax_enabled) {
    const pkgStars = extractStars(raw.hotel_override) ?? 4;
    const config = raw.city_tax_config as CityTaxConfigEntry[];

    if (config && config.length > 0) {
      for (const entry of config) {
        const taxEntry = findCityTax(entry.city);
        if (!taxEntry) continue;
        const stars = entry.starRating ?? pkgStars;
        const ratePerNight = getRateForStars(taxEntry, stars);
        if (ratePerNight === 0) continue;
        const foreignAmt = ratePerNight * entry.nights;
        const gbpAmt = Math.round(foreignAmt * taxEntry.exchangeRate * 100) / 100;
        items.push({
          label: `City Tax \u2014 ${entry.city} (${entry.nights} nights \u00d7 ${taxEntry.currency === 'EUR' ? '\u20ac' : taxEntry.currency + ' '}${ratePerNight.toFixed(2)})`,
          foreignAmount: foreignAmt,
          currency: taxEntry.currency,
          exchangeRate: taxEntry.exchangeRate,
          gbpAmount: gbpAmt,
        });
        total += gbpAmt;
      }
    } else {
      const country = normaliseCountryName(raw.category);
      const firstCountry = country.split(',')[0].trim();
      const code = COUNTRY_NAME_TO_CODE[firstCountry];
      if (code) {
        const taxEntry = findHighestRateForCountry(code, pkgStars);
        if (taxEntry) {
          const ratePerNight = getRateForStars(taxEntry, pkgStars);
          if (ratePerNight > 0) {
            const nights = parseNights(raw.duration);
            if (nights > 0) {
              const foreignAmt = ratePerNight * nights;
              const gbpAmt = Math.round(foreignAmt * taxEntry.exchangeRate * 100) / 100;
              items.push({
                label: `City Tax \u2014 ${taxEntry.cityName} (${nights} nights \u00d7 ${taxEntry.currency === 'EUR' ? '\u20ac' : taxEntry.currency + ' '}${ratePerNight.toFixed(2)})`,
                foreignAmount: foreignAmt,
                currency: taxEntry.currency,
                exchangeRate: taxEntry.exchangeRate,
                gbpAmount: gbpAmt,
              });
              total += gbpAmt;
            }
          }
        }
      }
    }
  }

  // Additional charges (port fees etc) — always processed, independent of city tax
  const addAmt = typeof raw.additional_charge_foreign_amount === 'string'
    ? parseFloat(raw.additional_charge_foreign_amount)
    : raw.additional_charge_foreign_amount;
  const addRate = parseFloat(raw.additional_charge_exchange_rate);
  if (addAmt && addAmt > 0 && addRate > 0) {
    const gbpAmt = Math.round(addAmt * addRate * 100) / 100;
    items.push({
      label: raw.additional_charge_name || 'Additional charge',
      foreignAmount: addAmt,
      currency: raw.additional_charge_currency || 'EUR',
      exchangeRate: addRate,
      gbpAmount: gbpAmt,
    });
    total += gbpAmt;
  }

  return { total: Math.round(total * 100) / 100, items };
}

// ── Transform ───────────────────────────────────────────────────────

export function transformHoliday(raw: RawHoliday): HolidayDetail {
  const country = normaliseCountryName(raw.category);
  const countrySlug = slugify(country);
  const { text: otherInfoText, bullets: otherInfoBullets } = parseOtherInfo(raw.other_info);
  const heroImage = resolveImageUrl(raw.featured_image);
  const localCharges = calculateLocalCharges(raw);

  let description = '';
  if (raw.excerpt && raw.excerpt.trim()) {
    description = raw.excerpt.trim();
  } else if (raw.description) {
    description = raw.description.length > 400
      ? raw.description.substring(0, 400).replace(/\s+\S*$/, '') + '...'
      : raw.description;
  }

  return {
    id: raw.id,
    image: heroImage,
    title: raw.title,
    destination: country,
    country,
    countrySlug,
    duration: normaliseDuration(raw.duration),
    boardBasis: normaliseBoardBasis(raw.board_basis_override),
    price: raw.price,
    localChargesPp: localCharges.total,
    displayPrice: raw.display_price ?? null,
    cities: raw.cities || [],
    description,
    slug: raw.slug,
    galleryCount: raw.gallery?.length || 0,
    tags: raw.tags || [],
    isSpecialOffer: raw.is_special_offer || false,
    isPublished: raw.is_published !== false,
    isUnlisted: raw.is_unlisted || false,
    displayOrder: raw.display_order || 0,
    operator: raw.operator_name || '', // needed for the operator filter (data-operator)

    heroImage,
    heroVideo: raw.desktop_hero_video || '',
    heroVideoMobile: raw.mobile_hero_video || '',
    sidebarImage: raw.gallery?.length > 1
      ? resolveImageUrl(raw.gallery[1])
      : heroImage,
    overview: raw.description || '',
    highlights: raw.highlights || [],
    whatsIncluded: raw.whats_included || [],
    itinerary: (raw.itinerary || []).map(item => ({
      day: `Day ${item.day}`,
      title: item.title,
      description: item.description,
    })),
    accommodations: (raw.accommodations || []).map(acc => ({
      name: acc.name,
      description: acc.description,
      images: (acc.images || []).map(resolveImageUrl),
      // Each hotel's OWN rating only (null = no stars shown). Never paint the
      // package-level hotel_override onto hotel cards — it put 4★ on known
      // 3-star properties (holiday 414, found 2026-07-07).
      stars: acc.stars ?? null,
    })),
    galleryImages: (raw.gallery || []).map(resolveImageUrl),
    review: raw.review || '',
    otherInfo: otherInfoText,
    otherInfoBullets,
    hotelClass: normaliseHotelClass(raw.hotel_override),
    sourceUrl: raw.source_url || '',
    localChargesBreakdown: localCharges.items,
    excluded: raw.excluded || null,
    requirements: raw.requirements || null,
    attention: raw.attention || null,
    metaTitle: raw.meta_title || '',
    metaDescription: raw.meta_description || '',
    updatedAt: raw.updated_at || '',
  };
}

// ── Cruise transform ────────────────────────────────────────────────

function parseShipStars(shipClass: string): number | null {
  if (!shipClass) return null;
  const match = shipClass.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function buildShipDescription(ship: RawCruiseShip): string {
  const parts: string[] = [];
  if (ship.description) parts.push(ship.description);
  const { facts } = ship;
  const details: string[] = [];
  if (facts.capacity) details.push(`${facts.capacity} guests`);
  if (facts.cabins) details.push(`${facts.cabins} cabins`);
  if (facts.decks) details.push(`${facts.decks} decks`);
  if (facts.built) details.push(`built ${facts.built}`);
  if (facts.refurbished) details.push(`refurbished ${facts.refurbished}`);
  if (details.length > 0) {
    parts.push(details.join(' · '));
  }
  return parts.join('\n\n');
}

export function transformCruise(raw: RawCruise): HolidayDetail {
  const nights = raw.duration_nights;
  const days = nights + 1;
  const heroImage = raw.featured_image || raw.ship?.cover_image || '';

  let description = raw.description || '';
  if (description.length > 400) {
    description = description.substring(0, 400).replace(/\s+\S*$/, '') + '...';
  }

  // A route can run on several ships (different decks/cabins). Render a card for
  // each, primary (cheapest) ship first — `raw.ships` is already cheapest-ordered.
  const shipList = (raw.ships && raw.ships.length > 0) ? raw.ships : (raw.ship ? [raw.ship] : []);
  const accommodations = shipList.map((s) => ({
    name: s.name,
    description: buildShipDescription(s),
    images: [s.cover_image, ...(s.cabin_images || [])].filter(Boolean),
    stars: parseShipStars(s.class),
  }));
  const shipNames = shipList.map((s) => s.name).filter(Boolean);
  const operatedByLabel = shipNames.length > 1
    ? `Operated by ${shipNames.length === 2 ? shipNames.join(' & ') : shipNames.slice(0, -1).join(', ') + ' & ' + shipNames[shipNames.length - 1]} on selected dates`
    : '';

  return {
    id: raw.id,
    image: heroImage,
    title: raw.title,
    destination: raw.destination,
    country: raw.country,
    countrySlug: slugify(raw.country),
    duration: `${days} Days / ${String(nights).padStart(2, '0')} Nights`,
    boardBasis: 'All Inclusive',
    price: raw.price,
    // Port fee is already baked into the cruise price (cheapest_total_pp /
    // cruise_flight_prices include it), so local charges must be 0 — otherwise
    // the card's roundToNine(price + localChargesPp) double-counts it.
    localChargesPp: 0,
    displayPrice: null,
    cities: [],
    description,
    slug: raw.slug,
    galleryCount: raw.gallery?.length || 0,
    tags: ['River Cruise'],
    isSpecialOffer: false,
    isPublished: true,
    isUnlisted: false,
    displayOrder: 999,
    operator: raw.operator_name || '',

    heroImage,
    heroVideo: '',
    heroVideoMobile: '',
    sidebarImage: raw.ship?.cover_image || (raw.gallery?.length > 1 ? raw.gallery[1] : heroImage),
    overview: raw.description || '',
    highlights: [],
    whatsIncluded: raw.whats_included || [],
    itinerary: (raw.itinerary || []).map(item => ({
      day: `Day ${item.day}`,
      title: item.port,
      description: item.description,
    })),
    accommodations,
    galleryImages: raw.gallery || [],
    review: '',
    otherInfo: '',
    otherInfoBullets: [],
    hotelClass: raw.ship?.class || '',
    sourceUrl: '',
    localChargesBreakdown: raw.port_fee_pp && raw.port_fee_pp > 0
      ? [{ label: 'Port Fee', foreignAmount: raw.port_fee_pp, currency: 'GBP', exchangeRate: 1, gbpAmount: raw.port_fee_pp }]
      : [],
    metaTitle: '',
    excluded: null,
    requirements: null,
    attention: null,
    metaDescription: '',
    updatedAt: '',
    routeFrom: raw.departure_port || '',
    routeTo: raw.disembark_port || '',
    cabinImages: raw.ship ? [...(raw.ship.cabin_images || []), raw.ship.cover_image].filter(Boolean) : [],
    operatedByLabel,
  };
}
