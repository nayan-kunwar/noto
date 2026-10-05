import { Text as RNText, View as RNView } from 'react-native';
import type { TextProps, ViewProps } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { colors } from '../../lib/theme';

export function ThemedView(props: ViewProps): React.JSX.Element {
  const theme = useAppTheme();
  const bg = theme === 'dark' ? colors.dark.background : colors.light.background;
  return <RNView {...props} style={[{ backgroundColor: bg }, props.style]} />;
}

export function ThemedText(props: TextProps): React.JSX.Element {
  const theme = useAppTheme();
  const fg = theme === 'dark' ? colors.dark.text : colors.light.text;
  return <RNText {...props} style={[{ color: fg }, props.style]} />;
}
