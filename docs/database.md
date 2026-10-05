# Database

Mobile SQLite (Drizzle + expo-sqlite, `src/db/schema.ts`, created by `initDb()`; migrations in `src/db/migrations/`):

* `notes(id PK, user_id, title, content, type TEXT|CHECKLIST, color, is_pinned, is_archived, created_at, updated_at, deleted_at NULL, version, sync_status)`
* `checklist_items(id PK, note_id FK, text, is_completed, position, created_at, updated_at)`
* `labels(id PK, user_id, name, color NULL, created_at, updated_at)`
* `note_labels(note_id FK, label_id FK)`
* `sync_queue(id AUTOINC PK, operation_id UNIQUE, entity_type, entity_id, operation, payload JSON, created_at, retry_count, last_error)`

Server Postgres (`apps/api/src/db/schema/` + Drizzle Kit `drizzle/migrations`):

* `users`, `notes` (FK users, indexes user_id/updated_at/deleted_at), `checklist_items`, `labels`, `note_labels`, `sync_operations(operation_id PK, user_id FK, device_id, entity/payload)`, `refresh_tokens(token_hash UNIQUE, expires_at, revoked_at)`.
* Soft delete everywhere (`deleted_at`); client UUIDs for offline creates.
