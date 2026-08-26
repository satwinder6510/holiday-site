// Read-only Drizzle schema for flight_packages + package_pricing
// Mirrors the admin API schema but only declares columns we need for SSR

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const flightPackages = sqliteTable('flight_packages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  category: text('category').notNull(),
  operatorName: text('operator_name'), // manual cruises: operator for the river-cruise filter
  price: real('price').notNull(),
  currency: text('currency').default('GBP').notNull(),
  priceLabel: text('price_label').default('per adult').notNull(),
  description: text('description').notNull(),
  excerpt: text('excerpt'),
  whatsIncluded: text('whats_included', { mode: 'json' }).$type<string[]>().default([]).notNull(),
  highlights: text('highlights', { mode: 'json' }).$type<string[]>().default([]).notNull(),
  itinerary: text('itinerary', { mode: 'json' }).$type<unknown[]>().default([]).notNull(),
  accommodations: text('accommodations', { mode: 'json' }).$type<unknown[]>().default([]).notNull(),
  otherInfo: text('other_info'),
  featuredImage: text('featured_image'),
  gallery: text('gallery', { mode: 'json' }).$type<string[]>().default([]),
  duration: text('duration'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  isPublished: integer('is_published', { mode: 'boolean' }).default(false).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`).notNull(),
  sourceUrl: text('source_url'),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default([]).notNull(),
  videos: text('videos', { mode: 'json' }).$type<string[]>().default([]).notNull(),
  singlePrice: real('single_price'),
  pricingDisplay: text('pricing_display').default('both').notNull(),
  excluded: text('excluded'),
  requirements: text('requirements'),
  attention: text('attention'),
  isSpecialOffer: integer('is_special_offer', { mode: 'boolean' }).default(false).notNull(),
  countries: text('countries', { mode: 'json' }).$type<string[]>().default([]).notNull(),
  pricingModule: text('pricing_module').default('manual').notNull(),
  flightApiSource: text('flight_api_source').default('european').notNull(),
  review: text('review'),
  autoRefreshEnabled: integer('auto_refresh_enabled', { mode: 'boolean' }).default(false).notNull(),
  lastFlightRefreshAt: text('last_flight_refresh_at'),
  flightRefreshConfig: text('flight_refresh_config', { mode: 'json' }),
  isUnlisted: integer('is_unlisted', { mode: 'boolean' }).default(false).notNull(),
  mobileHeroVideo: text('mobile_hero_video'),
  enabledHotelCategories: text('enabled_hotel_categories', { mode: 'json' }).$type<string[]>().default([]),
  desktopHeroVideo: text('desktop_hero_video'),
  customExclusions: text('custom_exclusions', { mode: 'json' }).$type<string[]>().default([]),
  boardBasisOverride: text('board_basis_override'),
  hotelOverride: text('hotel_override'),
  cityTaxConfig: text('city_tax_config', { mode: 'json' }).$type<unknown[]>().default([]),
  additionalChargeName: text('additional_charge_name'),
  additionalChargeExchangeRate: text('additional_charge_exchange_rate'),
  additionalChargeCurrency: text('additional_charge_currency'),
  additionalChargeForeignAmount: text('additional_charge_foreign_amount'),
  cityTaxEnabled: integer('city_tax_enabled', { mode: 'boolean' }).default(true).notNull(),
  includeAirlines: text('include_airlines'),
  displayPrice: real('display_price'),
  cities: text('cities', { mode: 'json' }).$type<string[]>().default([]).notNull(),
});

export const cruiseFlightPrices = sqliteTable('cruise_flight_prices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  offerId: integer('offer_id').notNull(),
  sailingId: integer('sailing_id').notNull(),
  departureDate: text('departure_date').notNull(),
  returnDate: text('return_date').notNull(),
  airportCode: text('airport_code').notNull(),
  airportName: text('airport_name').notNull(),
  flightPricePp: text('flight_price_pp').notNull(),
  totalPricePp: text('total_price_pp').notNull(),
  source: text('source').notNull(),
  pricedAt: text('priced_at').default(sql`(datetime('now'))`).notNull(),
});

export const cruiseOffers = sqliteTable('cruise_offers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  cheapestTotalPp: text('cheapest_total_pp'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

// Individual departures — only the columns the listing needs (date filter + ship).
export const cruiseSailings = sqliteTable('cruise_sailings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  shipId: integer('ship_id'),
  departureDate: text('departure_date').notNull(),
});

// Per offer × sailing × cabin-type pricing grid. The listing aggregates this to the
// cheapest all-in pp per cabin type (net_cost_pp = cruise + flight + luggage + port fee).
export const cruiseOfferSailingCabins = sqliteTable('cruise_offer_sailing_cabins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  offerId: integer('offer_id').notNull(),
  sailingId: integer('sailing_id').notNull(),
  cabinType: text('cabin_type').notNull(),
  netCostPp: text('net_cost_pp'),
  retailPricePp: text('retail_price_pp'), // admin's manual selling price (overlay on the live calendar)
});

export const packagePricing = sqliteTable('package_pricing', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  packageId: integer('package_id').notNull(),
  departureAirport: text('departure_airport').notNull(),
  departureAirportName: text('departure_airport_name').notNull(),
  departureDate: text('departure_date').notNull(),
  price: real('price').notNull(),
  currency: text('currency').default('GBP').notNull(),
  isAvailable: integer('is_available', { mode: 'boolean' }).default(true).notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
});

// Hotel library — canonical per-hotel star ratings (admin-maintained).
// Detail pages look ratings up LIVE by name so a library edit reflects on
// every offer immediately (accommodations JSON `stars` is only the fallback).
export const hotelLibrary = sqliteTable('hotel_library', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  starRating: integer('star_rating'),
});

// City tax rules — the SAME table the admin quote tool edits (Quotes → Taxes
// & Log). Read live per request (5-min cache in city-taxes-live.ts) so admin
// edits reach package pages without a deploy; src/data/city-taxes.json is the
// deploy-time snapshot used as fallback.
export const cityTaxes = sqliteTable('city_taxes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  city: text('city').notNull(),
  countryCode: text('country_code'),
  basis: text('basis').notNull(),
  currency: text('currency').notNull(),
  fixedAmount: real('fixed_amount'),
  capNights: integer('cap_nights'),
  notes: text('notes'),
  rate1Star: real('rate_1_star'),
  rate2Star: real('rate_2_star'),
  rate3Star: real('rate_3_star'),
  rate4Star: real('rate_4_star'),
  rate5Star: real('rate_5_star'),
});
