import { z } from 'zod';
import { db } from '../../db/client.js';
import { createNote, getNote, listNotes, softDeleteNote, updateNote } from './note.repository.js';

const createSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(500).default(''),
  content: z.string().max(100000).default(''),
  type: z.enum(['TEXT', 'CHECKLIST']).default('TEXT'),
  color: z.string().max(32).default('default'),
});

const updateSchema = z.object({
  title: z.string().max(500).optional(),
  content: z.string().max(100000).optional(),
  color: z.string().max(32).optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  version: z.number().int().positive().optional(),
});

export const noteService = {
  list: (userId: string) => listNotes(db, userId),
  get: (userId: string, id: string) => getNote(db, userId, id),
  create: (userId: string, input: unknown) => createNote(db, userId, createSchema.parse(input)),
  update: (userId: string, id: string, input: unknown) => {
    const parsed = updateSchema.parse(input);
    const { version, ...patch } = parsed;
    return updateNote(db, userId, id, patch, version);
  },
  remove: (userId: string, id: string) => softDeleteNote(db, userId, id),
};
