import { Text } from 'react-native';
import { useNoteStore } from '../store/note.store';
import type { SyncUiState } from '../store/note.store';

const LABEL: Record<SyncUiState, string> = {
  synced: '✓ Synced',
  syncing: '⟳ Syncing...',
  offline: '⚠ Offline',
  error: '⚠ Sync failed',
};

export function SyncStatus(): React.JSX.Element {
  const syncState = useNoteStore((s) => s.syncState);
  return <Text style={{ fontSize: 12, color: '#888' }}>{LABEL[syncState]}</Text>;
}
