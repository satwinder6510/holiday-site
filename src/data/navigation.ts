export const mainMenuItems = [
  { label: 'Cruises', href: 'https://www.flightsandpackages.com', external: true },
  { label: 'Destinations', href: 'javascript:void(0)', hasDropdown: true },
  { label: 'Collections', href: '/collections', hasDropdown: true },
  { label: 'Offers', href: '/Holidays/SpecialOffer' },
  { label: 'Blogs', href: '/blog' },
];

export const destinationRegions = [
  {
    name: 'Europe',
    href: '/destinations/Europe',
    double: true,
    countries: [
      { name: 'Italy', href: '/Holidays/italy' },
      { name: 'Greece', href: '/Holidays/greece' },
      { name: 'Spain', href: '/Holidays/spain' },
      { name: 'Portugal', href: '/Holidays/portugal' },
      { name: 'France', href: '/Holidays/france' },
      { name: 'Cyprus', href: '/Holidays/cyprus' },
      { name: 'Croatia', href: '/Holidays/croatia' },
      { name: 'Hungary', href: '/Holidays/hungary' },
      { name: 'Poland', href: '/Holidays/poland' },
      { name: 'Austria', href: '/Holidays/austria' },
      { name: 'Denmark', href: '/Holidays/denmark' },
      { name: 'Czech Republic', href: '/Holidays/czech-republic' },
      { name: 'Germany', href: '/Holidays/germany' },
      { name: 'Latvia', href: '/Holidays/latvia' },
      { name: 'Netherlands', href: '/Holidays/netherlands' },
      { name: 'Romania', href: '/Holidays/romania' },
      { name: 'Slovakia', href: '/Holidays/slovakia' },
      { name: 'Switzerland', href: '/Holidays/switzerland' },
      { name: 'Turkey', href: '/Holidays/turkey' },
    ],
  },
  {
    name: 'Americas',
    href: '/destinations/Americas',
    countries: [
      { name: 'Peru', href: '/Holidays/peru' },
      { name: 'Argentina', href: '/Holidays/argentina' },
      { name: 'Costa Rica', href: '/Holidays/costa-rica' },
      { name: 'USA', href: '/Holidays/usa' },
    ],
  },
  {
    name: 'Africa',
    href: '/destinations/Africa',
    countries: [],
  },
  {
    name: 'Asia',
    href: '/destinations/Asia',
    countries: [
      { name: 'India', href: '/Holidays/india' },
      { name: 'Sri Lanka', href: '/Holidays/sri-lanka' },
      { name: 'Vietnam', href: '/Holidays/vietnam' },
      { name: 'Thailand', href: '/Holidays/thailand' },
      { name: 'Indonesia', href: '/Holidays/indonesia' },
      { name: 'Malaysia', href: '/Holidays/malaysia' },
      { name: 'Nepal', href: '/Holidays/nepal' },
      { name: 'Japan', href: '/Holidays/japan' },
    ],
  },
  {
    name: 'Middle East',
    href: '/destinations/Middle-East',
    countries: [],
    subRegions: [
      {
        name: 'Indian Ocean',
        href: '/destinations/Indian-Ocean',
        countries: [],
      },
    ],
  },
];

export const collectionMenuItems = [
  // Column 1
  { name: '2027 Holidays', href: '/Holidays/2027-Holidays' },
  { name: 'Italian Lakes', href: '/Holidays/Italian-Lakes' },
  { name: 'New & Exclusive Offers', href: '/Holidays/New-&-Exclusive-Offers' },
  { name: 'City Breaks', href: '/Holidays/City-Break' },
  { name: 'All Inclusive', href: '/Holidays/All-Inclusive' },
  { name: 'Beach', href: '/Holidays/Beach' },
  // Column 2
  { name: 'European Tours', href: '/Holidays/European' },
  { name: 'Multi Centre', href: '/Holidays/Multicentre' },
  { name: 'WorldWide Tours', href: '/Holidays/Tour' },
  { name: 'Twin Centre', href: '/Holidays/Twin-Centre' },
  { name: 'Luxury', href: '/Holidays/Luxury-Breaks' },
  { name: 'Summer Holidays', href: '/Holidays/Summer-Holiday' },
  // Column 3
  { name: 'Family Holidays', href: '/Holidays/Family-Holiday' },
  { name: 'Adults Only', href: '/Holidays/Adults-Only' },
  { name: 'Winter City Break', href: '/Holidays/Winter-City-Break' },
  { name: 'Winter Sun Holidays', href: '/Holidays/Winter-Sun-Holidays' },
  { name: 'Weekend Breaks', href: '/Holidays/Weekend-Breaks' },
  { name: 'Honeymoons', href: '/Holidays/Honeymoons' },
  { name: 'Couples Holidays', href: '/Holidays/Couples-Holidays' },
  { name: 'Solo Traveller', href: '/Holidays/Solo-Traveller' },
  { name: 'Greek Island Hopping', href: '/Greek-Island-Hopping' },
  { name: 'Vietnam and Cambodia', href: '/Vietnam-and-cambodia-holidays' },
  { name: 'India Golden Triangle', href: '/Golden-triangle-holidays' },
  // Column 4 (Multi-Centre)
  { name: 'Europe Twin Centre', href: '/Holidays/europe-twin-centre' },
  { name: 'Europe Triple Centre', href: '/Holidays/europe-triple-centre' },
  { name: 'South America Twin Centre', href: '/Holidays/south-america-twin-centre' },
  { name: 'Asia Twin Centre', href: '/Holidays/asia-twin-centre' },
  { name: 'Asia Triple Centre', href: '/Holidays/asia-triple-centre' },
];

export const mobileMenuItems = [
  { label: 'Destinations', hasSubmenu: true },
  { label: 'Collections', hasSubmenu: true },
  { label: 'Offers', href: '/Holidays/SpecialOffer' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const mobileDestinationRegions = [
  'Europe', 'Americas', 'Africa', 'Asia', 'Middle East', 'Indian Ocean'
];
