import { Pressable, Text } from 'react-native';
import type { PressableProps } from 'react-native';

interface Props extends PressableProps {
  title: string;
}

export function Button({ title, ...rest }: Props): React.JSX.Element {
  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [
        { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 14, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>{title}</Text>
    </Pressable>
  );
}
