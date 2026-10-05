import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { triggerSync } from '../sync/sync-engine';

export function useSyncOnForeground(): void {
  const accessToken = useAuthStore((s) => s.accessToken);
  useEffect(() => {
    triggerSync(accessToken);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') triggerSync(useAuthStore.getState().accessToken);
    });
    return () => sub.remove();
  }, [accessToken]);
}
