import { useState } from 'react';
import { View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@repo/shared';
import { ThemedText, ThemedView } from '../../src/components/ui/Themed';
import { Button } from '../../src/components/ui/Button';
import { TextInput } from 'react-native';
import { login, saveTokens } from '../../src/services/auth.service';
import { useAuthStore } from '../../src/store/auth.store';

export default function Login(): React.JSX.Element {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const { user, tokens } = await login(values.email, values.password);
      await saveTokens(tokens);
      setAuth(user, tokens.accessToken);
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    }
  });

  return (
    <ThemedView style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
      <ThemedText style={{ fontSize: 28, fontWeight: '800' }}>Welcome back</ThemedText>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Password"
            secureTextEntry
            style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
          />
        )}
      />
      {error ? (
        <View>
          <ThemedText style={{ color: 'red' }}>{error}</ThemedText>
        </View>
      ) : null}
      <Button title="Login" onPress={onSubmit} />
      <Link href="/(auth)/register">
        <ThemedText>No account? Register</ThemedText>
      </Link>
    </ThemedView>
  );
}
