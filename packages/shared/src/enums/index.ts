export const NoteType = {
  TEXT: 'TEXT',
  CHECKLIST: 'CHECKLIST',
} as const;
export type NoteType = (typeof NoteType)[keyof typeof NoteType];

export const SyncStatus = {
  SYNCED: 'SYNCED',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
} as const;
export type SyncStatus = (typeof SyncStatus)[keyof typeof SyncStatus];

export const SyncOperationType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;
export type SyncOperationType = (typeof SyncOperationType)[keyof typeof SyncOperationType];

export const SyncEntityType = {
  NOTE: 'NOTE',
  CHECKLIST_ITEM: 'CHECKLIST_ITEM',
  LABEL: 'LABEL',
} as const;
export type SyncEntityType = (typeof SyncEntityType)[keyof typeof SyncEntityType];

export const NOTE_COLORS = [
  'default',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'pink',
  'brown',
] as const;
export type NoteColor = (typeof NOTE_COLORS)[number];
