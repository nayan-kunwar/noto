import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../../src/utils/password.js';

describe('password', () => {
  it('hashes and verifies', async () => {
    const hash = await hashPassword('correct-horse-123');
    expect(await verifyPassword(hash, 'correct-horse-123')).toBe(true);
    expect(await verifyPassword(hash, 'wrong')).toBe(false);
  }, 15000);
});
