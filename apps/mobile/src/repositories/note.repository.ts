import { and, desc, eq, isNull, like, or } from 'drizzle-orm';
import { db } from '../db/client';
import { notes, type LocalNote } from '../db/schema';
import { newId } from '../utils/uuid';
import { nowIso } from '../utils/dates';
import { enqueue } from './sync.repository';

export interface CreateNoteInput {
  title?: string;
  content?: string;
  type?: string;
  color?: string;
  userId: string;
}

export interface UpdateNotePatch {
  title?: string;
  content?: string;
  color?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  type?: string;
}

function toSyncPayload(note: LocalNote): Record<string, unknown> {
  return { ...note };
}

export const noteRepository = {
  async create(input: CreateNoteInput): Promise<LocalNote> {
    const now = nowIso();
    const row: LocalNote = {
      id: newId(),
      userId: input.userId,
      title: input.title ?? '',
      content: input.content ?? '',
      type: input.type ?? 'TEXT',
      color: input.color ?? 'default',
      isPinned: false,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      version: 1,
      syncStatus: 'PENDING',
    };
    await db.insert(notes).values(row);
    await enqueue('NOTE', row.id, 'CREATE', toSyncPayload(row));
    return row;
  },

  async findById(id: string): Promise<LocalNote | null> {
    const rows = await db.select().from(notes).where(eq(notes.id, id));
    const row = rows[0] ?? null;
    if (row && row.deletedAt) return row;
    return row;
  },

  async findAll(userId: string, includeArchived = false): Promise<LocalNote[]> {
    const base = and(eq(notes.userId, userId), isNull(notes.deletedAt));
    const rows = await db
      .select()
      .from(notes)
      .where(base)
      .orderBy(desc(notes.isPinned), desc(notes.updatedAt));
    return includeArchived ? rows : rows.filter((r) => !r.isArchived);
  },

  async findArchived(userId: string): Promise<LocalNote[]> {
    const rows = await this.findAll(userId, true);
    return rows.filter((r) => r.isArchived);
  },

  async search(userId: string, query: string): Promise<LocalNote[]> {
    const q = `%${query}%`;
    return db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.userId, userId),
          isNull(notes.deletedAt),
          or(like(notes.title, q), like(notes.content, q)),
        ),
      )
      .orderBy(desc(notes.updatedAt));
  },

  async update(id: string, patch: UpdateNotePatch): Promise<LocalNote | null> {
    const existing = await this.findById(id);
    if (!existing || existing.deletedAt) return null;
    const now = nowIso();
    const next: LocalNote = {
      ...existing,
      ...patch,
      type: patch.type ?? existing.type,
      updatedAt: now,
      version: existing.version + 1,
      syncStatus: 'PENDING',
    };
    await db.update(notes).set(next).where(eq(notes.id, id));
    await enqueue('NOTE', id, 'UPDATE', toSyncPayload(next));
    return next;
  },

  async togglePin(id: string): Promise<LocalNote | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    return this.update(id, { isPinned: !existing.isPinned });
  },

  async toggleArchive(id: string): Promise<LocalNote | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    return this.update(id, { isArchived: !existing.isArchived });
  },

  async setColor(id: string, color: string): Promise<LocalNote | null> {
    return this.update(id, { color });
  },

  async softDelete(id: string): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) return;
    const now = nowIso();
    const next: LocalNote = {
      ...existing,
      deletedAt: now,
      updatedAt: now,
      version: existing.version + 1,
      syncStatus: 'PENDING',
    };
    await db.update(notes).set(next).where(eq(notes.id, id));
    await enqueue('NOTE', id, 'DELETE', toSyncPayload(next));
  },

  async upsertFromRemote(row: LocalNote): Promise<void> {
    const existing = await this.findById(row.id);
    if (!existing) {
      await db.insert(notes).values({ ...row, syncStatus: 'SYNCED' });
      return;
    }
    // Last-Write-Wins: remote wins only if newer version or newer timestamp.
    if (row.version > existing.version || row.updatedAt > existing.updatedAt) {
      await db
        .update(notes)
        .set({ ...row, syncStatus: 'SYNCED' })
        .where(eq(notes.id, row.id));
    }
  },
};
