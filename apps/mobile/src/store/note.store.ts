import { create } from 'zustand';
import type { LocalNote } from '../db/schema';
import { noteRepository } from '../repositories/note.repository';

export type SyncUiState = 'synced' | 'syncing' | 'offline' | 'error';

interface NoteState {
  notes: LocalNote[];
  syncState: SyncUiState;
  searchQuery: string;
  setNotes: (notes: LocalNote[]) => void;
  setSyncState: (s: SyncUiState) => void;
  setSearchQuery: (q: string) => void;
  refresh: (userId: string) => Promise<void>;
  upsertLocal: (note: LocalNote) => void;
  removeLocal: (id: string) => void;
}

export const useNoteStore = create<NoteState>()((set, get) => ({
  notes: [],
  syncState: 'synced',
  searchQuery: '',
  setNotes: (notes) => set({ notes }),
  setSyncState: (syncState) => set({ syncState }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  refresh: async (userId: string) => {
    try {
      const notes = await noteRepository.findAll(userId, true);
      set({ notes });
    } catch (e) {
      console.error('refresh notes failed', e);
    }
  },
  upsertLocal: (note) => {
    const notes = get().notes;
    const exists = notes.some((n) => n.id === note.id);
    set({ notes: exists ? notes.map((n) => (n.id === note.id ? note : n)) : [note, ...notes] });
  },
  removeLocal: (id) => set({ notes: get().notes.filter((n) => n.id !== id) }),
}));
