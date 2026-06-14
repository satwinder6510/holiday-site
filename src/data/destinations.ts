export interface Destination {
  name: string;
  image: string;
  href: string;
}

export const destinations: Destination[] = [
  { name: 'Americas', image: '/images/countries/Brazil_icon.jpg', href: '/destinations/Americas' },
  { name: 'Asia', image: '/images/countries/Thailand_icon.jpg', href: '/destinations/Asia' },
  { name: 'Europe', image: '/images/countries/Italy_icon.jpg', href: '/destinations/Europe' },
  { name: 'Middle East', image: '/images/countries/UAE_icon.jpg', href: '/destinations/Middle-East' },
  { name: 'Africa', image: '/images/countries/Kenya_icon.jpg', href: '/destinations/Africa' },
  { name: 'Indian Ocean', image: '/images/countries/Maldives_icon.jpg', href: '/destinations/Indian-Ocean' },
];
