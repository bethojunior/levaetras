import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
/** @type {import('node:sqlite').DatabaseSync | undefined} */
let database;
export function getDatabase() {
  if (database) return database;
  const path = resolve(
    /* turbopackIgnore: true */ process.env.DATABASE_PATH ||
      "./data/paritins.sqlite",
  );
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  database = new DatabaseSync(path);
  database.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, username TEXT NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS login_limits (key TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, excerpt TEXT NOT NULL, body TEXT NOT NULL, cover TEXT NOT NULL DEFAULT '', cover_alt TEXT NOT NULL DEFAULT '', author TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('draft','published')), seo_title TEXT NOT NULL DEFAULT '', seo_description TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, published_at TEXT, revision INTEGER NOT NULL DEFAULT 1);
    CREATE INDEX IF NOT EXISTS posts_public ON posts(status, published_at);
  `);
  return database;
}
