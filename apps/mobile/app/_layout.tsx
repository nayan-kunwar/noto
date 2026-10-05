import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { initDb } from '../src/db/client';
import { useAuthStore } from '../src/store/auth.store';
import { triggerSync } from '../src/sync/sync-engine';

export default function RootLayout(): React.JSX.Element {
  useEffect(() => {
    void initDb()
      .then(() => {
        triggerSync(useAuthStore.getState().accessToken);
      })
      .catch((e: unknown) => {
        console.error('initDb failed', e);
      });
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="note/new" options={{ title: 'New note' }} />
      <Stack.Screen name="note/[id]" options={{ title: 'Note' }} />
      <Stack.Screen name="search" options={{ title: 'Search' }} />
    </Stack>
  );
}
