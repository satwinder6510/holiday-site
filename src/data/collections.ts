// SSG collection data — imports listed holidays to filter active collections
// For SSR pages, use collections-static.ts directly instead

import { listedHolidays } from './holidays';
import { allCollections } from './collections-static';
export type { Collection } from './collections-static';

/**
 * Set of tags that exist on at least one published holiday.
 *
 * River Cruises is always in: it is a permanent section with its own landing
 * page, and its offers live in D1 rather than in this build-time data, so
 * counting them here is not possible. Leaving it to chance would have worked
 * today (30 hand-built packages carry the tag) and silently dropped the
 * collection the day the last one was retired.
 */
const activeTags = new Set([...listedHolidays.flatMap(h => h.tags), 'River Cruise']);

/** Only collections that have at least one published holiday with a matching tag. */
export const collections: Collection[] = allCollections.filter(c => activeTags.has(c.tag));
