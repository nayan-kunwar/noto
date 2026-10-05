import { TextInput, View } from 'react-native';

interface Props {
  title: string;
  content: string;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
}

// Phase 2 shell — Phase 3 wires autosave to SQLite + sync queue.
export function NoteEditor({ title, content, onTitleChange, onContentChange }: Props): React.JSX.Element {
  return (
    <View style={{ gap: 12 }}>
      <TextInput
        value={title}
        onChangeText={onTitleChange}
        placeholder="Title"
        style={{ fontSize: 22, fontWeight: '700' }}
      />
      <TextInput
        value={content}
        onChangeText={onContentChange}
        placeholder="Note"
        multiline
        style={{ fontSize: 16, minHeight: 200, textAlignVertical: 'top' }}
      />
    </View>
  );
}
