export interface ItineraryDay {
  day: string;
  title: string;
  description: string;
  image?: string;
}

export interface Accommodation {
  name: string;
  stars: number;
  description: string;
  amenities: string[];
  image?: string;
}

export interface Review {
  author: string;
  date: string;
  content: string;
}

export interface MockItineraryHoliday {
  id: number;
  title: string;
  slug: string;
  country: string;
  countrySlug: string;
  destination: string;
  duration: string;
  boardBasis: string;
  price: number;
  heroImage: string;
  sidebarImage: string;
  overview: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  accommodations: Accommodation[];
  galleryImages: string[];
  otherInfo: string;
  otherInfoBullets: string[];
  reviews: Review[];
  routeMapImage: string;
}

export const mockItineraryHoliday: MockItineraryHoliday = {
  id: 101,
  title: 'The Golden Triangle - Explore Delhi, Agra and Jaipur',
  slug: 'The-Golden-Triangle-Explore-Delhi-Agra-and-Jaipur',
  country: 'India',
  countrySlug: 'India',
  destination: 'Delhi, Agra & Jaipur',
  duration: '8 Days / 7 Nights',
  boardBasis: 'Bed & Breakfast',
  price: 1299,
  heroImage:
    'https://admin.citiesandbeaches.com/PackageImages/SliderImage/golden-triangle/hero-taj-mahal.jpg',
  sidebarImage:
    'https://admin.citiesandbeaches.com/PackageImages/SliderImage/golden-triangle/sidebar-india-gate.jpg',
  overview:
    'Experience the magic of India on this classic Golden Triangle tour, taking in three of the country\'s most iconic cities. Begin in the bustling capital Delhi, where ancient monuments stand alongside modern skyscrapers. Travel south to Agra to witness the breathtaking Taj Mahal at sunrise, one of the most beautiful buildings ever created. Continue west to Jaipur, the Pink City, where magnificent forts and palaces tell the story of Rajasthan\'s royal heritage. This carefully crafted itinerary combines guided sightseeing, luxury accommodation and authentic cultural experiences for an unforgettable introduction to India.',
  highlights: [
    'Return flights from London to Delhi included',
    'All airport transfers and intercity transportation in air-conditioned vehicles',
    'Seven nights in luxury five-star heritage hotels',
    'Daily breakfast at each hotel',
    'Sunrise visit to the Taj Mahal with expert local guide',
    'Guided tours of Old and New Delhi including Jama Masjid and India Gate',
    'Explore the abandoned Mughal city of Fatehpur Sikri en route to Jaipur',
    'Visit the magnificent Amber Fort with optional elephant ride',
    'Experience a traditional Rajasthani dinner with folk music and dance',
    'English-speaking expert guides at all major sites',
  ],
  itinerary: [
    {
      day: 'Day 1',
      title: 'Arrive in Delhi',
      description:
        'Arrive at Indira Gandhi International Airport where you will be met by your private driver and transferred to The Imperial hotel. Depending on your arrival time, the rest of the day is at leisure to begin acclimatising to the sights, sounds and aromas of India. In the evening, enjoy a welcome dinner at the hotel\'s acclaimed Spice Route restaurant, which takes you on a culinary journey along the ancient spice trading routes from Kerala to Vietnam.',
      image:
        'https://admin.citiesandbeaches.com/PackageImages/SliderImage/golden-triangle/day1-delhi-arrival.jpg',
    },
    {
      day: 'Day 2',
      title: 'Explore Old and New Delhi',
      description:
        'After breakfast, embark on a full-day guided tour of Delhi. Begin in Old Delhi with a rickshaw ride through the narrow lanes of Chandni Chowk, one of the oldest and busiest markets in India. Visit the magnificent Jama Masjid, India\'s largest mosque, and see the Red Fort from the outside. After lunch, explore New Delhi\'s grand colonial architecture, including India Gate, the Presidential Palace (Rashtrapati Bhavan) and Humayun\'s Tomb, a precursor to the Taj Mahal and a UNESCO World Heritage Site. End the day with a visit to the Qutub Minar, the tallest brick minaret in the world.',
      image:
        'https://admin.citiesandbeaches.com/PackageImages/SliderImage/golden-triangle/day2-old-delhi.jpg',
    },
    {
      day: 'Day 3',
      title: 'Delhi to Agra and the Taj Mahal',
      description:
        'Depart Delhi after breakfast for the drive to Agra, approximately four hours along the Yamuna Expressway. Check in to the Oberoi Amarvilas, perfectly positioned just 600 metres from the Taj Mahal with uninterrupted views from every room. In the late afternoon, visit the Taj Mahal as the setting sun bathes the white marble in golden light. Your expert guide will share the fascinating love story of Emperor Shah Jahan and Mumtaz Mahal that inspired this architectural masterpiece. Return to the hotel for dinner with the illuminated Taj Mahal as your backdrop.',
      image:
        'https://admin.citiesandbeaches.com/PackageImages/SliderImage/golden-triangle/day3-taj-mahal.jpg',
    },
    {
      day: 'Day 4',
      title: 'Fatehpur Sikri and onward to Jaipur',
      description:
        'Rise early for a sunrise visit to the Taj Mahal, when the monument is at its most serene and magical. After breakfast, visit Agra Fort, a massive red sandstone fortress that served as the seat of the Mughal Empire. Depart Agra and stop en route to Jaipur at Fatehpur Sikri, the ghostly abandoned city built by Emperor Akbar in the 16th century. This remarkably well-preserved complex of palaces, courtyards and mosques was abandoned after only 14 years due to a lack of water. Continue to Jaipur and check in to the Rambagh Palace, a former royal residence turned luxury hotel.',
      image:
        'https://admin.citiesandbeaches.com/PackageImages/SliderImage/golden-triangle/day4-fatehpur-sikri.jpg',
    },
    {
      day: 'Day 5',
      title: 'Jaipur Sightseeing',
      description:
        'Spend the day exploring Jaipur, the vibrant Pink City. Begin with a morning visit to the magnificent Amber Fort, perched on a hillside overlooking Maota Lake. Explore its ornate halls, mirror-work chambers and secret passages, and enjoy panoramic views over the surrounding Aravalli hills. Return to the city to visit the Hawa Mahal (Palace of the Winds), the City Palace complex and the Jantar Mantar observatory, all within walking distance of one another. In the evening, attend a traditional Rajasthani dinner with live folk music and dance performances.',
      image:
        'https://admin.citiesandbeaches.com/PackageImages/SliderImage/golden-triangle/day5-amber-fort.jpg',
    },
    {
      day: 'Day 6',
      title: 'Jaipur at Leisure',
      description:
        'Today is a free day to explore Jaipur at your own pace. You may wish to browse the colourful bazaars of Johari Bazaar and Bapu Bazaar, famous for their textiles, jewellery and handicrafts. For the adventurous, an optional hot air balloon ride over the city offers breathtaking views of the forts, palaces and the Aravalli mountain range at sunrise. Alternatively, indulge in a rejuvenating Ayurvedic spa treatment at the hotel or take a cooking class to learn the secrets of authentic Rajasthani cuisine. In the afternoon, visit the lesser-known Nahargarh Fort for stunning sunset views over the city.',
      image:
        'https://admin.citiesandbeaches.com/PackageImages/SliderImage/golden-triangle/day6-jaipur-bazaar.jpg',
    },
    {
      day: 'Day 7',
      title: 'Departure',
      description:
        'After a leisurely breakfast, check out of the Rambagh Palace and transfer to Jaipur International Airport for your return flight home, or extend your stay with an optional trip to the lake city of Udaipur, the desert fortress of Jodhpur, or the tiger reserves of Ranthambore. Your driver will ensure you arrive at the airport in good time, giving you a final opportunity to soak in the sights and sounds of Rajasthan. Depart India with a lifetime of memories from this extraordinary journey through the Golden Triangle.',
      image:
        'https://admin.citiesandbeaches.com/PackageImages/SliderImage/golden-triangle/day7-departure.jpg',
    },
  ],
  accommodations: [
    {
      name: 'The Imperial, New Delhi',
      stars: 5,
      description:
        'One of India\'s most prestigious heritage hotels, The Imperial is a stunning Art Deco landmark on Janpath in the heart of New Delhi. Built in 1931, the hotel seamlessly blends colonial grandeur with modern luxury, featuring lush gardens, world-class restaurants and an impressive collection of 18th and 19th century art. Its central location makes it the perfect base for exploring both Old and New Delhi.',
      amenities: [
        'Outdoor swimming pool',
        'Award-winning spa',
        'Five restaurants and bars',
        'Fitness centre',
        'Butler service',
        'Complimentary Wi-Fi',
        'Heritage walks',
      ],
      image:
        'https://admin.citiesandbeaches.com/PackageImages/SliderImage/golden-triangle/hotel-imperial-delhi.jpg',
    },
    {
      name: 'The Oberoi Amarvilas, Agra',
      stars: 5,
      description:
        'The Oberoi Amarvilas enjoys an unrivalled position just 600 metres from the Taj Mahal, offering uninterrupted views of the monument from every room. Inspired by Mughal palace design, the hotel features terraced lawns, fountains, ornamental pools and interiors decorated with gold leaf, semi-precious stones and rich fabrics. It is widely regarded as one of the finest luxury hotels in India and the ultimate base for visiting the Taj Mahal.',
      amenities: [
        'Taj Mahal views from every room',
        'Outdoor heated swimming pool',
        'Oberoi Spa with traditional treatments',
        'Two fine-dining restaurants',
        'Yoga and meditation sessions',
        'Complimentary Wi-Fi',
        'Personal butler service',
      ],
      image:
        'https://admin.citiesandbeaches.com/PackageImages/SliderImage/golden-triangle/hotel-oberoi-agra.jpg',
    },
    {
      name: 'Rambagh Palace, Jaipur',
      stars: 5,
      description:
        'The Rambagh Palace is a breathtaking former residence of the Maharaja of Jaipur, set amidst 47 acres of manicured Mughal gardens. Converted into a luxury hotel in 1957, it retains all the opulence of its royal past with hand-carved marble, exquisite silk furnishings and antique crystal chandeliers. Guests can dine in former royal banquet halls, play croquet on the palace lawns and experience a level of hospitality befitting Indian royalty.',
      amenities: [
        'Indoor and outdoor swimming pools',
        'Royal spa with Ayurvedic treatments',
        'Three restaurants including Suvarna Mahal',
        'Croquet and tennis on palace grounds',
        'Vintage car experiences',
        'Complimentary Wi-Fi',
        'Personal butler service',
        'Horse riding',
      ],
      image:
        'https://admin.citiesandbeaches.com/PackageImages/SliderImage/golden-triangle/hotel-rambagh-jaipur.jpg',
    },
  ],
  galleryImages: [
    'https://admin.citiesandbeaches.com/PackageImages/Gallery/golden-triangle/gallery-1-taj-mahal-sunrise.jpg',
    'https://admin.citiesandbeaches.com/PackageImages/Gallery/golden-triangle/gallery-2-amber-fort.jpg',
    'https://admin.citiesandbeaches.com/PackageImages/Gallery/golden-triangle/gallery-3-delhi-street.jpg',
    'https://admin.citiesandbeaches.com/PackageImages/Gallery/golden-triangle/gallery-4-hawa-mahal.jpg',
    'https://admin.citiesandbeaches.com/PackageImages/Gallery/golden-triangle/gallery-5-agra-fort.jpg',
  ],
  otherInfo:
    'This tour operates year-round, though the most comfortable months to visit are October to March when temperatures are pleasant and rainfall is minimal. The monsoon season (July to September) brings heavy rain but also lush green landscapes and fewer crowds. All intercity transfers are in private air-conditioned vehicles with professional drivers. Domestic flights can be arranged as an alternative to road travel at an additional cost.',
  otherInfoBullets: [
    'Valid passport with at least six months validity required',
    'Indian tourist visa (e-Visa) must be obtained before travel',
    'Recommended vaccinations: Hepatitis A, Typhoid, Tetanus',
    'Travel insurance is mandatory for all guests',
    'Comfortable walking shoes recommended for sightseeing',
    'Conservative dress advised when visiting religious sites',
    'Local currency is the Indian Rupee (INR); major credit cards widely accepted in hotels',
    'Time zone: India Standard Time (GMT+5:30)',
    'Tipping is customary; suggested guidelines will be provided',
  ],
  reviews: [
    {
      author: 'Margaret and David H.',
      date: '14 February 2024',
      content:
        'An absolutely incredible trip from start to finish. The hotels were beyond our expectations, particularly the Oberoi Amarvilas where we could see the Taj Mahal from our bathtub. Our guide Rajesh was knowledgeable, patient and had a wonderful sense of humour. The sunrise visit to the Taj Mahal was the highlight of our trip and a memory we will treasure forever. The itinerary was perfectly paced with enough free time to explore on our own. We cannot recommend this tour highly enough.',
    },
    {
      author: 'Catherine L.',
      date: '28 November 2023',
      content:
        'I travelled solo on this tour and felt completely safe and well looked after throughout. The private transfers and expert guides made navigating India\'s busy cities stress-free. Jaipur was my favourite city, and the Rambagh Palace was like stepping into a fairy tale. The traditional Rajasthani dinner with dancers was a magical evening. My only suggestion would be to add an extra day in Agra, as there is so much to see beyond the Taj Mahal. Overall, a fantastic introduction to India.',
    },
    {
      author: 'Richard and Sue T.',
      date: '5 October 2023',
      content:
        'This was our first visit to India and we were slightly apprehensive about the culture shock, but the tour was brilliantly organised and our guides made everything feel comfortable and accessible. Delhi was overwhelming in the best possible way, and seeing the Taj Mahal at sunrise genuinely brought tears to our eyes. The Amber Fort in Jaipur was another highlight, especially the mirror-work chambers. The food throughout was excellent, and each hotel surpassed the last. We are already planning our return to explore Rajasthan further.',
    },
  ],
  routeMapImage:
    'https://admin.citiesandbeaches.com/PackageImages/Maps/golden-triangle-route-map.jpg',
};
