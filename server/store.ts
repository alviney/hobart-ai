import { seedStatements } from './seed';

// The database the API talks to. Two versions: Node's built-in SQLite (local
// development and tests, store-node.ts) and Cloudflare D1 (store-d1.ts). Both are
// SQLite, so the SQL is the same; this keeps the API from caring which one it has.
//
// D1's free plan allows 50 queries per request and 100 bound values per query,
// so the API loads what it needs in a few set-based queries, and the seed uses
// multi-row inserts with literal values.

export type Arg = string | number | null;

export interface Db {
  all<T>(sql: string, ...args: Arg[]): Promise<T[]>;
  get<T>(sql: string, ...args: Arg[]): Promise<T | undefined>;
  run(sql: string, ...args: Arg[]): Promise<{ lastId: number; changes: number }>;
  /** Run several statements as one unit (a transaction on Node, a batch on D1). */
  batch(statements: [string, Arg[]][]): Promise<void>;
}

export const SCHEMA: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS stations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short TEXT NOT NULL,
    category TEXT NOT NULL,
    access TEXT NOT NULL CHECK (access IN ('invite', 'public')),
    owner_id TEXT NOT NULL REFERENCES users(id),
    lat REAL,
    lng REAL,
    verified_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS docs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id TEXT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS subscriptions (
    user_id TEXT NOT NULL REFERENCES users(id),
    station_id TEXT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('all', 'urgent')),
    via TEXT NOT NULL CHECK (via IN ('email', 'ai', 'webhook', 'sms')),
    paused INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, station_id)
  )`,
  `CREATE TABLE IF NOT EXISTS pings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id TEXT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    urgent INTEGER NOT NULL DEFAULT 0,
    title TEXT,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS pings_by_station ON pings(station_id, created_at)`,
  `CREATE TABLE IF NOT EXISTS reads (
    user_id TEXT NOT NULL,
    ping_id INTEGER NOT NULL REFERENCES pings(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, ping_id)
  )`,
];

/** Create the tables if they're missing, and load the sample data into an empty database. */
export async function ensureReady(db: Db): Promise<void> {
  await db.batch(SCHEMA.map((s) => [s, []]));
  const row = await db.get<{ n: number }>('SELECT COUNT(*) AS n FROM users');
  if (!row || row.n === 0) await db.batch(seedStatements());
}

/** Wipe everything and load the sample data again. */
export async function resetStore(db: Db): Promise<void> {
  await db.batch([
    ['DELETE FROM reads', []], ['DELETE FROM pings', []], ['DELETE FROM subscriptions', []],
    ['DELETE FROM docs', []], ['DELETE FROM stations', []], ['DELETE FROM users', []],
    ...seedStatements(),
  ]);
}
