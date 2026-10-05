import { db } from '../db/client';
import { syncQueue } from '../db/schema';
import type { SyncOperation } from '@repo/shared';

export async function getPendingOperations(): Promise<SyncOperation[]> {
  const rows = await db.select().from(syncQueue);
  return rows.map((r) => ({
    operationId: r.operationId,
    entityType: r.entityType as SyncOperation['entityType'],
    entityId: r.entityId,
    operation: r.operation as SyncOperation['operation'],
    payload: JSON.parse(r.payload as string) as Record<string, unknown>,
    createdAt: r.createdAt,
  }));
}

export async function clearOperations(operationIds: string[]): Promise<void> {
  const { inArray } = await import('drizzle-orm');
  if (operationIds.length === 0) return;
  await db.delete(syncQueue).where(inArray(syncQueue.operationId, operationIds));
}
