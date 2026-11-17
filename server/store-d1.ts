import type { Arg, Db } from './store';

// Minimal shape of the D1 binding we use, so this file needs no Cloudflare type packages.
interface D1Result<T> { results: T[]; meta: { last_row_id?: number; changes?: number } }
interface D1Statement {
  bind(...values: Arg[]): D1Statement;
  all<T>(): Promise<D1Result<T>>;
  first<T>(): Promise<T | null>;
  run(): Promise<D1Result<unknown>>;
}
export interface D1Database {
  prepare(sql: string): D1Statement;
  batch(statements: D1Statement[]): Promise<unknown[]>;
}

/** The store on Cloudflare D1. */
export function d1Db(d1: D1Database): Db {
  const stmt = (sql: string, args: Arg[]) => (args.length ? d1.prepare(sql).bind(...args) : d1.prepare(sql));
  return {
    async all<T>(sql: string, ...args: Arg[]) { return (await stmt(sql, args).all<T>()).results; },
    async get<T>(sql: string, ...args: Arg[]) { return (await stmt(sql, args).first<T>()) ?? undefined; },
    async run(sql: string, ...args: Arg[]) {
      const r = await stmt(sql, args).run();
      return { lastId: Number(r.meta.last_row_id ?? 0), changes: Number(r.meta.changes ?? 0) };
    },
    async batch(statements: [string, Arg[]][]) {
      if (statements.length) await d1.batch(statements.map(([sql, args]) => stmt(sql, args)));
    },
  };
}
