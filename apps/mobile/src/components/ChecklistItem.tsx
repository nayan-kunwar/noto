import { Pressable, Text, View } from 'react-native';

interface Props {
  text: string;
  completed: boolean;
  onToggle: () => void;
}

export function ChecklistItem({ text, completed, onToggle }: Props): React.JSX.Element {
  return (
    <Pressable onPress={onToggle} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {completed ? <Text>✓</Text> : null}
      </View>
      <Text style={{ textDecorationLine: completed ? 'line-through' : 'none' }}>{text}</Text>
    </Pressable>
  );
}
