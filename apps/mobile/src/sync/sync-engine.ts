import * as SecureStore from 'expo-secure-store';
import { apiRequest } from '../services/api-client';
import { isOnline } from '../services/network.service';
import { noteRepository } from '../repositories/note.repository';
import { getPendingOperations, clearOperations } from './sync-queue';
import { withRetry } from './retry';
import { useNoteStore } from '../store/note.store';
import type { SyncResponse } from '@repo/shared';

const LAST_SYNC_KEY = 'noto.lastSyncAt';
const DEVICE_KEY = 'noto.deviceId';

async function getDeviceId(): Promise<string> {
  let id = await SecureStore.getItemAsync(DEVICE_KEY);
  if (!id) {
    id = `device-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    await SecureStore.setItemAsync(DEVICE_KEY, id);
  }
  return id;
}

async function getLastSync(): Promise<string | null> {
  return SecureStore.getItemAsync(LAST_SYNC_KEY);
}

async function setLastSync(v: string): Promise<void> {
  await SecureStore.setItemAsync(LAST_SYNC_KEY, v);
}

let running = false;

export async function syncNow(accessToken: string | null): Promise<void> {
  if (running) return;
  if (!accessToken) return;
  const online = await isOnline();
  const setSyncState = useNoteStore.getState().setSyncState;
  if (!online) {
    setSyncState('offline');
    return;
  }
  running = true;
  setSyncState('syncing');
  try {
    const deviceId = await getDeviceId();
    const lastSyncAt = await getLastSync();
    const operations = await getPendingOperations();

    const data = await withRetry(() =>
      apiRequest<SyncResponse>('/sync', {
        method: 'POST',
        token: accessToken,
        body: { deviceId, lastSyncAt, operations },
      }),
    );

    await clearOperations(data.acceptedOperations);

    for (const change of data.changes) {
      if (change.entityType === 'NOTE') {
        const d = change.data as Record<string, unknown>;
        await noteRepository.upsertFromRemote({
          id: String(d['id'] ?? change.entityId),
          userId: String(d['userId'] ?? d['user_id'] ?? 'local'),
          title: String(d['title'] ?? ''),
          content: String(d['content'] ?? ''),
          type: String(d['type'] ?? 'TEXT'),
          color: String(d['color'] ?? 'default'),
          isPinned: Boolean(d['isPinned'] ?? d['is_pinned'] ?? false),
          isArchived: Boolean(d['isArchived'] ?? d['is_archived'] ?? false),
          createdAt: String(d['createdAt'] ?? d['created_at'] ?? new Date().toISOString()),
          updatedAt: String(change.updatedAt),
          deletedAt: change.deletedAt,
          version: Number(change.version ?? d['version'] ?? 1),
          syncStatus: 'SYNCED',
        });
      }
    }

    await setLastSync(data.serverTime);
    setSyncState('synced');
  } catch (e) {
    console.error('sync failed', e);
    useNoteStore.getState().setSyncState('error');
  } finally {
    running = false;
  }
}

// Triggers: call from app startup, foreground, connectivity change, after mutation, manual.
export function triggerSync(accessToken: string | null): void {
  void syncNow(accessToken);
}
