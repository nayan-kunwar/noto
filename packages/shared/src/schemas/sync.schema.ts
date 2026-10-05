import { z } from 'zod';
import { SyncEntityType, SyncOperationType } from '../enums/index.js';

export const syncOperationSchema = z.object({
  operationId: z.string().uuid(),
  entityType: z.nativeEnum(SyncEntityType),
  entityId: z.string().uuid(),
  operation: z.nativeEnum(SyncOperationType),
  payload: z.record(z.unknown()),
  createdAt: z.string().datetime(),
});

export const syncPushSchema = z.object({
  deviceId: z.string().min(1).max(255),
  lastSyncAt: z.string().datetime().nullable(),
  operations: z.array(syncOperationSchema).max(500),
});

export type SyncPushInput = z.infer<typeof syncPushSchema>;
