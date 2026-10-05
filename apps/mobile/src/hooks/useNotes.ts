import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useNoteStore } from '../store/note.store';

export function useNotes(): void {
  const user = useAuthStore((s) => s.user);
  const refresh = useNoteStore((s) => s.refresh);
  useEffect(() => {
    const userId = user?.id ?? 'local';
    void refresh(userId);
  }, [user?.id, refresh]);
}
