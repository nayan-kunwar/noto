import type { FastifyReply, FastifyRequest } from 'fastify';
import { noteService } from './note.service.js';

// Thin controllers: routes delegate here, logic lives in note.service.ts.
export async function listNotesController(req: FastifyRequest, _reply: FastifyReply) {
  const userId = (req.user as { sub: string }).sub;
  const data = await noteService.list(userId);
  return { success: true, data, error: null };
}
