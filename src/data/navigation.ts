export const mainMenuItems = [
  { label: 'Cruises', href: 'https://www.flightsandpackages.com/cruise', external: true },
  { label: 'Destinations', href: 'javascript:void(0)', hasDropdown: true },
  { label: 'Collections', href: '/collections', hasDropdown: true },
  { label: 'Offers', href: '/Holidays/SpecialOffer' },
  { label: 'Blogs', href: '/blog' },
];

export const destinationRegions = [
  {
    name: 'Europe',
    href: '/Holidays/Europe',
    double: true,
    countries: [
      { name: 'Italy', href: '/Holidays/Europe/Italy/11' },
      { name: 'Greece', href: '/Holidays/Europe/Greece/37' },
      { name: 'Spain', href: '/Holidays/Europe/Spain/19' },
      { name: 'Portugal', href: '/Holidays/Europe/Portugal/17' },
      { name: 'Malta', href: '/Holidays/Europe/Malta/75' },
      { name: 'Bulgaria', href: '/Holidays/Europe/Bulgaria/78' },
      { name: 'France', href: '/Holidays/Europe/France/18' },
      { name: 'Cyprus', href: '/Holidays/Europe/Cyprus/33' },
      { name: 'Montenegro', href: '/Holidays/Europe/Montenegro/34' },
      { name: 'Finland', href: '/Holidays/Europe/Finland/35' },
      { name: 'Estonia', href: '/Holidays/Europe/Estonia/36' },
      { name: 'Croatia', href: '/Holidays/Europe/Croatia/38' },
      { name: 'Hungary', href: '/Holidays/Europe/Hungary/39' },
      { name: 'Poland', href: '/Holidays/Europe/Poland/40' },
      { name: 'Slovenia', href: '/Holidays/Europe/Slovenia/50' },
      { name: 'Austria', href: '/Holidays/Europe/Austria/52' },
      { name: 'Sweden', href: '/Holidays/Europe/Sweden/54' },
      { name: 'Denmark', href: '/Holidays/Europe/Denmark/55' },
      { name: 'Iceland', href: '/Holidays/Europe/Iceland/73' },
    ],
  },
  {
    name: 'Americas',
    href: '/Holidays/Americas',
    countries: [
      { name: 'Peru', href: '/Holidays/Americas/Peru/1' },
      { name: 'Argentina', href: '/Holidays/Americas/Argentina/2' },
      { name: 'Brazil', href: '/Holidays/Americas/Brazil-/3' },
    ],
  },
  {
    name: 'Africa',
    href: '/Holidays/Africa',
    countries: [
      { name: 'Morocco', href: '/Holidays/Africa/Morocco/9' },
      { name: 'Kenya', href: '/Holidays/Africa/Kenya/60' },
      { name: 'South Africa', href: '/Holidays/Africa/South-Africa/65' },
    ],
  },
  {
    name: 'Asia',
    href: '/Holidays/Asia',
    countries: [
      { name: 'India', href: '/Holidays/Asia/India/24' },
      { name: 'Sri Lanka', href: '/Holidays/Asia/Sri-lanka/25' },
      { name: 'Vietnam', href: '/Holidays/Asia/Vietnam/28' },
      { name: 'Cambodia', href: '/Holidays/Asia/Cambodia/53' },
      { name: 'Thailand', href: '/Holidays/Asia/Thailand/23' },
      { name: 'Indonesia', href: '/Holidays/Asia/Indonesia/26' },
      { name: 'Malaysia', href: '/Holidays/Asia/Malaysia/29' },
      { name: 'Singapore', href: '/Holidays/Asia/Singapore/30' },
      { name: 'Nepal', href: '/Holidays/Asia/Nepal/59' },
    ],
  },
  {
    name: 'Middle East',
    href: '/Holidays/Middle-East',
    countries: [
      { name: 'UAE', href: '/Holidays/Middle-East/UAE/10' },
      { name: 'Egypt', href: '/Holidays/Middle-East/Egypt/71' },
    ],
    subRegions: [
      {
        name: 'Indian Ocean',
        href: '/Holidays/Indian-Ocean',
        countries: [
          { name: 'Maldives', href: '/Holidays/Indian-Ocean/Maldives/22' },
          { name: 'Mauritius', href: '/Holidays/Indian-Ocean/Mauritius/56' },
        ],
      },
    ],
  },
];

export const collectionMenuItems = [
  // Column 1
  { name: '2022 Holidays', href: '/Holidays/2022-Holidays' },
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
  { name: 'Europe Twin Centre', href: '/Holidays/Europe/Europe-Twin-Centre/20' },
  { name: 'Europe Triple Centre', href: '/Holidays/Europe/Europe-Triple-Centre/21' },
  { name: 'South America Twin Centre', href: '/Holidays/Americas/South-America-Twin-Centre/7' },
  { name: 'Asia Twin Centre', href: '/Holidays/Asia/Asia-Twin-Centre/31' },
  { name: 'Asia Triple Centre', href: '/Holidays/Asia/Asia-Triple-Centre/32' },
];

export const mobileMenuItems = [
  { label: 'Destinations', hasSubmenu: true },
  { label: 'Collections', hasSubmenu: true },
  { label: 'Offers', href: '/Holidays/SpecialOffer' },
  { label: 'About', href: '/AboutUs' },
  { label: 'Contact', href: '/Home/Contact_Us' },
];

export const mobileDestinationRegions = [
  'Europe', 'Americas', 'Africa', 'Asia', 'Middle East', 'Indian Ocean'
];
