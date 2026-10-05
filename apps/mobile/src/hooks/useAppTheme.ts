import { useColorScheme as useSystemScheme } from 'react-native';
import { useUiStore } from '../store/ui.store';

export function useAppTheme(): 'light' | 'dark' {
  const preference = useUiStore((s) => s.theme);
  const system = useSystemScheme() ?? 'light';
  if (preference === 'system') return system;
  return preference;
}
