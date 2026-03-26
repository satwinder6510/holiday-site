import { countries } from './countries';
import { collections } from './collections';

export const mainMenuItems = [
  { label: 'River Cruises', href: '/Holidays/river-cruises' },
  { label: 'Destinations', href: '/destinations', hasDropdown: true },
  { label: 'Collections', href: '/collections', hasDropdown: true },
  { label: 'Offers', href: '/Holidays/New-&-Exclusive-Offers' },
  { label: 'Blogs', href: '/blog' },
];

// Build case-insensitive region lookup from countries.ts
const regionLookup = new Map<string, string>();
for (const c of countries) {
  regionLookup.set(c.name.toLowerCase(), c.region);
}

// Region display order
const regionOrder = ['Europe', 'Americas', 'Africa', 'Asia', 'Middle East'];

export type DestinationRegion = {
  name: string;
  href: string;
  double?: boolean;
  countries: { name: string; href: string }[];
  subRegions?: { name: string; href: string; countries: { name: string; href: string }[] }[];
};

/** Build destination regions from a list of active countries. */
export function buildDestinationRegions(
  activeCountries: { name: string; slug: string }[]
): DestinationRegion[] {
  const buckets = new Map<string, { name: string; href: string }[]>();
  for (const hc of activeCountries) {
    const region = regionLookup.get(hc.name.toLowerCase());
    if (!region) continue;
    const bucket = region === 'Indian Ocean' ? 'Indian Ocean' : region;
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket)!.push({ name: hc.name, href: `/Holidays/${hc.slug}` });
  }
  for (const list of buckets.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return regionOrder
    .map(regionName => {
      const mainCountries = buckets.get(regionName) || [];
      const entry: DestinationRegion = {
        name: regionName,
        href: `/destinations/${regionName.replace(' ', '-')}`,
        countries: mainCountries,
      };
      if (regionName === 'Europe') entry.double = true;
      if (regionName === 'Middle East') {
        const ioCountries = buckets.get('Indian Ocean') || [];
        entry.subRegions = [{
          name: 'Indian Ocean',
          href: '/destinations/Indian-Ocean',
          countries: ioCountries,
        }];
      }
      return entry;
    })
    .filter(r => r.countries.length > 0 || r.subRegions?.some(s => s.countries.length > 0));
}

/** Built from countries.ts — the canonical list of all offered destinations. */
export const destinationRegions = buildDestinationRegions(
  countries.map(c => ({ name: c.name, slug: c.href.replace('/Holidays/', '') }))
);

/** Collection menu items — only collections with published holidays. */
export const collectionMenuItems = collections.map(c => ({ name: c.name, href: c.href }));

export const mobileMenuItems = [
  { label: 'Destinations', hasSubmenu: true },
  { label: 'Collections', hasSubmenu: true },
  { label: 'Offers', href: '/Holidays/New-&-Exclusive-Offers' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
