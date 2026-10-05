# Noto — Local-first notes app

Production-quality, cross-platform notes app (Google Keep-like) with offline-first SQLite, background sync, and multi-device support.

## Monorepo

```text
noto/
├── apps/
│   ├── mobile/   # Expo + React Native + SQLite (source of truth for UI)
│   └── api/      # Fastify + PostgreSQL
├── packages/
│   ├── shared/   # @repo/shared — types, Zod schemas, sync contracts
│   └── config/   # shared TS / ESLint / Prettier
├── docs/
└── docker-compose.yml  # local Postgres
```

## Quickstart

```bash
cp .env.example .env
docker compose up -d            # Postgres 16 on 5432
pnpm install
pnpm build
pnpm typecheck
pnpm test
```

Backend dev:

```bash
cp apps/api/.env.example apps/api/.env
pnpm --filter @repo/api db:generate   # after schema changes
pnpm --filter @repo/api db:migrate
pnpm --filter @repo/api dev           # http://localhost:3000/health, /api/v1/...
```

Mobile dev (Expo SDK 53):

```bash
pnpm --filter noto-mobile dev
```

## Sync design

* Local SQLite is UI source of truth; mutations enqueue `sync_queue` rows with `operation_id`.
* `POST /api/v1/sync {deviceId,lastSyncAt,operations}` pushes ops idempotently (`sync_operations.operation_id` unique) and pulls `changes` since `lastSyncAt`.
* Conflict: Last-Write-Wins on `version` then `updatedAt` (`conflict-resolver.ts` both sides).
* Triggers: startup, foreground (`AppState`), after mutation via `triggerSync`, manual refresh. Exponential backoff, max 5 retries.

## Multi-device

Device A pushes CREATE/UPDATE → server applies once (replay of same `operation_id` returns `acceptedOperations` without double-apply) → Device B pulls `changes` and `upsertFromRemote` with LWW. See `apps/api/tests/sync/multidevice.test.ts`.

## Definition of Done

Register, login, CRUD/pin/archive/checklist/labels/search offline, restart persistence, reconnect sync, second-device sync, conflict safety, secure logout. UI stays responsive with API down (`SyncStatus`: ✓ Synced / ⟳ Syncing / ⚠ Offline / ⚠ Sync failed).
