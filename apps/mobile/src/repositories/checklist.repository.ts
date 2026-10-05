import { asc, eq } from 'drizzle-orm';
import { db } from '../db/client';
import { checklistItems } from '../db/schema';
import { newId } from '../utils/uuid';
import { nowIso } from '../utils/dates';
import { enqueue } from './sync.repository';

export type ChecklistRow = typeof checklistItems.$inferSelect;

export const checklistRepository = {
  async listByNote(noteId: string): Promise<ChecklistRow[]> {
    return db
      .select()
      .from(checklistItems)
      .where(eq(checklistItems.noteId, noteId))
      .orderBy(asc(checklistItems.position));
  },

  async add(noteId: string, text: string): Promise<ChecklistRow> {
    const existing = await this.listByNote(noteId);
    const now = nowIso();
    const row: ChecklistRow = {
      id: newId(),
      noteId,
      text,
      isCompleted: false,
      position: existing.length,
      createdAt: now,
      updatedAt: now,
    };
    await db.insert(checklistItems).values(row);
    await enqueue('CHECKLIST_ITEM', row.id, 'CREATE', { ...row });
    return row;
  },

  async toggle(id: string): Promise<void> {
    const rows = await db.select().from(checklistItems).where(eq(checklistItems.id, id));
    const row = rows[0];
    if (!row) return;
    const next = { ...row, isCompleted: !row.isCompleted, updatedAt: nowIso() };
    await db.update(checklistItems).set(next).where(eq(checklistItems.id, id));
    await enqueue('CHECKLIST_ITEM', id, 'UPDATE', { ...next });
  },

  async updateText(id: string, text: string): Promise<void> {
    await db.update(checklistItems).set({ text, updatedAt: nowIso() }).where(eq(checklistItems.id, id));
    const rows = await db.select().from(checklistItems).where(eq(checklistItems.id, id));
    if (rows[0]) await enqueue('CHECKLIST_ITEM', id, 'UPDATE', { ...rows[0] });
  },

  async remove(id: string): Promise<void> {
    const rows = await db.select().from(checklistItems).where(eq(checklistItems.id, id));
    await db.delete(checklistItems).where(eq(checklistItems.id, id));
    if (rows[0]) await enqueue('CHECKLIST_ITEM', id, 'DELETE', { ...rows[0] });
  },

  async reorder(noteId: string, orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i += 1) {
      const id = orderedIds[i];
      if (!id) continue;
      await db.update(checklistItems).set({ position: i, updatedAt: nowIso() }).where(eq(checklistItems.id, id));
    }
    void noteId;
  },
};
