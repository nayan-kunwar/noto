# Sync

* Queue: mobile `sync_queue(operation_id UNIQUE, entity_type, entity_id, operation, payload, retry_count, last_error)`. Every mutation enqueues CREATE/UPDATE/DELETE with client UUID `operation_id`.
* Push: `POST /api/v1/sync {deviceId, lastSyncAt, operations[]}`. Server checks `sync_operations` for `operation_id` (idempotent replay), records new ops, applies NOTE ops with LWW.
* Pull: server returns `changes` where `updatedAt > lastSyncAt` + `serverTime`. Client `upsertFromRemote` with LWW, clears `acceptedOperations`, stores `lastSyncAt`.
* Retry: `withRetry` exponential backoff (1s,2s,4s… max 30s, 5 attempts). Failures set `SyncStatus` to error/offline; queue retained.
* Triggers: startup (`_layout` initDb → triggerSync), foreground (`useSyncOnForeground` / AppState), after mutation, manual. No polling.
