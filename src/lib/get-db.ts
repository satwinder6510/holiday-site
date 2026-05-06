// Helper to get a DB instance from Astro request context
import type { AstroGlobal } from 'astro';
import { createDb, type Database } from './db';

export function getDb(Astro: AstroGlobal): Database {
  const runtime = (Astro.locals as any).runtime;
  if (!runtime?.env?.DB) {
    throw new Error('DB binding not available — is this page SSR?');
  }
  return createDb(runtime.env.DB);
}
