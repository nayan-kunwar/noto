import { describe, expect, it } from 'vitest';
import { isRemoteNewer } from '../../src/modules/sync/conflict-resolver.js';

describe('conflict resolver (LWW)', () => {
  it('higher version wins', () => {
    expect(isRemoteNewer({ version: 1, updatedAt: new Date() }, { version: 2, updatedAt: new Date(0) })).toBe(true);
    expect(isRemoteNewer({ version: 2, updatedAt: new Date() }, { version: 1, updatedAt: new Date() })).toBe(false);
  });

  it('newer timestamp wins on equal version', () => {
    const oldT = new Date('2024-01-01T00:00:00Z');
    const newT = new Date('2024-01-02T00:00:00Z');
    expect(isRemoteNewer({ version: 1, updatedAt: oldT }, { version: 1, updatedAt: newT })).toBe(true);
    expect(isRemoteNewer({ version: 1, updatedAt: newT }, { version: 1, updatedAt: oldT })).toBe(false);
  });
});
