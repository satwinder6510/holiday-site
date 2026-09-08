// Static collection definitions — no holiday data imports
// Used by SSR pages that compute active collections from DB data

export interface Collection {
  name: string;
  image: string;
  href: string;
  tag: string;
}

export const allCollections: Collection[] = [
  { name: 'Golden Triangle', tag: 'Golden Triangle', image: '/images/collections/golden-triangle.jpg', href: '/Holidays/Golden-Triangle' },
  { name: 'River Cruises', tag: 'River Cruise', image: '/images/collections/river-cruise.webp', href: '/Holidays/river-cruises' },
  { name: '2027 Holidays', tag: '2027 Holidays', image: '/images/collections/2027-holidays.jpg', href: '/Holidays/2027-Holidays' },
  { name: 'Italian Lakes', tag: 'Italian Lakes', image: '/images/collections/italian-lakes.jpg', href: '/Holidays/Italian-Lakes' },
  { name: 'New & Exclusive Offers', tag: 'Special Offer', image: '/images/collections/special-offer.webp', href: '/Holidays/New-&-Exclusive-Offers' },
  { name: 'City Breaks', tag: 'City Break', image: '/images/collections/city-breaks.jpg', href: '/Holidays/City-Break' },
  { name: 'All Inclusive', tag: 'All Inclusive', image: '/images/collections/all-inclusive.jpg', href: '/Holidays/All-Inclusive' },
  { name: 'Beach', tag: 'Beach', image: '/images/collections/beach.jpg', href: '/Holidays/Beach' },
  { name: 'European Tours', tag: 'European Tour', image: '/images/collections/european-tours.jpg', href: '/Holidays/European' },
  { name: 'Multi Centre', tag: 'Multi-Centre', image: '/images/collections/multi-centre.webp', href: '/Holidays/Multicentre' },
  { name: 'WorldWide Tours', tag: 'Tour', image: '/images/collections/worldwide-tours.jpg', href: '/Holidays/Tour' },
  { name: 'Twin Centre', tag: 'Twin-Centre', image: '/images/collections/twin-centre.webp', href: '/Holidays/Twin-Centre' },
  { name: 'Luxury', tag: 'Luxury', image: '/images/collections/luxury.jpg', href: '/Holidays/Luxury-Breaks' },
  { name: 'Summer Holidays', tag: 'Summer Holiday', image: '/images/collections/summer-holidays.jpg', href: '/Holidays/Summer-Holiday' },
  { name: 'Family Holidays', tag: 'Family', image: '/images/collections/family-holidays.jpg', href: '/Holidays/Family-Holiday' },
  { name: 'Adults Only', tag: 'Adults Only', image: '/images/collections/adults-only.jpg', href: '/Holidays/Adults-Only' },
  { name: 'Winter City Break', tag: 'Winter City Break', image: '/images/collections/winter-city-break.jpg', href: '/Holidays/Winter-City-Break' },
  { name: 'Winter Sun Holidays', tag: 'Winter Sun', image: '/images/collections/winter-sun-holidays.jpg', href: '/Holidays/Winter-Sun-Holidays' },
  { name: 'Solo Traveller', tag: 'Solo Traveller', image: '/images/collections/solo-traveller.jpg', href: '/Holidays/Solo-Traveller' },
];
