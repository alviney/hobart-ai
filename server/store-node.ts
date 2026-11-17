import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { DatabaseSync } from 'node:sqlite';
import { ensureReady, type Arg, type Db } from './store';

// Loaded at runtime: Node's built-in SQLite isn't known to the test bundler yet.
const sqlite = createRequire(import.meta.url)('node:sqlite') as typeof import('node:sqlite');

/** The store on Node's built-in SQLite: a single file, or ':memory:' for tests. */
export async function openNodeDb(file: string): Promise<Db> {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
  const raw: DatabaseSync = new sqlite.DatabaseSync(file);
  raw.exec('PRAGMA foreign_keys = ON;');
  const db: Db = {
    async all<T>(sql: string, ...args: Arg[]) { return raw.prepare(sql).all(...args) as T[]; },
    async get<T>(sql: string, ...args: Arg[]) { return raw.prepare(sql).get(...args) as T | undefined; },
    async run(sql: string, ...args: Arg[]) {
      const r = raw.prepare(sql).run(...args);
      return { lastId: Number(r.lastInsertRowid), changes: Number(r.changes) };
    },
    async batch(statements: [string, Arg[]][]) {
      raw.exec('BEGIN');
      try {
        for (const [sql, args] of statements) raw.prepare(sql).run(...args);
        raw.exec('COMMIT');
      } catch (e) {
        raw.exec('ROLLBACK');
        throw e;
      }
    },
  };
  await ensureReady(db);
  return db;
}
