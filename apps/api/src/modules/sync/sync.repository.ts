import { eq } from 'drizzle-orm';
import type { Db } from '../../db/client.js';
import { syncOperations } from '../../db/schema/index.js';

export async function hasOperation(database: Db, operationId: string): Promise<boolean> {
  const rows = await database.select().from(syncOperations).where(eq(syncOperations.operationId, operationId));
  return rows.length > 0;
}

export async function recordOperation(
  database: Db,
  input: {
    operationId: string;
    userId: string;
    deviceId: string;
    entityType: string;
    entityId: string;
    operation: string;
    payload: unknown;
  },
): Promise<void> {
  await database.insert(syncOperations).values({
    operationId: input.operationId,
    userId: input.userId,
    deviceId: input.deviceId,
    entityType: input.entityType,
    entityId: input.entityId,
    operation: input.operation,
    payload: input.payload as never,
  });
}
