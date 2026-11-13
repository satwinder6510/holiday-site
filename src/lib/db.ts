// Database connection factory — creates a Drizzle client per request via D1
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './db-schema';

// Every D1 call MUST settle. On 13 Nov 2026 one /Holidays page load in six hung
// for 35s+ with zero CPU and no logs: a D1 call on some isolates never returned,
// and nothing on the request path had a time limit (the 15s catalogue guard only
// covers the shared build). A read that has not answered in READ_TIMEOUT_MS is
// tried once more; after that the call rejects, so the page falls back or errors
// in seconds instead of hanging until the browser gives up. The log line names
// the query, which is what was missing when this was diagnosed.
const READ_TIMEOUT_MS = 6_000;
const WRITE_TIMEOUT_MS = 15_000;
const READ_METHODS = new Set(['all', 'first', 'raw']);
const WRITE_METHODS = new Set(['run']);

function settle<T>(run: () => Promise<T>, ms: number, what: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`D1 ${what} did not answer within ${ms}ms`)), ms);
    run().then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
  });
}

function guardStatement(stmt: any, sql: string, real: WeakMap<object, any>): any {
  const guarded: any = new Proxy(stmt, {
    get(target, prop) {
      const value = target[prop];
      if (typeof value !== 'function') return value;
      const name = String(prop);
      if (name === 'bind') {
        return (...args: unknown[]) => guardStatement(target.bind(...args), sql, real);
      }
      const label = `${name}: ${sql.slice(0, 120)}`;
      if (READ_METHODS.has(name)) {
        return (...args: unknown[]) =>
          settle(() => target[name](...args), READ_TIMEOUT_MS, label).catch(err => {
            if (!/did not answer within/.test(String(err?.message))) throw err;
            console.error(`${err.message}; retrying once`);
            return settle(() => target[name](...args), READ_TIMEOUT_MS, label).catch(err2 => {
              console.error(`retry failed: ${err2?.message}`);
              throw err2;
            });
          });
      }
      if (WRITE_METHODS.has(name)) {
        return (...args: unknown[]) =>
          settle(() => target[name](...args), WRITE_TIMEOUT_MS, label).catch(err => {
            console.error(String(err?.message));
            throw err;
          });
      }
      return value.bind(target);
    },
  });
  // batch() must be handed the real statements, so keep a way back.
  real.set(guarded, stmt);
  return guarded;
}

/** D1 with a time limit on every statement. */
export function guardD1(d1: D1Database): D1Database {
  const real = new WeakMap<object, any>();
  return new Proxy(d1 as any, {
    get(target, prop) {
      const value = target[prop];
      if (typeof value !== 'function') return value;
      if (prop === 'prepare') {
        return (sql: string) => guardStatement(target.prepare(sql), sql, real);
      }
      if (prop === 'batch') {
        return (stmts: any[]) => {
          const raw = stmts.map(s => real.get(s) ?? s);
          return settle(() => target.batch(raw), WRITE_TIMEOUT_MS, `batch of ${raw.length}`).catch(err => {
            console.error(String(err?.message));
            throw err;
          });
        };
      }
      return value.bind(target);
    },
  }) as D1Database;
}

export function createDb(d1: D1Database) {
  return drizzle(guardD1(d1), { schema });
}

export type Database = ReturnType<typeof createDb>;
