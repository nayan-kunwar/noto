import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function errorHandler(error: FastifyError, _req: FastifyRequest, reply: FastifyReply): void {
  const status = error.statusCode ?? 500;
  const code = (error as { code?: string }).code ?? 'INTERNAL_ERROR';
  void reply.status(status).send({
    success: false,
    data: null,
    error: { code, message: error.message },
  });
}
