import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../src/store/auth.store';
import { labelRepository, type LabelRow } from '../../src/repositories/label.repository';
import { ThemedText, ThemedView } from '../../src/components/ui/Themed';

export default function Labels(): React.JSX.Element {
  const userId = useAuthStore((s) => s.user?.id ?? 'local');
  const [labels, setLabels] = useState<LabelRow[]>([]);
  const [name, setName] = useState('');

  const reload = (): void => {
    void labelRepository.list(userId).then(setLabels).catch(console.error);
  };

  useEffect(reload, [userId]);

  return (
    <ThemedView style={{ flex: 1, padding: 16, gap: 12 }}>
      <ThemedText style={{ fontWeight: '700', fontSize: 20 }}>Labels</ThemedText>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="New label"
          style={{ flex: 1, borderWidth: 1, borderRadius: 8, padding: 8 }}
        />
        <Pressable
          onPress={() => {
            if (!name.trim()) return;
            void labelRepository.create(userId, name.trim()).then(() => {
              setName('');
              reload();
            });
          }}
        >
          <Text>Add</Text>
        </Pressable>
      </View>
      <FlatList
        data={labels}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
            <ThemedText>{item.name}</ThemedText>
            <Pressable onPress={() => void labelRepository.remove(item.id).then(reload)}>
              <Text>Delete</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<ThemedText>No labels yet.</ThemedText>}
      />
    </ThemedView>
  );
}
