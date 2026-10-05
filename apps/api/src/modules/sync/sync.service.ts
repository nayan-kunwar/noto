import { syncPushSchema, type SyncPushInput } from '@repo/shared';
import { db } from '../../db/client.js';
import { notes } from '../../db/schema/index.js';
import { and, eq, gt } from 'drizzle-orm';
import { hasOperation, recordOperation } from './sync.repository.js';
import { getNote } from '../notes/note.repository.js';
import { isRemoteNewer } from './conflict-resolver.js';

function toDate(v: string | Date): Date {
  return v instanceof Date ? v : new Date(v);
}

export const syncService = {
  async pushPull(userId: string, input: SyncPushInput) {
    const parsed = syncPushSchema.parse(input);
    const accepted: string[] = [];
    const lastSync = parsed.lastSyncAt ? new Date(parsed.lastSyncAt) : null;

    for (const op of parsed.operations) {
      if (await hasOperation(db, op.operationId)) {
        accepted.push(op.operationId);
        continue;
      }
      await recordOperation(db, {
        operationId: op.operationId,
        userId,
        deviceId: parsed.deviceId,
        entityType: op.entityType,
        entityId: op.entityId,
        operation: op.operation,
        payload: op.payload,
      });
      accepted.push(op.operationId);

      if (op.entityType === 'NOTE') {
        const p = op.payload as Record<string, unknown>;
        if (op.operation === 'CREATE') {
          const existing = await getNote(db, userId, op.entityId);
          if (!existing) {
            await db.insert(notes).values({
              id: op.entityId,
              userId,
              title: String(p['title'] ?? ''),
              content: String(p['content'] ?? ''),
              type: String(p['type'] ?? 'TEXT'),
              color: String(p['color'] ?? 'default'),
              isPinned: Boolean(p['isPinned'] ?? false),
              isArchived: Boolean(p['isArchived'] ?? false),
              updatedAt: p['updatedAt'] ? toDate(String(p['updatedAt'])) : new Date(),
              version: Number(p['version'] ?? 1),
            });
          }
        } else if (op.operation === 'UPDATE') {
          const existing = await getNote(db, userId, op.entityId);
          if (existing && !existing.deletedAt) {
            const remoteVersion = Number(p['version'] ?? existing.version);
            const remoteUpdated = p['updatedAt'] ? toDate(String(p['updatedAt'])) : new Date();
            if (isRemoteNewer({ version: existing.version, updatedAt: existing.updatedAt }, { version: remoteVersion, updatedAt: remoteUpdated })) {
              await db
                .update(notes)
                .set({
                  title: p['title'] !== undefined ? String(p['title']) : existing.title,
                  content: p['content'] !== undefined ? String(p['content']) : existing.content,
                  color: p['color'] !== undefined ? String(p['color']) : existing.color,
                  isPinned: p['isPinned'] !== undefined ? Boolean(p['isPinned']) : existing.isPinned,
                  isArchived: p['isArchived'] !== undefined ? Boolean(p['isArchived']) : existing.isArchived,
                  updatedAt: remoteUpdated,
                  version: remoteVersion,
                })
                .where(and(eq(notes.id, op.entityId), eq(notes.userId, userId)));
            }
          }
        } else if (op.operation === 'DELETE') {
          const existing = await getNote(db, userId, op.entityId);
          if (existing && !existing.deletedAt) {
            await db
              .update(notes)
              .set({ deletedAt: new Date(), updatedAt: new Date(), version: existing.version + 1 })
              .where(and(eq(notes.id, op.entityId), eq(notes.userId, userId)));
          }
        }
      }
    }

    const changes = lastSync
      ? await db.select().from(notes).where(and(eq(notes.userId, userId), gt(notes.updatedAt, lastSync)))
      : await db.select().from(notes).where(eq(notes.userId, userId));

    return {
      acceptedOperations: accepted,
      changes: changes.map((n) => ({
        entityType: 'NOTE' as const,
        entityId: n.id,
        data: { ...n },
        updatedAt: n.updatedAt instanceof Date ? n.updatedAt.toISOString() : String(n.updatedAt),
        version: n.version,
        deletedAt: n.deletedAt ? (n.deletedAt instanceof Date ? n.deletedAt.toISOString() : String(n.deletedAt)) : null,
      })),
      serverTime: new Date().toISOString(),
    };
  },
};
