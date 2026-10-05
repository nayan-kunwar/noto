import { TextInput } from 'react-native';
import { useNoteStore } from '../store/note.store';

export function SearchBar(): React.JSX.Element {
  const query = useNoteStore((s) => s.searchQuery);
  const setQuery = useNoteStore((s) => s.setSearchQuery);
  return (
    <TextInput
      value={query}
      onChangeText={setQuery}
      placeholder="Search notes"
      style={{ backgroundColor: '#f0f0ee', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10 }}
    />
  );
}
