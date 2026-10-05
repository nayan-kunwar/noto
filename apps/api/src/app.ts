import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { env } from './config/env.js';
import { config } from './config/config.js';
import { dbPlugin } from './plugins/db.plugin.js';
import { rateLimitPlugin } from './middleware/rate-limit.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { noteRoutes } from './modules/notes/note.routes.js';
import { labelRoutes } from './modules/labels/label.routes.js';
import { syncRoutes } from './modules/sync/sync.routes.js';

export async function buildApp() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: env.CORS_ORIGIN });
  await app.register(dbPlugin);
  await app.register(fastifyJwt, { secret: env.JWT_ACCESS_SECRET });
  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({
        success: false,
        data: null,
        error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
      });
    }
  });
  await app.register(rateLimitPlugin);

  app.get('/health', async () => ({ ok: true }));
  await app.register(authRoutes, { prefix: `${config.apiPrefix}/auth` });
  await app.register(noteRoutes, { prefix: `${config.apiPrefix}/notes` });
  await app.register(labelRoutes, { prefix: `${config.apiPrefix}/labels` });
  await app.register(syncRoutes, { prefix: `${config.apiPrefix}/sync` });

  app.setErrorHandler(errorHandler);
  return app;
}
