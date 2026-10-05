import { FlatList, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';
import { useNoteStore } from '../../src/store/note.store';
import { noteRepository } from '../../src/repositories/note.repository';
import { NoteCard } from '../../src/components/NoteCard';
import { ThemedText, ThemedView } from '../../src/components/ui/Themed';
import { useNotes } from '../../src/hooks/useNotes';

export default function Archive(): React.JSX.Element {
  const router = useRouter();
  useNotes();
  const userId = useAuthStore((s) => s.user?.id ?? 'local');
  const refresh = useNoteStore((s) => s.refresh);
  const notes = useNoteStore((s) => s.notes);
  const archived = notes.filter((n) => n.isArchived && !n.deletedAt);

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText style={{ fontWeight: '700', marginBottom: 8 }}>Archive</ThemedText>
      <FlatList
        data={archived}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={(nid) => router.push(`/note/${nid}`)}
            onArchive={() => void noteRepository.toggleArchive(item.id).then(() => refresh(userId))}
            onDelete={() => void noteRepository.softDelete(item.id).then(() => refresh(userId))}
          />
        )}
        ListEmptyComponent={<ThemedText>No archived notes.</ThemedText>}
      />
      <Pressable onPress={() => void refresh(userId)}>
        <Text>Refresh</Text>
      </Pressable>
    </ThemedView>
  );
}
