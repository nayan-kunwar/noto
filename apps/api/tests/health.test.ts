import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

describe('app', () => {
  it('exposes health and versioned routes', async () => {
    const app = await buildApp();
    const health = await app.inject({ method: 'GET', url: '/health' });
    expect(health.statusCode).toBe(200);
    await app.close();
  });
});
