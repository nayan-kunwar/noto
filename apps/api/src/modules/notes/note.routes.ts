import type { FastifyInstance } from 'fastify';
import { noteService } from './note.service.js';

export async function noteRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', app.authenticate);

  app.get('/', async (req) => {
    const userId = (req.user as { sub: string }).sub;
    const data = await noteService.list(userId);
    return { success: true, data, error: null };
  });

  app.get('/:id', async (req, reply) => {
    const userId = (req.user as { sub: string }).sub;
    const { id } = req.params as { id: string };
    const note = await noteService.get(userId, id);
    if (!note || note.deletedAt) {
      return reply.status(404).send({ success: false, data: null, error: { code: 'NOTE_NOT_FOUND', message: 'Note not found' } });
    }
    return { success: true, data: note, error: null };
  });

  app.post('/', async (req, reply) => {
    try {
      const userId = (req.user as { sub: string }).sub;
      const data = await noteService.create(userId, req.body);
      return reply.status(201).send({ success: true, data, error: null });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid input';
      return reply.status(400).send({ success: false, data: null, error: { code: 'INVALID_INPUT', message } });
    }
  });

  app.patch('/:id', async (req, reply) => {
    try {
      const userId = (req.user as { sub: string }).sub;
      const { id } = req.params as { id: string };
      const data = await noteService.update(userId, id, req.body);
      if (!data) {
        return reply.status(404).send({ success: false, data: null, error: { code: 'NOTE_NOT_FOUND', message: 'Note not found' } });
      }
      return { success: true, data, error: null };
    } catch (e) {
      const err = e as { status?: number; code?: string; message?: string };
      if (err.code === 'VERSION_CONFLICT') {
        return reply.status(409).send({ success: false, data: null, error: { code: 'VERSION_CONFLICT', message: 'Version conflict' } });
      }
      const message = e instanceof Error ? e.message : 'Invalid input';
      return reply.status(400).send({ success: false, data: null, error: { code: 'INVALID_INPUT', message } });
    }
  });

  app.delete('/:id', async (req, reply) => {
    const userId = (req.user as { sub: string }).sub;
    const { id } = req.params as { id: string };
    const data = await noteService.remove(userId, id);
    if (!data) {
      return reply.status(404).send({ success: false, data: null, error: { code: 'NOTE_NOT_FOUND', message: 'Note not found' } });
    }
    return { success: true, data: { id }, error: null };
  });
}
