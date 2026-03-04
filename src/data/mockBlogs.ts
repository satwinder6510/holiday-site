export interface MockBlog {
  title: string;
  slug: string;
  image: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export const mockBlogs: MockBlog[] = [
  {
    title: 'The Ultimate Guide to Exploring Thailand',
    slug: 'the-ultimate-guide-to-exploring-thailand',
    image: 'https://admin.citiesandbeaches.com/BlogImages/blog-1.jpg',
    date: '12 March 2024',
    author: 'Sarah Mitchell',
    excerpt:
      'From bustling Bangkok to the tranquil islands of the south, Thailand offers an unforgettable mix of culture, cuisine and natural beauty. Discover everything you need to plan the perfect Thai adventure.',
    tags: ['Thailand', 'Asia', 'Beaches', 'Culture', 'Budget Travel'],
    content: `<h2>Why Thailand Should Be Your Next Destination</h2>
<p>Thailand has long been one of the most popular destinations for travellers seeking a blend of adventure, relaxation and cultural immersion. Whether you are a first-time visitor or a seasoned explorer, the Land of Smiles never fails to enchant with its golden temples, vibrant markets and pristine coastline.</p>

<h2>Bangkok: The Gateway to Thailand</h2>
<p>No trip to Thailand is complete without spending a few days in Bangkok. The capital is a whirlwind of sensory experiences, from the ornate grandeur of the Grand Palace and Wat Phra Kaew to the aromatic chaos of Chinatown's street food stalls. Take a longtail boat along the Chao Phraya River to see the city from a different perspective, and be sure to explore the trendy rooftop bars that offer sweeping views over the skyline.</p>

<h2>Island Hopping in the South</h2>
<p>Thailand's southern islands are legendary, and for good reason. Koh Samui offers luxury resorts and palm-fringed beaches, while Koh Phangan draws a more bohemian crowd with its famous Full Moon parties and jungle yoga retreats. For something quieter, head to Koh Lipe in the Andaman Sea, where crystal-clear waters and colourful coral reefs await snorkellers and divers alike.</p>

<h2>Practical Tips for Your Trip</h2>
<p>The best time to visit Thailand is between November and April, when the weather is dry and warm. The Thai baht is excellent value for money, meaning your budget stretches further on everything from street food to spa treatments. Always carry cash for market shopping, dress respectfully when visiting temples, and do not forget to try a traditional Thai massage at least once during your stay.</p>`,
  },
  {
    title: 'A Food Lover\'s Guide to Italy',
    slug: 'a-food-lovers-guide-to-italy',
    image: 'https://admin.citiesandbeaches.com/BlogImages/blog-2.jpg',
    date: '28 February 2024',
    author: 'James Anderson',
    excerpt:
      'Italy is a paradise for food lovers, where every region boasts its own culinary traditions and specialities. From Neapolitan pizza to Tuscan truffles, join us on a gastronomic tour of the Italian peninsula.',
    tags: ['Italy', 'Food & Drink', 'Europe', 'Culture'],
    content: `<h2>Italy: A Country Built on Food</h2>
<p>Italian cuisine is beloved the world over, but nothing compares to tasting it in its homeland. Each region of Italy has its own distinct culinary identity, shaped by local ingredients, history and tradition. Forget what you think you know about Italian food and prepare to be surprised by the incredible diversity on offer.</p>

<h2>The North: Rich Flavours and Fine Wines</h2>
<p>In the north, you will find creamy risottos in Milan, handmade tortellini in Bologna, and the world's finest Parmesan cheese in Emilia-Romagna. The wine regions of Piedmont and Veneto produce some of Italy's most celebrated bottles, from robust Barolos to crisp Proseccos. Do not miss a trip to a local enoteca to sample wines paired with regional charcuterie and cheeses.</p>

<h2>The South: Simple Ingredients, Bold Tastes</h2>
<p>Southern Italian cooking is all about letting quality ingredients shine. Naples is the birthplace of pizza, and a margherita from a wood-fired oven here is a revelation. The Amalfi Coast is famous for its fresh seafood and limoncello, while Sicily offers a unique blend of Italian, Arabic and Greek influences in dishes like arancini and pasta alla norma.</p>

<h2>Essential Tips for Eating in Italy</h2>
<p>Italians take their meal times seriously. Lunch is typically the biggest meal of the day, served between 12:30 and 14:00, while dinner rarely starts before 20:00. Never order a cappuccino after 11am if you want to blend in with the locals, and always finish a meal with an espresso rather than a milky coffee. Tipping is not expected but rounding up the bill is appreciated.</p>`,
  },
  {
    title: 'Greek Island Hopping: Where to Go and What to See',
    slug: 'greek-island-hopping-where-to-go-and-what-to-see',
    image: 'https://admin.citiesandbeaches.com/BlogImages/blog-3.jpg',
    date: '15 January 2024',
    author: 'Emma Roberts',
    excerpt:
      'With over 200 inhabited islands to choose from, planning a Greek island-hopping adventure can feel overwhelming. Here is our curated guide to the best routes, islands and experiences.',
    tags: ['Greece', 'Islands', 'Europe', 'Beaches', 'Summer'],
    content: `<h2>The Magic of the Greek Islands</h2>
<p>Greece is home to more than 6,000 islands and islets, each with its own character and charm. From the iconic whitewashed villages of Santorini to the lush green hillsides of Corfu, island hopping is the best way to experience the incredible diversity of the Greek archipelago. The well-connected ferry network makes it easy to hop between islands, creating a bespoke itinerary that suits your interests.</p>

<h2>The Cyclades: Iconic Beauty</h2>
<p>The Cyclades are the poster children of Greek island tourism, and it is easy to see why. Santorini's dramatic caldera views and sunset cocktails are unmissable, while Mykonos offers a vibrant nightlife scene alongside beautiful beaches. For a quieter experience, try Naxos with its long sandy beaches and excellent local cuisine, or Milos with its extraordinary lunar landscapes and hidden sea caves.</p>

<h2>The Dodecanese and Ionian Islands</h2>
<p>Beyond the Cyclades, the Dodecanese islands offer a fascinating blend of Greek and Ottoman history. Rhodes' medieval Old Town is a UNESCO World Heritage Site, and Kos is perfect for families with its gentle beaches and cycling paths. On the western side of Greece, the Ionian islands of Corfu, Kefalonia and Zakynthos boast dramatic coastlines, Venetian architecture and some of the clearest waters in the Mediterranean.</p>

<h2>Planning Your Island-Hopping Route</h2>
<p>The best time for island hopping is May to June or September to October, when the weather is warm but the crowds are thinner. Book ferries in advance during peak season through services like Ferryhopper or Blue Star Ferries. Allow at least two to three nights on each island to truly soak in the atmosphere, and always leave room in your itinerary for spontaneous detours to lesser-known gems.</p>`,
  },
  {
    title: 'Morocco: An Adventure for the Senses',
    slug: 'morocco-an-adventure-for-the-senses',
    image: 'https://admin.citiesandbeaches.com/BlogImages/blog-4.jpg',
    date: '5 December 2023',
    author: 'Sarah Mitchell',
    excerpt:
      'Morocco is a land of vivid contrasts, from the labyrinthine souks of Marrakech to the vast silence of the Sahara Desert. Prepare for an adventure that will awaken every one of your senses.',
    tags: ['Morocco', 'Africa', 'Adventure', 'Culture', 'Desert'],
    content: `<h2>A Country of Extraordinary Contrasts</h2>
<p>Morocco sits at the crossroads of Africa and Europe, and this unique position has given rise to a culture that is wonderfully rich and diverse. In a single trip, you can wander through ancient medinas, trek across sand dunes on camelback, hike in the Atlas Mountains and relax on Atlantic beaches. Few countries pack so many unforgettable experiences into such a compact area.</p>

<h2>Marrakech: The Red City</h2>
<p>Marrakech is the beating heart of Moroccan tourism, and the famous Jemaa el-Fna square is unlike anywhere else on earth. By day, it buzzes with snake charmers, henna artists and juice sellers; by night, it transforms into an open-air food market with dozens of stalls serving tagines, grilled meats and freshly baked bread. Beyond the square, lose yourself in the souks where artisans sell handcrafted leather, ceramics, textiles and spices.</p>

<h2>Beyond Marrakech: Desert and Mountains</h2>
<p>A trip to the Sahara Desert is an absolute must. Most tours depart from Marrakech and include a night in a luxury desert camp under a canopy of stars that you will never forget. The journey takes you through the dramatic Todra Gorge and over the High Atlas passes. For hikers, the Atlas Mountains offer excellent trekking opportunities, with Toubkal being the highest peak in North Africa at over 4,000 metres.</p>

<h2>Tips for Visiting Morocco</h2>
<p>Morocco is a Muslim country, so modest dress is appreciated, particularly outside of tourist resorts. Haggling is expected in the souks, so start at around half the asking price and negotiate from there. The local currency is the dirham, and while cards are accepted in hotels and larger restaurants, cash is essential for markets and smaller establishments. French and Arabic are the main languages, but English is widely spoken in tourist areas.</p>`,
  },
  {
    title: 'Portugal\'s Hidden Gems: Beyond Lisbon and Porto',
    slug: 'portugals-hidden-gems-beyond-lisbon-and-porto',
    image: 'https://admin.citiesandbeaches.com/BlogImages/blog-5.jpg',
    date: '20 November 2023',
    author: 'James Anderson',
    excerpt:
      'While Lisbon and Porto steal the headlines, Portugal is brimming with lesser-known treasures waiting to be discovered. From the wild Alentejo coast to the terraced vineyards of the Douro Valley, explore the country\'s best-kept secrets.',
    tags: ['Portugal', 'Europe', 'Hidden Gems', 'Beaches'],
    content: `<h2>Portugal Beyond the Obvious</h2>
<p>Portugal has enjoyed a surge in popularity in recent years, and for good reason. But while most visitors flock to Lisbon's cobbled streets and Porto's riverside charm, the country has so much more to offer. Venture beyond the two main cities and you will discover a land of wild coastlines, medieval villages, world-class wine regions and a warmth of welcome that is hard to beat anywhere in Europe.</p>

<h2>The Alentejo: Portugal's Soul</h2>
<p>The Alentejo region stretches across the south-central part of Portugal and is often described as the country's soul. The Rota Vicentina coastal trail offers some of the most spectacular hiking in Europe, with dramatic cliff paths overlooking deserted beaches. Inland, whitewashed towns like Evora, with its Roman temple and medieval cathedral, provide a fascinating glimpse into Portugal's rich history. The region is also home to some of the country's best cork oak forests and emerging wine estates.</p>

<h2>The Douro Valley and the North</h2>
<p>The Douro Valley is a UNESCO World Heritage landscape of terraced vineyards cascading down to the river below. A cruise along the Douro is one of Portugal's most memorable experiences, with stops at quintas for port wine tastings. Further north, the Peneda-Geres National Park offers rugged granite peaks, ancient oak forests and traditional villages where life has changed little over the centuries.</p>

<h2>The Azores: Europe's Best-Kept Secret</h2>
<p>Out in the mid-Atlantic, the nine islands of the Azores archipelago are a paradise for nature lovers. Sao Miguel, the largest island, is famous for its volcanic crater lakes, hot springs and lush green landscapes. Whale watching is world-class here, with over twenty species passing through these waters. The Azores offer an authentically Portuguese experience far removed from the crowds of the mainland, making them perfect for travellers seeking something truly different.</p>`,
  },
  {
    title: 'Exploring the Ancient Wonders of Egypt',
    slug: 'exploring-the-ancient-wonders-of-egypt',
    image: 'https://admin.citiesandbeaches.com/BlogImages/blog-6.jpg',
    date: '8 October 2023',
    author: 'Emma Roberts',
    excerpt:
      'Egypt is a destination that has captivated travellers for millennia, and its ancient monuments remain as awe-inspiring today as ever. From the Pyramids of Giza to the temples of Luxor, here is your guide to exploring Egypt\'s greatest treasures.',
    tags: ['Egypt', 'Africa', 'History', 'Culture', 'Ancient Wonders'],
    content: `<h2>A Journey Through Five Thousand Years of History</h2>
<p>Egypt is the cradle of one of the world's oldest civilisations, and visiting its ancient sites is a humbling and unforgettable experience. The sheer scale of the monuments, the intricacy of the hieroglyphics and the stories of the pharaohs combine to create a destination unlike any other. Whether you spend a week or a month, Egypt will leave an indelible mark on your memory.</p>

<h2>Cairo and the Pyramids of Giza</h2>
<p>The Pyramids of Giza are the last surviving wonder of the ancient world, and seeing them in person is a bucket-list moment. The Great Pyramid of Khufu, built over 4,500 years ago, is staggering in its precision and scale. Nearby, the Sphinx gazes eternally across the desert plateau. In Cairo itself, the Egyptian Museum houses an extraordinary collection of artefacts, including the golden treasures of Tutankhamun's tomb.</p>

<h2>Luxor: The World's Greatest Open-Air Museum</h2>
<p>Luxor, ancient Thebes, is home to some of Egypt's most spectacular monuments. On the east bank, the Karnak Temple complex is a vast labyrinth of pylons, obelisks and hypostyle halls that took over two thousand years to build. Across the Nile on the west bank, the Valley of the Kings contains the tombs of the pharaohs, their walls covered in vivid paintings that have survived for millennia. A hot air balloon ride over the west bank at sunrise is an experience not to be missed.</p>

<h2>Practical Tips for Visiting Egypt</h2>
<p>The best time to visit Egypt is between October and April, when temperatures are more comfortable for sightseeing. Hiring a licensed guide at major sites is strongly recommended, as they bring the history to life in ways that guidebooks cannot. Dress modestly when visiting mosques and rural areas, carry plenty of water, and always agree on taxi fares before getting in. A Nile cruise between Luxor and Aswan is one of the best ways to see the temples of Upper Egypt at a leisurely pace.</p>`,
  },
  {
    title: 'Vietnam Street Food: A Culinary Journey',
    slug: 'vietnam-street-food-a-culinary-journey',
    image: 'https://admin.citiesandbeaches.com/BlogImages/blog-7.jpg',
    date: '14 September 2023',
    author: 'Sarah Mitchell',
    excerpt:
      'Vietnam\'s street food scene is one of the most exciting in the world, offering an explosion of flavours at incredibly low prices. Pull up a plastic stool and join us on a culinary journey from Hanoi to Ho Chi Minh City.',
    tags: ['Vietnam', 'Asia', 'Food & Drink', 'Street Food', 'Culture'],
    content: `<h2>Why Vietnam is a Street Food Paradise</h2>
<p>Vietnamese cuisine is celebrated for its freshness, balance and depth of flavour, and nowhere is this more evident than on the country's bustling streets. From steaming bowls of pho served at dawn to sizzling banh xeo crackling in the evening air, eating on the street is not just a budget option in Vietnam, it is a way of life. The best meals are often found at the most unassuming stalls, where recipes have been perfected over generations.</p>

<h2>Hanoi: The Street Food Capital</h2>
<p>Hanoi's Old Quarter is the undisputed capital of Vietnamese street food. The city's signature dish is pho bo, a fragrant beef noodle soup that locals eat for breakfast. Bun cha, grilled pork patties served with rice noodles and a tangy dipping sauce, is another Hanoi essential, made famous when Barack Obama enjoyed it with Anthony Bourdain. For something adventurous, try egg coffee at Cafe Giang, where rich espresso is topped with a creamy whipped egg yolk mixture.</p>

<h2>Central Vietnam: Hue and Hoi An</h2>
<p>Central Vietnam has its own distinct culinary traditions. Hue, the former imperial capital, is known for its elaborate royal cuisine and fiery chilli-laced dishes like bun bo Hue, a spicy beef noodle soup that rivals Hanoi's pho. In nearby Hoi An, the must-try dish is cao lau, thick rice noodles topped with pork, herbs and crispy croutons, using water drawn from a specific ancient well. The Hoi An night market is a wonderful place to graze through dozens of local specialities.</p>

<h2>Ho Chi Minh City: The Southern Flavour</h2>
<p>In the south, Ho Chi Minh City offers a sweeter, more tropical take on Vietnamese cuisine. Banh mi, the iconic Vietnamese baguette sandwich stuffed with pate, pickled vegetables and fresh herbs, reaches its peak here. The city's Chinese-influenced District 5 is excellent for dim sum and roast duck, while the backpacker area of Bui Vien Street offers an overwhelming array of street food options. A guided food tour is an excellent way to navigate the city's vast culinary landscape.</p>`,
  },
  {
    title: 'The Maldives: Your Guide to Luxury Island Living',
    slug: 'the-maldives-your-guide-to-luxury-island-living',
    image: 'https://admin.citiesandbeaches.com/BlogImages/blog-8.jpg',
    date: '2 August 2023',
    author: 'James Anderson',
    excerpt:
      'The Maldives is the ultimate destination for those seeking luxury, seclusion and natural beauty. Discover overwater villas, world-class diving and some of the most stunning beaches on the planet.',
    tags: ['Maldives', 'Luxury', 'Beaches', 'Asia', 'Honeymoon'],
    content: `<h2>Paradise Found in the Indian Ocean</h2>
<p>The Maldives is a nation of 1,192 coral islands scattered across the Indian Ocean, forming 26 natural atolls. With powder-white beaches, turquoise lagoons and some of the clearest water on earth, it is no wonder that the Maldives consistently ranks as one of the world's most desirable destinations. While it has a reputation for exclusivity, there are options to suit a range of budgets, from ultra-luxury private island resorts to charming local guesthouses.</p>

<h2>Overwater Villas: The Ultimate Indulgence</h2>
<p>Staying in an overwater villa is the quintessential Maldivian experience. These stunning accommodations sit on stilts above the lagoon, with glass floors for watching marine life glide beneath you and private decks with direct access to the ocean. Many villas come with personal butlers, outdoor bathtubs and sunset-facing infinity pools. Resorts like Soneva Fushi, One&Only Reethi Rah and the St. Regis Maldives offer some of the finest overwater living in the world.</p>

<h2>Diving and Marine Life</h2>
<p>Beneath the surface, the Maldives is just as spectacular. The warm waters are home to over 2,000 species of fish, five species of sea turtle, manta rays and whale sharks. The atolls create natural channels where nutrient-rich currents attract an incredible diversity of marine life, making this one of the top diving destinations on the planet. Even if you are not a diver, snorkelling from the beach at most resorts will reward you with sightings of reef sharks, rays and colourful coral gardens.</p>

<h2>When to Visit and What to Know</h2>
<p>The Maldives enjoys warm weather year-round, but the dry season from November to April is considered the best time to visit for clear skies and calm seas. The wet season from May to October brings occasional rain showers but also better diving visibility and lower prices. Male, the capital, is worth a brief visit for its colourful fish market and the stunning Friday Mosque. Most resorts offer seaplane or speedboat transfers from the airport, and the journey itself is often a highlight of the trip.</p>`,
  },
  {
    title: 'Discovering the Best Beaches of Cyprus',
    slug: 'discovering-the-best-beaches-of-cyprus',
    image: 'https://admin.citiesandbeaches.com/BlogImages/blog-9.jpg',
    date: '19 July 2023',
    author: 'Emma Roberts',
    excerpt:
      'Cyprus is blessed with some of the most beautiful beaches in the Mediterranean, from golden sandy bays to secluded rocky coves. Here is our pick of the island\'s finest coastal spots.',
    tags: ['Cyprus', 'Beaches', 'Europe', 'Mediterranean'],
    content: `<h2>Why Cyprus is a Beach Lover's Dream</h2>
<p>Cyprus enjoys over 300 days of sunshine a year and boasts some of the warmest waters in the Mediterranean, making it an ideal beach destination from April right through to November. The island's coastline is remarkably varied, offering everything from long, family-friendly sandy beaches with full amenities to wild, untouched coves accessible only on foot. With its rich mythology, Cyprus even claims to be the birthplace of Aphrodite, the goddess of love, who is said to have emerged from the sea foam at Petra tou Romiou.</p>

<h2>The Best Beaches of Paphos and the West</h2>
<p>The western coast around Paphos is home to some of Cyprus's most dramatic coastal scenery. Coral Bay is the area's most popular beach, a crescent of golden sand lapped by calm, shallow waters perfect for families. Further along the coast, Lara Bay is a protected turtle nesting site with wild, unspoilt beauty and no development in sight. The sea caves at Cape Greco on the south-eastern tip offer stunning rock formations and crystal-clear swimming spots that feel like natural infinity pools.</p>

<h2>Ayia Napa and Protaras: The Eastern Riviera</h2>
<p>The eastern coast is where you will find Cyprus's most famous beaches. Nissi Beach in Ayia Napa is a stunning stretch of white sand with a small island connected by a sandbar at low tide. Nearby Fig Tree Bay in Protaras regularly appears in lists of Europe's best beaches, with its golden sand and impossibly blue water. For a quieter alternative, Konnos Bay is a small, sheltered cove nestled between rocky headlands, perfect for snorkelling in its clear, calm waters.</p>

<h2>Tips for Beach Days in Cyprus</h2>
<p>Most of Cyprus's main beaches have excellent facilities including sunbed hire, water sports, showers and nearby restaurants. The water is warm enough for swimming from May to November, with peak temperatures in August reaching a bathtub-like 28 degrees. Hiring a car is the best way to explore the coastline and discover hidden gems away from the main resorts. Do not miss watching the sunset from Petra tou Romiou, one of the most romantic spots in the entire Mediterranean.</p>`,
  },
];
