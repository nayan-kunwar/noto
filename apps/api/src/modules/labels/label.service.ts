import { z } from 'zod';
import { db } from '../../db/client.js';
import { createLabel, deleteLabel, listLabels, renameLabel } from './label.repository.js';

const createSchema = z.object({ name: z.string().min(1).max(100), color: z.string().max(32).nullable().optional() });

export const labelService = {
  list: (userId: string) => listLabels(db, userId),
  create: (userId: string, input: unknown) => {
    const parsed = createSchema.parse(input);
    return createLabel(db, userId, parsed.name, parsed.color ?? null);
  },
  rename: (userId: string, id: string, input: unknown) => {
    const parsed = z.object({ name: z.string().min(1).max(100) }).parse(input);
    return renameLabel(db, userId, id, parsed.name);
  },
  remove: (userId: string, id: string) => deleteLabel(db, userId, id),
};
