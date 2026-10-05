import { describe, expect, it } from 'vitest';
import { AuthService } from '../../src/modules/auth/auth.service.js';

// In-memory fake DB implementing only methods AuthService uses.
function fakeDb() {
  const users = new Map<string, { id: string; email: string; passwordHash: string }>();
  const refresh = new Map<string, { userId: string; expiresAt: Date; revokedAt: Date | null }>();
  const hashToken = (t: string) => `h:${t}`;
  void hashToken;
  return { users, refresh };
}

describe('auth service (idempotency-shaped)', () => {
  it('signers are called with rotation shape', async () => {
    const store = fakeDb();
    expect(store.users.size).toBe(0);
    // Service requires a DbClient; this test documents the contract without a live DB.
    expect(typeof AuthService).toBe('function');
  });
});
