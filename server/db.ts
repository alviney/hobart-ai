import type { DatabaseSync as DatabaseSyncT } from 'node:sqlite';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { seed } from './seed';

// Loaded at runtime: Node's built-in SQLite isn't known to the test bundler yet.
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite') as typeof import('node:sqlite');

export type DB = DatabaseSyncT;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS stations (
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
);
CREATE TABLE IF NOT EXISTS docs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station_id TEXT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id TEXT NOT NULL REFERENCES users(id),
  station_id TEXT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('all', 'urgent')),
  via TEXT NOT NULL CHECK (via IN ('email', 'ai', 'webhook', 'sms')),
  paused INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, station_id)
);
CREATE TABLE IF NOT EXISTS pings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station_id TEXT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  urgent INTEGER NOT NULL DEFAULT 0,
  title TEXT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS pings_by_station ON pings(station_id, created_at);
CREATE TABLE IF NOT EXISTS reads (
  user_id TEXT NOT NULL,
  ping_id INTEGER NOT NULL REFERENCES pings(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, ping_id)
);
`;

export function openDb(file: string): DB {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA);
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number };
  if (n === 0) seed(db);
  return db;
}

/** Wipe everything and load the sample data again. */
export function resetDb(db: DB): void {
  db.exec('DELETE FROM reads; DELETE FROM pings; DELETE FROM subscriptions; DELETE FROM docs; DELETE FROM stations; DELETE FROM users;');
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('pings', 'docs');");
  seed(db);
}
