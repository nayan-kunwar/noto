import type { SyncEntityType, SyncOperationType } from '../enums/index.js';

export interface SyncOperation {
  operationId: string;
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperationType;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface SyncPushRequest {
  deviceId: string;
  lastSyncAt: string | null;
  operations: SyncOperation[];
}

export interface SyncPullChange {
  entityType: SyncEntityType;
  entityId: string;
  data: Record<string, unknown>;
  updatedAt: string;
  version: number;
  deletedAt: string | null;
}

export interface SyncResponse {
  acceptedOperations: string[];
  changes: SyncPullChange[];
  serverTime: string;
}

export interface Label {
  id: string;
  name: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}
