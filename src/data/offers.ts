import homepageData from './homepage-export.json';
import { allPublishedHolidays } from './holidays';

export interface Offer {
  image: string;
  badge: string;
  title: string;
  country: string;
  duration: string;
  boardBasis: string;
  price: string;
  href: string;
}

const fallbackOffers: Offer[] = [
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/SliderImage/5445/florence.jpg',
    badge: 'Breakfast & Train Transfer',
    title: 'Four Incredible Nights In Florence And Venice',
    country: 'Italy',
    duration: '5 Days / 4 Nights',
    boardBasis: 'Bed & Breakfast',
    price: '£199',
    href: '/Holidays/Italy/Four-Incredible-Nights-In-Florence-And-Venice',
  },
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/SliderImage/6563/port-of-sorrento-picture-id1041375720.jpg',
    badge: 'Free Transfers',
    title: 'An All Inclusive Stay In Sorrento With Flights',
    country: 'Italy',
    duration: '5 Days / 4 Nights',
    boardBasis: 'All Inclusive',
    price: '£349',
    href: '/Holidays/Italy/An-All-Inclusive-Stay-In-Sorrento-With-Flights',
  },
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/SliderImage/6695/sharm-el-sheikh-leading.jpeg',
    badge: 'Free Transfers',
    title: '7 Nights All Inclusive Stay In Hilton Sharks Bay',
    country: 'Egypt',
    duration: '8 Days / 7 Nights',
    boardBasis: 'All Inclusive',
    price: '£449',
    href: '/Holidays/Egypt/7-Nights-All-Inclusive-Stay-In-Hilton-Sharks-Bay',
  },
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/SliderImage/6702/best-beaches-of-cyprus-petra-tou-romiou-famous-as-a-birthplace-of-picture-id1018846666.jpg',
    badge: 'Breakfast & Dinner Included',
    title: 'A Relaxing 5 Star 7 Night Half Board Stay In Cyprus',
    country: 'Cyprus',
    duration: '8 Days / 7 Nights',
    boardBasis: 'Half Board',
    price: '£299',
    href: '/Holidays/Cyprus/A-Relaxing-5-Star-7-Night-Half-Board-Stay-In-Cyprus',
  },
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/SliderImage/6847/fantastic-malcesine-tourist-resort-and-colorful-sunset-garda-lake-picture-id908964360.jpg',
    badge: 'Enjoy All Inclusive Stay',
    title: 'An All Inclusive Stay In Lake Garda With Flights',
    country: 'Italy',
    duration: '5 Days / 4 Nights',
    boardBasis: 'All Inclusive',
    price: '£329',
    href: '/Holidays/Italy/An-All-Inclusive-Stay-In-Lake-Garda-With-Flights',
  },
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/SliderImage/6946/usmss-beachfront-pool-5089-hor-clsc.jpg',
    badge: 'Free Upgrade To Pool Villa With Plunge Pool',
    title: '5 Star Stay In Koh Samui With Breakfast',
    country: 'Thailand',
    duration: '8 Days / 7 Nights',
    boardBasis: 'Bed & Breakfast',
    price: '£1099',
    href: '/Holidays/Thailand/5-Star-Stay-In-Koh-Samui-With-Breakfast',
  },
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/SliderImage/6957/porto.png',
    badge: 'Breakfast & Train Transfer',
    title: 'Lisbon and Porto Twin Centre Break with Breakfast',
    country: 'Portugal',
    duration: '5 Days / 4 Nights',
    boardBasis: 'Bed & Breakfast',
    price: '£199',
    href: '/Holidays/Portugal/Lisbon-and-Porto-Twin-Centre-Break-with-Breakfast',
  },
  {
    image: 'https://admin.citiesandbeaches.com/PackageImages/SliderImage/7975/fabio-fistarol-VGk9Fz_QCRo-unsplash.jpg',
    badge: 'Breakfast & Transfers Included',
    title: 'Geneva and Lake Maggiore Twin Centre via the Alps',
    country: 'Italy',
    duration: '5 Days / 4 Nights',
    boardBasis: 'Bed & Breakfast',
    price: '£499',
    href: '/Holidays/Italy/Geneva-and-Lake-Maggiore-Twin-Centre-via-the-Alps',
  },
];

/** Extract slug from href like "/Holidays/italy/some-slug" */
function slugFromHref(href: string): string {
  const parts = href.split('/');
  return parts[parts.length - 1] || '';
}

/** Format inclusive price for a holiday (base + city tax) */
function inclusivePrice(slug: string, fallbackPrice: string): string {
  const holiday = allPublishedHolidays.find((h) => h.slug === slug);
  if (!holiday) return fallbackPrice;
  const total = Math.round(holiday.price + holiday.localChargesPp);
  return `£${total.toLocaleString('en-GB')}`;
}

/** Apply inclusive pricing to offers from homepage export */
function applyInclusivePrices(rawOffers: typeof homepageData.specialOffers): Offer[] {
  return rawOffers.map((o) => ({
    ...o,
    price: inclusivePrice(slugFromHref(o.href), o.price),
  }));
}

export const offers: Offer[] =
  homepageData.specialOffers.length > 0
    ? applyInclusivePrices(homepageData.specialOffers)
    : fallbackOffers;
