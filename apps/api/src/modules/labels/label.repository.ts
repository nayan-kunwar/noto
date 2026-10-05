import { and, eq } from 'drizzle-orm';
import { db, type Db } from '../../db/client.js';
import { labels } from '../../db/schema/index.js';

export async function listLabels(database: Db, userId: string) {
  return database.select().from(labels).where(eq(labels.userId, userId));
}

export async function createLabel(database: Db, userId: string, name: string, color: string | null) {
  const rows = await database.insert(labels).values({ id: crypto.randomUUID(), userId, name, color }).returning();
  const row = rows[0];
  if (!row) throw new Error('Failed to create label');
  return row;
}

export async function renameLabel(database: Db, userId: string, id: string, name: string) {
  const rows = await database
    .update(labels)
    .set({ name, updatedAt: new Date() })
    .where(and(eq(labels.id, id), eq(labels.userId, userId)))
    .returning();
  return rows[0] ?? null;
}

export async function deleteLabel(database: Db, userId: string, id: string) {
  await database.delete(labels).where(and(eq(labels.id, id), eq(labels.userId, userId)));
}

export { db };
