// Database connection factory — creates a Drizzle client per request via D1
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './db-schema';

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type Database = ReturnType<typeof createDb>;
