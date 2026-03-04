export interface HeroSlide {
  image: string;
  title: string;
  duration: string;
  price: string;
  href: string;
  tinted?: boolean;
}

export const heroSlides: HeroSlide[] = [
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/WW2Banner/mark-boss-LdjT89jth2A-unsplash.jpg',
    title: 'Florence & Venice twin-centre',
    duration: '5 Days / 4 Nights',
    price: '£199',
    href: 'https://holidays.flightsandpackages.com/Holidays/Italy/Florence-And-Venice-With-Breakfast-And-Train-Transfer',
  },
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/WW2Banner/larry-ebbs-w11YQeg6LAc-unsplash.png',
    title: 'Santorini & All Inclusive Crete Holiday',
    duration: '8 Days / 7 Nights',
    price: '£499',
    href: 'https://citiesandbeaches.com/Holidays/Greece/Santorini-and-All-Inclusive-Crete-Holiday-with-Transfers',
    tinted: true,
  },
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/WW2Banner/tatiana-kachanovetskaia-F-URY4TcXNI-unsplash.jpg',
    title: 'Sri Lanka Tour w/beach stay',
    duration: '10 days / 9 Nights',
    price: '£1599',
    href: 'https://holidays.flightsandpackages.com/Holidays/Sri-lanka/Sri-Lanka-Heritage-Tea-Trail-Jungles-and-Beaches',
    tinted: true,
  },
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/WW2Banner/felix-kolthoff-oTGyZevCqtY-unsplash.jpg',
    title: 'Lisbon & Porto twin-centre',
    duration: '5 Days / 4 Nights',
    price: '£199',
    href: 'https://holidays.flightsandpackages.com/Holidays/Portugal/Lisbon-and-Porto-Twin-Centre-Break-with-Breakfast',
    tinted: true,
  },
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/WW2Banner/sherif-moharram-XBvfmZVzU_Q-unsplash.jpg',
    title: 'Luxury Nile Cruise & Hurghada stay',
    duration: '15 Days / 14 Nights',
    price: '£699',
    href: 'https://holidays.flightsandpackages.com/Holidays/Egypt/14-Nts-Luxury-Nile-Cruise-With-All-Inclusive-Hurghada',
    tinted: true,
  },
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/WW2Banner/datingscout-Q1VNOsFZsZk-unsplash.jpg',
    title: '5 Star Cyprus Half Board',
    duration: '8 Days / 7 Nights',
    price: '£299',
    href: 'https://holidays.flightsandpackages.com/Holidays/Cyprus/A-Relaxing-5-Star-7-Night-Half-Board-Stay-In-Cyprus',
    tinted: true,
  },
];
