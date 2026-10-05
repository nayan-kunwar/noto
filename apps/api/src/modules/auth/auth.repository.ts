import { createHash, randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { refreshTokens, users } from '../../db/schema/index.js';

export type DbClient = typeof db;

export async function findUserByEmail(database: DbClient, email: string) {
  const rows = await database.select().from(users).where(eq(users.email, email));
  return rows[0] ?? null;
}

export async function findUserById(database: DbClient, id: string) {
  const rows = await database.select().from(users).where(eq(users.id, id));
  return rows[0] ?? null;
}

export async function createUser(database: DbClient, email: string, passwordHash: string) {
  const rows = await database.insert(users).values({ email, passwordHash }).returning();
  const row = rows[0];
  if (!row) throw new Error('Failed to create user');
  return row;
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function storeRefreshToken(database: DbClient, userId: string, token: string, expiresAt: Date) {
  await database.insert(refreshTokens).values({
    id: randomUUID(),
    userId,
    tokenHash: hashRefreshToken(token),
    expiresAt,
  });
}

export async function findRefreshToken(database: DbClient, token: string) {
  const rows = await database
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.tokenHash, hashRefreshToken(token)));
  return rows[0] ?? null;
}

export async function revokeRefreshToken(database: DbClient, token: string) {
  const { eq: eqFn } = await import('drizzle-orm');
  await database
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eqFn(refreshTokens.tokenHash, hashRefreshToken(token)));
}
