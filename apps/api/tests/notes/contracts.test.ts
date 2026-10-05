import { describe, expect, it } from 'vitest';
import { registerSchema, loginSchema, noteSchema, syncPushSchema } from '@repo/shared';
import { randomUUID } from 'node:crypto';

describe('shared contracts', () => {
  it('validates auth input', () => {
    expect(() => registerSchema.parse({ email: 'a@b.com', password: '12345678' })).not.toThrow();
    expect(() => registerSchema.parse({ email: 'bad', password: 'short' })).toThrow();
    expect(() => loginSchema.parse({ email: 'a@b.com', password: '12345678' })).not.toThrow();
  });

  it('validates notes', () => {
    const parsed = noteSchema.parse({ title: 'hi' });
    expect(parsed.type).toBe('TEXT');
  });

  it('validates sync push with operation ids', () => {
    const opId = randomUUID();
    const entityId = randomUUID();
    const parsed = syncPushSchema.parse({
      deviceId: 'device-a',
      lastSyncAt: null,
      operations: [
        { operationId: opId, entityType: 'NOTE', entityId, operation: 'CREATE', payload: {}, createdAt: new Date().toISOString() },
      ],
    });
    expect(parsed.operations).toHaveLength(1);
  });
});
