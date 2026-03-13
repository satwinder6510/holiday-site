import homepageData from './homepage-export.json';
import { allPublishedHolidays } from './holidays';

const fallbackTour = {
  title: 'Bali Beach Escape with Transfers and Breakfast',
  description: "Beautiful Bali never stops to charm you, as it opens its natural diverse gifts to you. Plan a vacation to the 'Islands of Gods' with our Bali holiday starting from £899 pp only!",
  price: '£899',
  href: '/Holidays/Indonesia/Bali-Beach-Escape-with-Transfers-and-Breakfast',
  images: [
    'https://admin.citiesandbeaches.com/PackageImages/SliderImage/5227/The Camakila Legian Bali_TWO.jpg',
    'https://admin.citiesandbeaches.com/PackageImages/SliderImage/5227/The Camakila Legian Bali_THREE.jpg',
    'https://admin.citiesandbeaches.com/PackageImages/SliderImage/5227/The Camakila_6.jpg',
    'https://admin.citiesandbeaches.com/PackageImages/SliderImage/5227/The Camakila_7.jpg',
    'https://admin.citiesandbeaches.com/PackageImages/SliderImage/5227/The Camakila_12.jpg',
  ],
};

function inclusivePrice(href: string, fallbackPrice: string): string {
  const slug = href.split('/').pop() || '';
  const holiday = allPublishedHolidays.find((h) => h.slug === slug);
  if (!holiday) return fallbackPrice;
  const total = Math.round(holiday.price + holiday.localChargesPp);
  return `£${total.toLocaleString('en-GB')}`;
}

const rawTour = homepageData.featuredTour;
export const featuredTour = rawTour
  ? { ...rawTour, price: inclusivePrice(rawTour.href, rawTour.price) }
  : fallbackTour;
