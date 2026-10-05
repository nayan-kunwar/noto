import type { FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyInstance } from 'fastify';
import { db } from '../../db/client.js';
import { AuthService } from './auth.service.js';

function svc(app: FastifyInstance): AuthService {
  return new AuthService(
    db,
    (payload, expiresIn) => app.jwt.sign(payload, { expiresIn }),
    (payload, expiresIn) => app.jwt.sign(payload, { expiresIn }),
  );
}

// Thin controllers: validate/shape only, business logic in AuthService.
export async function registerController(app: FastifyInstance, req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as { email: string; password: string };
  const result = await svc(app).register(body.email, body.password);
  return reply.status(201).send({ success: true, data: result, error: null });
}

export async function loginController(app: FastifyInstance, req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as { email: string; password: string };
  const result = await svc(app).login(body.email, body.password);
  return reply.send({ success: true, data: result, error: null });
}
