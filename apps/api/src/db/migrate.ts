import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './client.js';

const here = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = join(here, '../../drizzle/migrations');

async function main(): Promise<void> {
  await migrate(db, { migrationsFolder });
  console.log(`Migrations applied from ${migrationsFolder}`);
  await pool.end();
}

void main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
