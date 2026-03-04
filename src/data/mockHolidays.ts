export interface MockHoliday {
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
}

export const mockHolidays: MockHoliday[] = [
  {
    id: 1,
    image:
      'https://admin.citiesandbeaches.com/PackageImages/SliderImage/5445/florence.jpg',
    title: 'Four Incredible Nights In Florence And Venice',
    destination: 'Florence & Venice',
    country: 'Italy',
    countrySlug: 'Italy',
    duration: '5 Days / 4 Nights',
    boardBasis: 'Bed & Breakfast',
    price: 199,
    description:
      'Discover the art and architecture of Florence before heading to the enchanting canals of Venice. This twin-centre break includes breakfast and a scenic train transfer between two of Italy\'s most iconic cities.',
    slug: 'Four-Incredible-Nights-In-Florence-And-Venice',
    galleryCount: 6,
  },
  {
    id: 2,
    image:
      'https://admin.citiesandbeaches.com/PackageImages/SliderImage/6563/port-of-sorrento-picture-id1041375720.jpg',
    title: 'An All Inclusive Stay In Sorrento With Flights',
    destination: 'Sorrento',
    country: 'Italy',
    countrySlug: 'Italy',
    duration: '5 Days / 4 Nights',
    boardBasis: 'All Inclusive',
    price: 349,
    description:
      'Enjoy an all inclusive getaway to the stunning Amalfi Coast town of Sorrento with flights and transfers included. Soak up the Mediterranean sunshine, savour Italian cuisine, and explore the charming clifftop streets.',
    slug: 'An-All-Inclusive-Stay-In-Sorrento-With-Flights',
    galleryCount: 8,
  },
  {
    id: 3,
    image:
      'https://admin.citiesandbeaches.com/PackageImages/SliderImage/6695/sharm-el-sheikh-leading.jpeg',
    title: '7 Nights All Inclusive Stay In Hilton Sharks Bay',
    destination: 'Sharm El Sheikh',
    country: 'Egypt',
    countrySlug: 'Egypt',
    duration: '8 Days / 7 Nights',
    boardBasis: 'All Inclusive',
    price: 449,
    description:
      'Relax at the Hilton Sharks Bay Resort in Sharm El Sheikh with seven nights of all inclusive luxury. Enjoy world-class snorkelling on the Red Sea coral reefs and soak up the year-round Egyptian sunshine.',
    slug: '7-Nights-All-Inclusive-Stay-In-Hilton-Sharks-Bay',
    galleryCount: 10,
  },
  {
    id: 4,
    image:
      'https://admin.citiesandbeaches.com/PackageImages/SliderImage/6702/best-beaches-of-cyprus-petra-tou-romiou-famous-as-a-birthplace-of-picture-id1018846666.jpg',
    title: 'A Relaxing 5 Star 7 Night Half Board Stay In Cyprus',
    destination: 'Paphos',
    country: 'Cyprus',
    countrySlug: 'Cyprus',
    duration: '8 Days / 7 Nights',
    boardBasis: 'Half Board',
    price: 299,
    description:
      'Unwind at a luxurious five-star resort in Cyprus with breakfast and dinner included each day. Explore ancient ruins, lounge on golden beaches, and enjoy the warm Cypriot hospitality.',
    slug: 'A-Relaxing-5-Star-7-Night-Half-Board-Stay-In-Cyprus',
    galleryCount: 7,
  },
  {
    id: 5,
    image:
      'https://admin.citiesandbeaches.com/PackageImages/SliderImage/6847/fantastic-malcesine-tourist-resort-and-colorful-sunset-garda-lake-picture-id908964360.jpg',
    title: 'An All Inclusive Stay In Lake Garda With Flights',
    destination: 'Lake Garda',
    country: 'Italy',
    countrySlug: 'Italy',
    duration: '5 Days / 4 Nights',
    boardBasis: 'All Inclusive',
    price: 329,
    description:
      'Escape to the breathtaking shores of Lake Garda with an all inclusive stay and return flights. Explore picturesque lakeside villages, taste local wines, and take in the dramatic mountain scenery.',
    slug: 'An-All-Inclusive-Stay-In-Lake-Garda-With-Flights',
    galleryCount: 9,
  },
  {
    id: 6,
    image:
      'https://admin.citiesandbeaches.com/PackageImages/SliderImage/6946/usmss-beachfront-pool-5089-hor-clsc.jpg',
    title: '5 Star Stay In Koh Samui With Breakfast',
    destination: 'Koh Samui',
    country: 'Thailand',
    countrySlug: 'Thailand',
    duration: '8 Days / 7 Nights',
    boardBasis: 'Bed & Breakfast',
    price: 1099,
    description:
      'Experience tropical paradise at a stunning five-star resort on the island of Koh Samui with a free upgrade to a pool villa. Enjoy pristine beaches, lush jungle, and world-class Thai cuisine.',
    slug: '5-Star-Stay-In-Koh-Samui-With-Breakfast',
    galleryCount: 12,
  },
  {
    id: 7,
    image:
      'https://admin.citiesandbeaches.com/PackageImages/SliderImage/6957/porto.png',
    title: 'Lisbon and Porto Twin Centre Break with Breakfast',
    destination: 'Lisbon & Porto',
    country: 'Portugal',
    countrySlug: 'Portugal',
    duration: '5 Days / 4 Nights',
    boardBasis: 'Bed & Breakfast',
    price: 199,
    description:
      'Explore Portugal\'s two most captivating cities with this twin-centre break including breakfast and a scenic train transfer. Wander through Lisbon\'s cobbled streets and taste Porto\'s famous port wine.',
    slug: 'Lisbon-and-Porto-Twin-Centre-Break-with-Breakfast',
    galleryCount: 8,
  },
  {
    id: 8,
    image:
      'https://admin.citiesandbeaches.com/PackageImages/SliderImage/7975/fabio-fistarol-VGk9Fz_QCRo-unsplash.jpg',
    title: 'Geneva and Lake Maggiore Twin Centre via the Alps',
    destination: 'Geneva & Lake Maggiore',
    country: 'Italy',
    countrySlug: 'Italy',
    duration: '5 Days / 4 Nights',
    boardBasis: 'Bed & Breakfast',
    price: 499,
    description:
      'Journey from cosmopolitan Geneva to the serene shores of Lake Maggiore via a spectacular Alpine train ride. This twin-centre break combines Swiss elegance with Italian lakeside charm.',
    slug: 'Geneva-and-Lake-Maggiore-Twin-Centre-via-the-Alps',
    galleryCount: 7,
  },
];
