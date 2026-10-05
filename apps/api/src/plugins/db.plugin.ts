import type { FastifyInstance } from 'fastify';
import { db } from '../db/client.js';

export async function dbPlugin(app: FastifyInstance): Promise<void> {
  app.decorate('db', db);
  app.addHook('onClose', async () => {
    const { pool } = await import('../db/client.js');
    await pool.end();
  });
}
