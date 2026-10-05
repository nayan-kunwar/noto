import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';

interface UiState {
  theme: ThemePreference;
  activeLabelId: string | null;
  setTheme: (theme: ThemePreference) => void;
  setActiveLabelId: (id: string | null) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  theme: 'system',
  activeLabelId: null,
  setTheme: (theme) => set({ theme }),
  setActiveLabelId: (activeLabelId) => set({ activeLabelId }),
}));
