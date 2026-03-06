// Data transformation layer — maps holiday-export.json to template interfaces
// Replace this import with a DB/API call when ready

interface RawItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface RawAccommodation {
  name: string;
  images: string[];
  description: string;
}

interface RawHoliday {
  id: number;
  title: string;
  slug: string;
  category: string;
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
  additional_charge_foreign_amount: number | null;
  city_tax_enabled: boolean;
  include_airlines: string | null;
}

// ── Exported interfaces ──────────────────────────────────────────────

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
  description: string;
  slug: string;
  galleryCount: number;
  tags: string[];
  isSpecialOffer: boolean;
  isUnlisted: boolean;
  displayOrder: number;
}

export interface HolidayDetail extends Holiday {
  heroImage: string;
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
}

// ── Helpers ──────────────────────────────────────────────────────────

const IMAGE_BASE_URL = 'https://holidays.flightsandpackages.com';

function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return IMAGE_BASE_URL + path;
}

function slugify(text: string): string {
  return text.trim().replace(/\s+/g, '-');
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

function normaliseCountryName(category: string): string {
  const fixes: Record<string, string> = {
    'Sri lanka': 'Sri Lanka',
    'Netherlands, Hungary, Germany ': 'Netherlands, Hungary, Germany',
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

  // If no explicit bullet markers found, treat each line as a bullet
  if (bullets.length === 0 && paragraphs.length > 1) {
    return { text: '', bullets: paragraphs };
  }

  return { text: paragraphs.join('\n\n'), bullets };
}

function extractStars(hotelOverride: string | null): number | null {
  if (!hotelOverride) return null;
  const match = hotelOverride.trim().match(/(\d)(?:\s*-\s*(\d))?\s*[- ]?Star/i);
  if (!match) return null;
  // For ranges like "4-5 Star", use the higher number
  return match[2] ? parseInt(match[2], 10) : parseInt(match[1], 10);
}

// ── Transform ────────────────────────────────────────────────────────

function transformHoliday(raw: RawHoliday): HolidayDetail {
  const country = normaliseCountryName(raw.category);
  const countrySlug = slugify(country);
  const { text: otherInfoText, bullets: otherInfoBullets } = parseOtherInfo(raw.other_info);
  const stars = extractStars(raw.hotel_override);
  const heroImage = resolveImageUrl(raw.featured_image);

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
    description,
    slug: raw.slug,
    galleryCount: raw.gallery?.length || 0,
    tags: raw.tags || [],
    isSpecialOffer: raw.is_special_offer || false,
    isUnlisted: raw.is_unlisted || false,
    displayOrder: raw.display_order || 0,

    heroImage,
    sidebarImage: raw.accommodations?.[0]?.images?.[0]
      ? resolveImageUrl(raw.accommodations[0].images[0])
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
      stars,
    })),
    galleryImages: (raw.gallery || []).map(resolveImageUrl),
    review: raw.review || '',
    otherInfo: otherInfoText,
    otherInfoBullets,
    hotelClass: normaliseHotelClass(raw.hotel_override),
    sourceUrl: raw.source_url || '',
  };
}

// ── Cruise data ──────────────────────────────────────────────────────

interface RawCruiseItinerary {
  day: number;
  port: string;
  country: string;
  description: string;
}

interface RawCruiseShip {
  name: string;
  description: string;
  cover_image: string;
  class: string;
  cabin_images: string[];
  facts: {
    capacity: number | null;
    cabins: number | null;
    decks: number | null;
    built: string | null;
    refurbished: string | null;
  };
}

interface RawCruise {
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
  ship: RawCruiseShip | null;
  departure_port: string;
  disembark_port: string;
  board_basis: string;
}

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

function transformCruise(raw: RawCruise): HolidayDetail {
  const nights = raw.duration_nights;
  const days = nights + 1;
  const heroImage = raw.featured_image;

  let description = raw.description || '';
  if (description.length > 400) {
    description = description.substring(0, 400).replace(/\s+\S*$/, '') + '...';
  }

  // Build accommodation from ship data
  const accommodations: { name: string; description: string; images: string[]; stars: number | null }[] = [];
  if (raw.ship) {
    const shipImages = [
      raw.ship.cover_image,
      ...raw.ship.cabin_images,
    ].filter(Boolean);

    accommodations.push({
      name: raw.ship.name,
      description: buildShipDescription(raw.ship),
      images: shipImages,
      stars: parseShipStars(raw.ship.class),
    });
  }

  return {
    id: raw.id,
    image: heroImage,
    title: raw.title,
    destination: raw.destination,
    country: raw.country,
    countrySlug: slugify(raw.country),
    duration: `${days} Days / ${String(nights).padStart(2, '0')} Nights`,
    boardBasis: raw.board_basis,
    price: raw.price,
    description,
    slug: raw.slug,
    galleryCount: raw.gallery?.length || 0,
    tags: ['River Cruise'],
    isSpecialOffer: false,
    isUnlisted: false,
    displayOrder: 999,

    heroImage,
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
  };
}

// ── Import and export ────────────────────────────────────────────────

import rawHolidays from './holiday-export.json';
import rawCruises from './cruise-export.json';

const allHolidays: HolidayDetail[] = [
  ...(rawHolidays as RawHoliday[]).map(transformHoliday),
  ...(rawCruises as RawCruise[]).map(transformCruise),
];

/** Published, non-unlisted holidays sorted by display order. Use for search + country listings. */
export const listedHolidays: HolidayDetail[] = allHolidays
  .filter(h => !h.isUnlisted)
  .sort((a, b) => a.displayOrder - b.displayOrder);

/** All holidays including unlisted. Use for detail page generation. */
export const allPublishedHolidays: HolidayDetail[] = allHolidays;

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
  min: Math.min(...listedHolidays.map(h => h.price)),
  max: Math.max(...listedHolidays.map(h => h.price)),
};

/** Unique board basis values for filter sidebar. */
export const boardBasisOptions: string[] = [
  ...new Set(listedHolidays.map(h => h.boardBasis).filter(Boolean)),
].sort();
