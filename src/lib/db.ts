// Database connection factory — creates a Drizzle client per request via Hyperdrive
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './db-schema';

const { Pool } = pg;

export function createDb(connectionString: string) {
  const pool = new Pool({
    connectionString,
    max: 1,
  });
  return drizzle(pool, { schema });
}

export type Database = ReturnType<typeof createDb>;
