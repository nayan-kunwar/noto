import type { FastifyInstance } from 'fastify';
import { labelService } from './label.service.js';

export async function labelRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', app.authenticate);

  app.get('/', async (req) => {
    const userId = (req.user as { sub: string }).sub;
    const data = await labelService.list(userId);
    return { success: true, data, error: null };
  });

  app.post('/', async (req, reply) => {
    try {
      const userId = (req.user as { sub: string }).sub;
      const data = await labelService.create(userId, req.body);
      return reply.status(201).send({ success: true, data, error: null });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid input';
      return reply.status(400).send({ success: false, data: null, error: { code: 'INVALID_INPUT', message } });
    }
  });

  app.patch('/:id', async (req, reply) => {
    const userId = (req.user as { sub: string }).sub;
    const { id } = req.params as { id: string };
    const data = await labelService.rename(userId, id, req.body);
    if (!data) {
      return reply.status(404).send({ success: false, data: null, error: { code: 'LABEL_NOT_FOUND', message: 'Label not found' } });
    }
    return { success: true, data, error: null };
  });

  app.delete('/:id', async (req) => {
    const userId = (req.user as { sub: string }).sub;
    const { id } = req.params as { id: string };
    await labelService.remove(userId, id);
    return { success: true, data: { id }, error: null };
  });
}
