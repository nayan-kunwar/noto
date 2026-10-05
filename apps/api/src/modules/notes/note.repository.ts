import { and, desc, eq, gt, isNull } from 'drizzle-orm';
import { db, type Db } from '../../db/client.js';
import { notes } from '../../db/schema/index.js';

export type Database = Db;

export async function listNotes(database: Db, userId: string, since?: Date) {
  const filters = [eq(notes.userId, userId), isNull(notes.deletedAt)];
  if (since) filters.push(gt(notes.updatedAt, since));
  return database
    .select()
    .from(notes)
    .where(and(...filters))
    .orderBy(desc(notes.updatedAt));
}

export async function getNote(database: Db, userId: string, id: string) {
  const rows = await database.select().from(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
  return rows[0] ?? null;
}

export async function createNote(
  database: Db,
  userId: string,
  input: { id: string; title: string; content: string; type: string; color: string },
) {
  const rows = await database
    .insert(notes)
    .values({ id: input.id, userId, title: input.title, content: input.content, type: input.type, color: input.color })
    .returning();
  const row = rows[0];
  if (!row) throw new Error('Failed to create note');
  return row;
}

export async function updateNote(
  database: Db,
  userId: string,
  id: string,
  patch: Partial<{ title: string; content: string; color: string; isPinned: boolean; isArchived: boolean }>,
  expectedVersion?: number,
) {
  const existing = await getNote(database, userId, id);
  if (!existing || existing.deletedAt) return null;
  if (expectedVersion !== undefined && existing.version !== expectedVersion) {
    const err = new Error('Version conflict') as Error & { status?: number; code?: string };
    err.status = 409;
    err.code = 'VERSION_CONFLICT';
    throw err;
  }
  const rows = await database
    .update(notes)
    .set({ ...patch, updatedAt: new Date(), version: existing.version + 1 })
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .returning();
  return rows[0] ?? null;
}

export async function softDeleteNote(database: Db, userId: string, id: string) {
  const existing = await getNote(database, userId, id);
  if (!existing) return null;
  const rows = await database
    .update(notes)
    .set({ deletedAt: new Date(), updatedAt: new Date(), version: existing.version + 1 })
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .returning();
  return rows[0] ?? null;
}

export { db };
