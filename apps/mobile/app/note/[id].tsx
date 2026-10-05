import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNoteStore } from '../../src/store/note.store';
import { noteRepository } from '../../src/repositories/note.repository';
import { checklistRepository, type ChecklistRow } from '../../src/repositories/checklist.repository';
import { ThemedText, ThemedView } from '../../src/components/ui/Themed';
import { NoteEditor } from '../../src/components/NoteEditor';
import { ChecklistItem } from '../../src/components/ChecklistItem';

const COLORS = ['default', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple'] as const;

export default function NoteDetail(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const note = useNoteStore((s) => s.notes.find((n) => n.id === id));
  const upsertLocal = useNoteStore((s) => s.upsertLocal);
  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [items, setItems] = useState<ChecklistRow[]>([]);
  const [newItem, setNewItem] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setTitle(note?.title ?? '');
    setContent(note?.content ?? '');
  }, [note?.id, note?.title, note?.content]);

  useEffect(() => {
    if (!id) return;
    void checklistRepository.listByNote(id).then(setItems).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!id || !note) return;
    if (title === note.title && content === note.content) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void noteRepository.update(id, { title, content }).then((n) => {
        if (n) upsertLocal(n);
      });
    }, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [id, title, content, note, upsertLocal]);

  if (!note || !id) {
    return (
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <ThemedText>Note not found.</ThemedText>
      </ThemedView>
    );
  }

  const isChecklist = note.type === 'CHECKLIST';

  return (
    <ThemedView style={{ flex: 1, padding: 16, gap: 12 }}>
      <NoteEditor title={title} content={content} onTitleChange={setTitle} onContentChange={setContent} />
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {COLORS.map((c) => (
          <Pressable
            key={c}
            onPress={() => void noteRepository.update(id, { color: c }).then((n) => n && upsertLocal(n))}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: c === 'default' ? '#eee' : c,
              borderWidth: note.color === c ? 2 : 0,
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable onPress={() => void noteRepository.togglePin(id).then((n) => n && upsertLocal(n))}>
          <Text>{note.isPinned ? 'Unpin' : 'Pin'}</Text>
        </Pressable>
        <Pressable onPress={() => void noteRepository.toggleArchive(id).then(() => router.back())}>
          <Text>{note.isArchived ? 'Unarchive' : 'Archive'}</Text>
        </Pressable>
        <Pressable
          onPress={() => void noteRepository.softDelete(id).then(() => router.back())}
        >
          <Text>Delete</Text>
        </Pressable>
      </View>
      {isChecklist ? (
        <View>
          <ThemedText style={{ fontWeight: '700' }}>Checklist</ThemedText>
          {items.map((it) => (
            <ChecklistItem
              key={it.id}
              text={it.text}
              completed={it.isCompleted}
              onToggle={() =>
                void checklistRepository.toggle(it.id).then(() => checklistRepository.listByNote(id).then(setItems))
              }
            />
          ))}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              value={newItem}
              onChangeText={setNewItem}
              placeholder="New item"
              style={{ flex: 1, borderWidth: 1, borderRadius: 8, padding: 8 }}
            />
            <Pressable
              onPress={() => {
                if (!newItem.trim()) return;
                void checklistRepository.add(id, newItem.trim()).then(() => {
                  setNewItem('');
                  return checklistRepository.listByNote(id).then(setItems);
                });
              }}
            >
              <Text>Add</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </ThemedView>
  );
}
