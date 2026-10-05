import type { FastifyInstance, FastifyRequest } from 'fastify';
import { db } from '../../db/client.js';
import { AuthService, AuthError } from './auth.service.js';

function service(app: FastifyInstance): AuthService {
  return new AuthService(
    db,
    (payload, expiresIn) => app.jwt.sign(payload, { expiresIn }),
    (payload, expiresIn) => app.jwt.sign(payload, { expiresIn }),
  );
}

function toError(e: unknown): { status: number; code: string; message: string } {
  if (e instanceof AuthError) return { status: e.status, code: e.code, message: e.message };
  if (e instanceof Error) return { status: 400, code: 'VALIDATION_ERROR', message: e.message };
  return { status: 500, code: 'INTERNAL_ERROR', message: 'Unknown error' };
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post('/register', async (req, reply) => {
    try {
      const body = req.body as { email: string; password: string };
      const result = await service(app).register(body.email, body.password);
      return reply.status(201).send({ success: true, data: result, error: null });
    } catch (e) {
      const err = toError(e);
      return reply.status(err.status).send({ success: false, data: null, error: { code: err.code, message: err.message } });
    }
  });

  app.post('/login', async (req, reply) => {
    try {
      const body = req.body as { email: string; password: string };
      const result = await service(app).login(body.email, body.password);
      return reply.send({ success: true, data: result, error: null });
    } catch (e) {
      const err = toError(e);
      return reply.status(err.status).send({ success: false, data: null, error: { code: err.code, message: err.message } });
    }
  });

  app.post('/refresh', async (req, reply) => {
    try {
      const body = req.body as { refreshToken: string };
      const tokens = await service(app).refresh(body.refreshToken);
      return reply.send({ success: true, data: tokens, error: null });
    } catch (e) {
      const err = toError(e);
      return reply.status(err.status).send({ success: false, data: null, error: { code: err.code, message: err.message } });
    }
  });

  app.get('/me', { preHandler: [app.authenticate] }, async (req: FastifyRequest, reply) => {
    try {
      const userId = (req.user as { sub: string }).sub;
      const user = await service(app).me(userId);
      return reply.send({ success: true, data: user, error: null });
    } catch (e) {
      const err = toError(e);
      return reply.status(err.status).send({ success: false, data: null, error: { code: err.code, message: err.message } });
    }
  });
}
