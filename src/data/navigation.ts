export const mainMenuItems = [
  { label: 'River Cruises', href: '/Holidays/river-cruises' },
  { label: 'Destinations', href: 'javascript:void(0)', hasDropdown: true },
  { label: 'Collections', href: '/collections', hasDropdown: true },
  { label: 'Offers', href: '/Holidays/New-&-Exclusive-Offers' },
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

import { collections } from './collections';

/** Collection menu items — only collections with published holidays. */
export const collectionMenuItems = collections.map(c => ({ name: c.name, href: c.href }));

export const mobileMenuItems = [
  { label: 'Destinations', hasSubmenu: true },
  { label: 'Collections', hasSubmenu: true },
  { label: 'Offers', href: '/Holidays/New-&-Exclusive-Offers' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const mobileDestinationRegions = [
  'Europe', 'Americas', 'Africa', 'Asia', 'Middle East', 'Indian Ocean'
];
