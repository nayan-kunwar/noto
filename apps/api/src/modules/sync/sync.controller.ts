import type { FastifyRequest } from 'fastify';
import { syncService } from './sync.service.js';

// Thin controller: LWW + idempotency live in sync.service.ts / conflict-resolver.ts.
export async function syncController(req: FastifyRequest) {
  const userId = (req.user as { sub: string }).sub;
  const data = await syncService.pushPull(userId, req.body as never);
  return { success: true, data, error: null };
}
