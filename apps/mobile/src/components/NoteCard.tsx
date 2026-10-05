import { Pressable, Text, View } from 'react-native';
import type { LocalNote } from '../db/schema';

interface Props {
  note: Pick<LocalNote, 'id' | 'title' | 'content' | 'color' | 'isPinned'>;
  onPress?: (id: string) => void;
  onPin?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export function NoteCard({ note, onPress, onPin, onArchive, onDelete }: Props): React.JSX.Element {
  return (
    <Pressable
      onPress={() => onPress?.(note.id)}
      style={{ borderRadius: 16, padding: 14, backgroundColor: '#f6f6f4', marginBottom: 10 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: '700', fontSize: 16 }} numberOfLines={1}>
          {note.title || 'Untitled'}
        </Text>
        {note.isPinned ? <Text>📌</Text> : null}
      </View>
      {note.content ? (
        <Text numberOfLines={4} style={{ marginTop: 6, color: '#555' }}>
          {note.content}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
        {onPin ? (
          <Pressable onPress={onPin}>
            <Text>{note.isPinned ? 'Unpin' : 'Pin'}</Text>
          </Pressable>
        ) : null}
        {onArchive ? (
          <Pressable onPress={onArchive}>
            <Text>Archive</Text>
          </Pressable>
        ) : null}
        {onDelete ? (
          <Pressable onPress={onDelete}>
            <Text>Delete</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}
