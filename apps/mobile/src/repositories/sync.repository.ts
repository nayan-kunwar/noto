import { db } from '../db/client';
import { syncQueue } from '../db/schema';
import { newId } from '../utils/uuid';
import { nowIso } from '../utils/dates';

export type SyncOp = 'CREATE' | 'UPDATE' | 'DELETE';
export type SyncEntity = 'NOTE' | 'CHECKLIST_ITEM' | 'LABEL';

export async function enqueue(
  entityType: SyncEntity,
  entityId: string,
  operation: SyncOp,
  payload: Record<string, unknown>,
): Promise<void> {
  await db.insert(syncQueue).values({
    operationId: newId(),
    entityType,
    entityId,
    operation,
    payload: JSON.stringify(payload),
    createdAt: nowIso(),
    retryCount: 0,
    lastError: null,
  });
}

export async function listPending(): Promise<(typeof syncQueue.$inferSelect)[]> {
  return db.select().from(syncQueue);
}

export async function removeByOperationId(operationId: string): Promise<void> {
  const { eq } = await import('drizzle-orm');
  await db.delete(syncQueue).where(eq(syncQueue.operationId, operationId));
}

export async function incrementRetry(operationId: string, message: string): Promise<void> {
  const { eq } = await import('drizzle-orm');
  const rows = await db.select().from(syncQueue).where(eq(syncQueue.operationId, operationId));
  const row = rows[0];
  if (!row) return;
  await db
    .update(syncQueue)
    .set({ retryCount: row.retryCount + 1, lastError: message })
    .where(eq(syncQueue.operationId, operationId));
}
