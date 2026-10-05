import type { FastifyRequest } from 'fastify';
import { labelService } from './label.service.js';

// Thin controllers: routes delegate here, logic lives in label.service.ts.
export async function listLabelsController(req: FastifyRequest) {
  const userId = (req.user as { sub: string }).sub;
  const data = await labelService.list(userId);
  return { success: true, data, error: null };
}
