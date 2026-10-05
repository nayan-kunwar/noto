import { z } from 'zod';
import { NOTE_COLORS, NoteType } from '../enums/index.js';

export const noteSchema = z.object({
  title: z.string().max(500).default(''),
  content: z.string().max(100000).default(''),
  type: z.nativeEnum(NoteType).default(NoteType.TEXT),
  color: z.enum(NOTE_COLORS).default('default'),
  isPinned: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

export const updateNoteSchema = noteSchema.partial().extend({
  version: z.number().int().positive(),
});

export const checklistItemSchema = z.object({
  text: z.string().max(1000),
  isCompleted: z.boolean().default(false),
  position: z.number().int().min(0),
});

export type CreateNoteInput = z.infer<typeof noteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
