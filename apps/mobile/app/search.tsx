import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/auth.store';
import { noteRepository } from '../src/repositories/note.repository';
import type { LocalNote } from '../src/db/schema';
import { NoteCard } from '../src/components/NoteCard';
import { SearchBar } from '../src/components/SearchBar';
import { ThemedView } from '../src/components/ui/Themed';
import { useNoteStore } from '../src/store/note.store';

export default function Search(): React.JSX.Element {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id ?? 'local');
  const query = useNoteStore((s) => s.searchQuery);
  const [results, setResults] = useState<LocalNote[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      void noteRepository.findAll(userId, true).then(setResults);
      return;
    }
    const t = setTimeout(() => {
      void noteRepository.search(userId, query.trim()).then(setResults).catch(console.error);
    }, 200);
    return () => clearTimeout(t);
  }, [query, userId]);

  return (
    <ThemedView style={{ flex: 1, padding: 16, gap: 12 }}>
      <SearchBar />
      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <NoteCard note={item} onPress={(nid) => router.push(`/note/${nid}`)} />
        )}
      />
    </ThemedView>
  );
}
