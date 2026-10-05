import { useState } from 'react';
import { TextInput } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@repo/shared';
import { ThemedText, ThemedView } from '../../src/components/ui/Themed';
import { Button } from '../../src/components/ui/Button';
import { register, saveTokens } from '../../src/services/auth.service';
import { useAuthStore } from '../../src/store/auth.store';

export default function RegisterScreen(): React.JSX.Element {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const { user, tokens } = await register(values.email, values.password);
      await saveTokens(tokens);
      setAuth(user, tokens.accessToken);
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    }
  });

  return (
    <ThemedView style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
      <ThemedText style={{ fontSize: 28, fontWeight: '800' }}>Create account</ThemedText>
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
            placeholder="Password (min 8)"
            secureTextEntry
            style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
          />
        )}
      />
      {error ? <ThemedText style={{ color: 'red' }}>{error}</ThemedText> : null}
      <Button title="Register" onPress={onSubmit} />
      <Link href="/(auth)/login">
        <ThemedText>Have an account? Login</ThemedText>
      </Link>
    </ThemedView>
  );
}
