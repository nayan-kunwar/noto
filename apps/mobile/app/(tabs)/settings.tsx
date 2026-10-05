import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';
import { useUiStore, type ThemePreference } from '../../src/store/ui.store';
import { SyncStatus } from '../../src/components/SyncStatus';
import { Button } from '../../src/components/ui/Button';
import { ThemedText, ThemedView } from '../../src/components/ui/Themed';
import { Pressable, View } from 'react-native';

const THEMES: ThemePreference[] = ['system', 'light', 'dark'];

export default function Settings(): React.JSX.Element {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  const onLogout = async (): Promise<void> => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16, gap: 16 }}>
      <ThemedText style={{ fontSize: 22, fontWeight: '800' }}>Settings</ThemedText>
      <View>
        <ThemedText>Account: {user?.email ?? 'Not signed in'}</ThemedText>
        <SyncStatus />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {THEMES.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTheme(t)}
            style={{
              padding: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: theme === t ? '#1a1a1a' : '#ddd',
            }}
          >
            <ThemedText>{t}</ThemedText>
          </Pressable>
        ))}
      </View>
      <Button title="Logout" onPress={() => void onLogout()} />
    </ThemedView>
  );
}
