export interface Destination {
  name: string;
  image: string;
  href: string;
}

export const destinations: Destination[] = [
  { name: 'Americas', image: 'https://admin.citiesandbeaches.com/images/destinations/Americas_icon.jpg', href: '/Holidays/Americas' },
  { name: 'Asia', image: 'https://admin.citiesandbeaches.com/images/destinations/Asia_icon.jpg', href: '/Holidays/Asia' },
  { name: 'Europe', image: 'https://admin.citiesandbeaches.com/images/destinations/Europe_icon.jpg', href: '/Holidays/Europe' },
  { name: 'Middle East', image: 'https://admin.citiesandbeaches.com/images/destinations/Middle East_icon.jpg', href: '/Holidays/Middle-East' },
  { name: 'Africa', image: 'https://admin.citiesandbeaches.com/images/destinations/Africa_icon.jpg', href: '/Holidays/Africa' },
  { name: 'Indian Ocean', image: 'https://admin.citiesandbeaches.com/images/destinations/Indian Ocean_icon.jpg', href: '/Holidays/Indian-Ocean' },
];
