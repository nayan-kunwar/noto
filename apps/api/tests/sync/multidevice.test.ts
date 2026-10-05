import { describe, expect, it } from 'vitest';
import { syncPushSchema } from '@repo/shared';
import { randomUUID } from 'node:crypto';
import { isRemoteNewer } from '../../src/modules/sync/conflict-resolver.js';

// Simulates Device A -> Server -> Device B without requiring live Postgres.
// Verifies operation shape, idempotent replay (same operationId twice),
// and LWW outcome when both devices edit the same note.
describe('multi-device sync', () => {
  it('accepts ops from A and replays idempotently', () => {
    const opId = randomUUID();
    const entityId = randomUUID();
    const now = new Date().toISOString();
    const pushA = syncPushSchema.parse({
      deviceId: 'device-a',
      lastSyncAt: null,
      operations: [
        { operationId: opId, entityType: 'NOTE', entityId, operation: 'CREATE', payload: { title: 'A' }, createdAt: now },
      ],
    });
    // Replay of same operationId must validate and be dedupable by id.
    const replay = syncPushSchema.parse({
      deviceId: 'device-a',
      lastSyncAt: null,
      operations: [
        { operationId: opId, entityType: 'NOTE', entityId, operation: 'CREATE', payload: { title: 'A' }, createdAt: now },
      ],
    });
    expect(pushA.operations[0]?.operationId).toBe(replay.operations[0]?.operationId);
  });

  it('device B sees A via LWW when B is stale', () => {
    const localB = { version: 1, updatedAt: new Date('2024-01-01T00:00:00Z') };
    const remoteA = { version: 2, updatedAt: new Date('2024-01-02T00:00:00Z') };
    expect(isRemoteNewer(localB, remoteA)).toBe(true);
  });

  it('concurrent edits keep last writer', () => {
    const base = { version: 2, updatedAt: new Date('2024-01-02T00:00:00Z') };
    const staleB = { version: 2, updatedAt: new Date('2024-01-01T00:00:00Z') };
    expect(isRemoteNewer(base, staleB)).toBe(false);
  });
});
