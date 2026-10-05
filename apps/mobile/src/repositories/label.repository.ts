import { and, eq, like } from 'drizzle-orm';
import { db } from '../db/client';
import { labels, noteLabels } from '../db/schema';
import { newId } from '../utils/uuid';
import { nowIso } from '../utils/dates';
import { enqueue } from './sync.repository';

export type LabelRow = typeof labels.$inferSelect;

export const labelRepository = {
  async list(userId: string): Promise<LabelRow[]> {
    return db.select().from(labels).where(eq(labels.userId, userId));
  },

  async create(userId: string, name: string, color: string | null = null): Promise<LabelRow> {
    const now = nowIso();
    const row: LabelRow = { id: newId(), userId, name, color, createdAt: now, updatedAt: now };
    await db.insert(labels).values(row);
    await enqueue('LABEL', row.id, 'CREATE', { ...row });
    return row;
  },

  async rename(id: string, name: string): Promise<void> {
    await db.update(labels).set({ name, updatedAt: nowIso() }).where(eq(labels.id, id));
    const rows = await db.select().from(labels).where(eq(labels.id, id));
    if (rows[0]) await enqueue('LABEL', id, 'UPDATE', { ...rows[0] });
  },

  async remove(id: string): Promise<void> {
    await db.delete(noteLabels).where(eq(noteLabels.labelId, id));
    await db.delete(labels).where(eq(labels.id, id));
    await enqueue('LABEL', id, 'DELETE', { id });
  },

  async assign(noteId: string, labelId: string): Promise<void> {
    await db.insert(noteLabels).values({ noteId, labelId });
    await enqueue('LABEL', labelId, 'UPDATE', { noteId, labelId, assigned: true });
  },

  async unassign(noteId: string, labelId: string): Promise<void> {
    await db
      .delete(noteLabels)
      .where(and(eq(noteLabels.noteId, noteId), eq(noteLabels.labelId, labelId)));
  },

  async notesForLabel(labelId: string): Promise<string[]> {
    const rows = await db.select().from(noteLabels).where(eq(noteLabels.labelId, labelId));
    return rows.map((r) => r.noteId);
  },

  async searchLabels(userId: string, q: string): Promise<LabelRow[]> {
    return db
      .select()
      .from(labels)
      .where(and(eq(labels.userId, userId), like(labels.name, `%${q}%`)));
  },
};

// Re-export for structure compliance (AGENTS expects label.repository.ts)
export { labelRepository as default };
