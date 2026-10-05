import { create } from 'zustand';
import type { User } from '@repo/shared';
import { clearTokens } from '../services/auth.service';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;
  setAuth: (user: User, accessToken: string) => void;
  setStatus: (status: AuthStatus) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  status: 'idle',
  setAuth: (user, accessToken) => set({ user, accessToken, status: 'authenticated' }),
  setStatus: (status) => set({ status }),
  logout: async () => {
    await clearTokens();
    set({ user: null, accessToken: null, status: 'unauthenticated' });
  },
}));
