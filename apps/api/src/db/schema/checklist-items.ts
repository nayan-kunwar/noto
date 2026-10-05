import { boolean, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { notes } from './notes.js';

export const checklistItems = pgTable(
  'checklist_items',
  {
    id: uuid('id').primaryKey(),
    noteId: uuid('note_id')
      .notNull()
      .references(() => notes.id, { onDelete: 'cascade' }),
    text: text('text').notNull().default(''),
    isCompleted: boolean('is_completed').notNull().default(false),
    position: integer('position').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('checklist_note_id_idx').on(t.noteId)],
);
