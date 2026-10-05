import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';
import { useNoteStore } from '../../src/store/note.store';
import { noteRepository } from '../../src/repositories/note.repository';
import { ThemedView } from '../../src/components/ui/Themed';
import { NoteEditor } from '../../src/components/NoteEditor';

export default function NewNote(): React.JSX.Element {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id ?? 'local');
  const upsertLocal = useNoteStore((s) => s.upsertLocal);
  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void noteRepository.create({ title: '', content: '', userId }).then((n) => {
      if (cancelled) return;
      setId(n.id);
      upsertLocal(n);
    });
    return () => {
      cancelled = true;
    };
  }, [userId, upsertLocal]);

  useEffect(() => {
    if (!id) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void noteRepository.update(id, { title, content }).then((n) => {
        if (n) upsertLocal(n);
      });
    }, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [id, title, content, upsertLocal]);

  useEffect(() => {
    return () => {
      if (id && title.trim() === '' && content.trim() === '') {
        void noteRepository.softDelete(id);
      } else if (id) {
        router.replace(`/note/${id}`);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <NoteEditor title={title} content={content} onTitleChange={setTitle} onContentChange={setContent} />
    </ThemedView>
  );
}
