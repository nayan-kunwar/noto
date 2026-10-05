import { Alert, FlatList, Pressable, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';
import { useNoteStore } from '../../src/store/note.store';
import { useNotes } from '../../src/hooks/useNotes';
import { noteRepository } from '../../src/repositories/note.repository';
import { NoteCard } from '../../src/components/NoteCard';
import { SearchBar } from '../../src/components/SearchBar';
import { SyncStatus } from '../../src/components/SyncStatus';
import { ThemedText, ThemedView } from '../../src/components/ui/Themed';

export default function Home(): React.JSX.Element {
  const router = useRouter();
  useNotes();
  const userId = useAuthStore((s) => s.user?.id ?? 'local');
  const notes = useNoteStore((s) => s.notes);
  const refresh = useNoteStore((s) => s.refresh);
  const pinned = notes.filter((n) => n.isPinned && !n.deletedAt && !n.isArchived);
  const rest = notes.filter((n) => !n.isPinned && !n.deletedAt && !n.isArchived);

  const reload = (): void => {
    void refresh(userId).catch((e: unknown) => console.error(e));
  };

  const onDelete = (id: string): void => {
    Alert.alert('Delete note?', 'Note will be soft-deleted and synced.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void noteRepository.softDelete(id).then(reload);
        },
      },
    ]);
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Link href="/search">
        <ThemedText>Search</ThemedText>
      </Link>
      <SearchBar />
      <SyncStatus />
      {pinned.length > 0 ? (
        <View>
          <ThemedText style={{ fontWeight: '700', marginBottom: 8 }}>Pinned</ThemedText>
          <FlatList
            data={pinned}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <NoteCard
                note={item}
                onPress={(nid) => router.push(`/note/${nid}`)}
                onPin={() => void noteRepository.togglePin(item.id).then(reload)}
                onArchive={() => void noteRepository.toggleArchive(item.id).then(reload)}
                onDelete={() => onDelete(item.id)}
              />
            )}
          />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <ThemedText style={{ fontWeight: '700', marginBottom: 8 }}>Notes</ThemedText>
        <FlatList
          data={rest}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={(nid) => router.push(`/note/${nid}`)}
              onPin={() => void noteRepository.togglePin(item.id).then(reload)}
              onArchive={() => void noteRepository.toggleArchive(item.id).then(reload)}
              onDelete={() => onDelete(item.id)}
            />
          )}
          ListEmptyComponent={<ThemedText>No notes yet. Create one offline.</ThemedText>}
        />
      </View>
      <Pressable
        onPress={() => router.push('/note/new')}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#1a1a1a',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ThemedText style={{ color: '#fff', fontSize: 28 }}>+</ThemedText>
      </Pressable>
    </ThemedView>
  );
}
