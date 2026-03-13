/**
 * Server-side API client for fetching live data from the admin API.
 * Used by SSR pages (homepage) to get fresh data on every request.
 */

const API_BASE = 'https://holiday-admin-api.satwinder-30c.workers.dev/api/public';
const TIMEOUT_MS = 5000;

export interface HeroSlide {
  image: string;
  title: string;
  duration: string;
  price: string;
  href: string;
  tinted: boolean;
}

export interface SpecialOffer {
  image: string;
  badge: string;
  title: string;
  country: string;
  duration: string;
  boardBasis: string;
  price: string;
  href: string;
}

export interface FeaturedTourData {
  title: string;
  description: string;
  price: string;
  href: string;
  images: string[];
}

export interface HomepageData {
  heroSlides: HeroSlide[];
  specialOffers: SpecialOffer[];
  featuredTour: FeaturedTourData | null;
}

export async function fetchHomepageData(): Promise<HomepageData | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}/homepage`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}
