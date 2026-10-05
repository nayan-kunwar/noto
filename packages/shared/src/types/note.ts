import type { NoteType, SyncStatus } from '../enums/index.js';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  syncStatus: SyncStatus;
}

export interface ChecklistItem {
  id: string;
  noteId: string;
  text: string;
  isCompleted: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface NoteWithChecklist extends Note {
  items: ChecklistItem[];
}
