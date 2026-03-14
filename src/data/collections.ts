// SSG collection data — imports listed holidays to filter active collections
// For SSR pages, use collections-static.ts directly instead

import { listedHolidays } from './holidays';
import { allCollections } from './collections-static';
export type { Collection } from './collections-static';

/** Set of tags that exist on at least one published holiday. */
const activeTags = new Set(listedHolidays.flatMap(h => h.tags));

/** Only collections that have at least one published holiday with a matching tag. */
export const collections: Collection[] = allCollections.filter(c => activeTags.has(c.tag));
