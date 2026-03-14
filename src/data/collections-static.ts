// Static collection definitions — no holiday data imports
// Used by SSR pages that compute active collections from DB data

export interface Collection {
  name: string;
  image: string;
  href: string;
  tag: string;
}

export const allCollections: Collection[] = [
  { name: 'River Cruises', tag: 'River Cruise', image: '/images/collections/river-cruise.jpg', href: '/Holidays/river-cruises' },
  { name: '2027 Holidays', tag: '2027 Holidays', image: 'https://admin.citiesandbeaches.com/images/collections/2022 Holidays_icon.jpg', href: '/Holidays/2027-Holidays' },
  { name: 'Italian Lakes', tag: 'Italian Lakes', image: 'https://admin.citiesandbeaches.com/images/collections/Italian Lakes_icon.jpg', href: '/Holidays/Italian-Lakes' },
  { name: 'New & Exclusive Offers', tag: 'Special Offer', image: '/images/collections/special-offer.jpg', href: '/Holidays/New-&-Exclusive-Offers' },
  { name: 'City Breaks', tag: 'City Break', image: 'https://admin.citiesandbeaches.com/images/collections/City Breaks_icon.jpg', href: '/Holidays/City-Break' },
  { name: 'All Inclusive', tag: 'All Inclusive', image: 'https://admin.citiesandbeaches.com/images/collections/All Inclusive_icon.jpg', href: '/Holidays/All-Inclusive' },
  { name: 'Beach', tag: 'Beach', image: 'https://admin.citiesandbeaches.com/images/collections/Beach_icon.jpg', href: '/Holidays/Beach' },
  { name: 'European Tours', tag: 'European Tour', image: 'https://admin.citiesandbeaches.com/images/collections/European Tours_icon.jpg', href: '/Holidays/European' },
  { name: 'Multi Centre', tag: 'Multi-Centre', image: '/images/collections/multi-centre.jpg', href: '/Holidays/Multicentre' },
  { name: 'WorldWide Tours', tag: 'Tour', image: 'https://admin.citiesandbeaches.com/images/collections/WorldWide Tours_icon.jpg', href: '/Holidays/Tour' },
  { name: 'Twin Centre', tag: 'Twin-Centre', image: '/images/collections/twin-centre.jpg', href: '/Holidays/Twin-Centre' },
  { name: 'Luxury', tag: 'Luxury', image: 'https://admin.citiesandbeaches.com/images/collections/Luxury_icon.jpg', href: '/Holidays/Luxury-Breaks' },
  { name: 'Summer Holidays', tag: 'Summer Holiday', image: 'https://admin.citiesandbeaches.com/images/collections/Summer Holidays_icon.jpg', href: '/Holidays/Summer-Holiday' },
  { name: 'Family Holidays', tag: 'Family', image: 'https://admin.citiesandbeaches.com/images/collections/Family Holidays_icon.jpg', href: '/Holidays/Family-Holiday' },
  { name: 'Adults Only', tag: 'Adults Only', image: 'https://admin.citiesandbeaches.com/images/collections/Adults Only_icon.jpg', href: '/Holidays/Adults-Only' },
  { name: 'Winter City Break', tag: 'Winter City Break', image: 'https://admin.citiesandbeaches.com/images/collections/Winter City Break_icon.jpg', href: '/Holidays/Winter-City-Break' },
  { name: 'Winter Sun Holidays', tag: 'Winter Sun', image: 'https://admin.citiesandbeaches.com/images/collections/Winter Sun Holidays_icon.jpg', href: '/Holidays/Winter-Sun-Holidays' },
  { name: 'Solo Traveller', tag: 'Solo Traveller', image: 'https://admin.citiesandbeaches.com/images/collections/Solo Traveller_icon.jpg', href: '/Holidays/Solo-Traveller' },
];
