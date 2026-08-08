import Database from 'better-sqlite3';
import path from 'path';

// SQLite file lives next to the repo root by default; override with
// DATABASE_PATH for tests or alternate deployments. Gitignored (*.sqlite).
const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data.sqlite');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    municipality TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  municipality: string;
  created_at: string;
}
