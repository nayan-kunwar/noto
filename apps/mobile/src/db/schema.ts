import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Local-first SQLite schema. Client generates UUIDs so offline creates work.
// Booleans stored as integers; timestamps as ISO strings for LWW + sync.

export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull().default(''),
  content: text('content').notNull().default(''),
  type: text('type').notNull().default('TEXT'),
  color: text('color').notNull().default('default'),
  isPinned: integer('is_pinned', { mode: 'boolean' }).notNull().default(false),
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
  version: integer('version').notNull().default(1),
  syncStatus: text('sync_status').notNull().default('PENDING'),
});

export const checklistItems = sqliteTable('checklist_items', {
  id: text('id').primaryKey(),
  noteId: text('note_id')
    .notNull()
    .references(() => notes.id),
  text: text('text').notNull().default(''),
  isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(false),
  position: integer('position').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const labels = sqliteTable('labels', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  color: text('color'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const noteLabels = sqliteTable('note_labels', {
  noteId: text('note_id')
    .notNull()
    .references(() => notes.id),
  labelId: text('label_id')
    .notNull()
    .references(() => labels.id),
});

export const syncQueue = sqliteTable('sync_queue', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  operationId: text('operation_id').notNull().unique(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  operation: text('operation').notNull(),
  payload: text('payload').notNull(),
  createdAt: text('created_at').notNull(),
  retryCount: integer('retry_count').notNull().default(0),
  lastError: text('last_error'),
});

export type LocalNote = typeof notes.$inferSelect;
export type NewLocalNote = typeof notes.$inferInsert;
