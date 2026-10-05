import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

const expoDb = openDatabaseSync('noto.db');

export const db = drizzle(expoDb, { schema });
export type MobileDb = typeof db;

export async function initDb(): Promise<void> {
  // Phase 2: ensure tables exist for dev. Phase 3 replaces with Drizzle migrations.
  await expoDb.execAsync(
    `CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '', type TEXT NOT NULL DEFAULT 'TEXT',
      color TEXT NOT NULL DEFAULT 'default',
      is_pinned INTEGER NOT NULL DEFAULT 0, is_archived INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT,
      version INTEGER NOT NULL DEFAULT 1, sync_status TEXT NOT NULL DEFAULT 'PENDING'
    );
    CREATE TABLE IF NOT EXISTS checklist_items (
      id TEXT PRIMARY KEY, note_id TEXT NOT NULL REFERENCES notes(id),
      text TEXT NOT NULL DEFAULT '', is_completed INTEGER NOT NULL DEFAULT 0,
      position INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS labels (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL,
      color TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS note_labels (
      note_id TEXT NOT NULL REFERENCES notes(id), label_id TEXT NOT NULL REFERENCES labels(id)
    );
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT, operation_id TEXT NOT NULL UNIQUE,
      entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, operation TEXT NOT NULL,
      payload TEXT NOT NULL, created_at TEXT NOT NULL,
      retry_count INTEGER NOT NULL DEFAULT 0, last_error TEXT
    );`,
  );
}
