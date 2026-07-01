import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "takphoto.db");

// Reuse a single connection across hot reloads in dev.
const g = globalThis as unknown as { __takDb?: DatabaseSync };

function init(): DatabaseSync {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const conn = new DatabaseSync(DB_PATH);
  conn.exec("PRAGMA journal_mode = WAL;");
  conn.exec("PRAGMA foreign_keys = ON;");
  // Next's build spawns multiple workers that each open this connection.
  conn.exec("PRAGMA busy_timeout = 5000;");
  conn.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      size_label TEXT NOT NULL,
      duration_min INTEGER NOT NULL,
      price_cents INTEGER NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      specs TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT NOT NULL UNIQUE,
      service_id INTEGER NOT NULL REFERENCES services(id),
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      date TEXT NOT NULL,
      start_min INTEGER NOT NULL,
      end_min INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Single shared photo station: overlap is detected across ALL services by date.
    CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (date);
  `);

  return conn;
}

export const db = g.__takDb ?? (g.__takDb = init());

/** Typed query helpers — node:sqlite returns loosely-typed rows. */
export function all<T>(sql: string, ...params: any[]): T[] {
  return db.prepare(sql).all(...params) as unknown as T[];
}
export function get<T>(sql: string, ...params: any[]): T | undefined {
  return db.prepare(sql).get(...params) as unknown as T | undefined;
}

/** Run a function inside a transaction; rolls back on throw. */
export function tx<T>(fn: () => T): T {
  db.exec("BEGIN");
  try {
    const out = fn();
    db.exec("COMMIT");
    return out;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
