import * as SecureStore from 'expo-secure-store';
import { apiRequest } from './api-client';
import type { AuthTokens, User } from '@repo/shared';

const ACCESS_KEY = 'noto.accessToken';
const REFRESH_KEY = 'noto.refreshToken';

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken);
}

export async function loadTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_KEY),
    SecureStore.getItemAsync(REFRESH_KEY),
  ]);
  return { accessToken, refreshToken };
}

export async function clearTokens(): Promise<void> {
  await Promise.all([SecureStore.deleteItemAsync(ACCESS_KEY), SecureStore.deleteItemAsync(REFRESH_KEY)]);
}

export function register(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
  return apiRequest('/auth/register', { method: 'POST', body: { email, password } });
}

export function login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
  return apiRequest('/auth/login', { method: 'POST', body: { email, password } });
}

export function fetchMe(accessToken: string): Promise<User> {
  return apiRequest('/auth/me', { token: accessToken });
}

export function refresh(refreshToken: string): Promise<AuthTokens> {
  return apiRequest('/auth/refresh', { method: 'POST', body: { refreshToken } });
}
