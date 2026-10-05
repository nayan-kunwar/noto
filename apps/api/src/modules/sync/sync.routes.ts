import type { FastifyInstance } from 'fastify';
import { syncService } from './sync.service.js';

export async function syncRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', app.authenticate);
  app.post('/', async (req, reply) => {
    try {
      const userId = (req.user as { sub: string }).sub;
      const data = await syncService.pushPull(userId, req.body as never);
      return { success: true, data, error: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid sync payload';
      return reply.status(400).send({ success: false, data: null, error: { code: 'INVALID_SYNC', message } });
    }
  });
}
