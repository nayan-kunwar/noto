# Build Noto — A Modern Local-First Notes App

You are a senior React Native, TypeScript, Node.js, and backend engineer.

Build a production-quality, cross-platform notes-taking application called **Noto**, similar in concept to Google Keep, with a strong focus on:

- Local-first architecture
- Offline support
- Multi-device synchronization
- Clean and modern UX
- Type-safe development
- Maintainable architecture
- Reliable synchronization
- Production-ready backend

The project **MUST be implemented as a PNPM monorepo**.

Do not create separate unrelated repositories or standalone `mobile/` and `backend/` projects.

---

# 1. Product Goal

Build a notes application where users can:

- Create notes
- Edit notes
- Delete notes
- Archive notes
- Pin important notes
- Add labels
- Change note colors
- Create checklist notes
- Search notes
- Work completely offline
- Automatically synchronize notes when internet connectivity returns
- Use the same account across multiple devices

The application should feel fast even when there is no internet connection.

The most important architectural principle is:

> **The local database is the source of truth for the mobile UI.**

The application must not require a network request before displaying or editing a note.

---

# 2. Monorepo Requirement

The entire project MUST use a **PNPM workspace monorepo**.

Use:

- pnpm
- Turborepo

The repository must have this high-level structure:

```text
noto/
├── apps/
│   ├── mobile/
│   └── api/
│
├── packages/
│   ├── shared/
│   └── config/
│
├── docs/
├── .github/
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── .env.example
├── .gitignore
└── README.md
```

Do not create:

```text
noto/mobile/
noto/backend/
```

as separate top-level applications.

The applications must live under:

```text
apps/mobile
apps/api
```

---

# 3. Technology Stack

## Mobile

Use:

- React Native
- Expo
- TypeScript
- Expo Router
- Zustand
- SQLite
- Drizzle ORM
- Zod
- React Hook Form
- Expo Secure Store
- Expo Network
- Expo Notifications

Use current stable versions compatible with each other.

Do not introduce unnecessary libraries.

---

# 4. Backend

Build the backend inside:

```text
apps/api
```

Use:

- Node.js
- TypeScript
- Fastify
- PostgreSQL
- Drizzle ORM
- Zod
- JWT-based authentication
- Argon2 or bcrypt for password hashing

The backend should expose a versioned REST API:

```text
/api/v1
```

Example:

```text
/api/v1/auth/register
/api/v1/auth/login
/api/v1/auth/refresh
/api/v1/notes
/api/v1/notes/:id
/api/v1/labels
/api/v1/sync
```

Keep the backend modular and easy to extend.

---

# 5. Shared Package

Create:

```text
packages/shared
```

This package contains code shared between the mobile application and backend.

Use it for:

- Shared TypeScript types
- API contracts
- Zod schemas
- Sync operation types
- Common enums
- Common constants where appropriate

Example:

```text
packages/shared/
├── src/
│   ├── types/
│   │   ├── note.ts
│   │   ├── user.ts
│   │   └── sync.ts
│   │
│   ├── schemas/
│   │   ├── note.schema.ts
│   │   ├── auth.schema.ts
│   │   └── sync.schema.ts
│   │
│   ├── enums/
│   │   └── index.ts
│   │
│   └── index.ts
│
└── package.json
```

Both:

```text
apps/mobile
apps/api
```

should be able to import from:

```text
@repo/shared
```

Do not duplicate the same API types or validation schemas in both applications.

---

# 6. Shared Configuration Package

Create:

```text
packages/config
```

Use it for shared configuration such as:

```text
ESLint
Prettier
TypeScript
```

Example:

```text
packages/config/
├── eslint/
├── prettier/
├── typescript/
└── package.json
```

Applications should extend these configurations where practical.

---

# 7. Complete Repository Structure

Use this structure as the starting point:

```text
noto/
│
├── apps/
│   │
│   ├── mobile/
│   │   ├── app/
│   │   │   ├── _layout.tsx
│   │   │   │
│   │   │   ├── (auth)/
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── login.tsx
│   │   │   │   └── register.tsx
│   │   │   │
│   │   │   ├── (tabs)/
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── archive.tsx
│   │   │   │   ├── labels.tsx
│   │   │   │   └── settings.tsx
│   │   │   │
│   │   │   ├── note/
│   │   │   │   ├── new.tsx
│   │   │   │   └── [id].tsx
│   │   │   │
│   │   │   └── search.tsx
│   │   │
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   ├── NoteCard.tsx
│   │   │   │   ├── NoteEditor.tsx
│   │   │   │   ├── ChecklistItem.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   └── SyncStatus.tsx
│   │   │   │
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── notes/
│   │   │   │   ├── labels/
│   │   │   │   └── sync/
│   │   │   │
│   │   │   ├── db/
│   │   │   │   ├── client.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── migrations/
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   ├── note.repository.ts
│   │   │   │   ├── label.repository.ts
│   │   │   │   ├── user.repository.ts
│   │   │   │   └── sync.repository.ts
│   │   │   │
│   │   │   ├── sync/
│   │   │   │   ├── sync-engine.ts
│   │   │   │   ├── sync-queue.ts
│   │   │   │   ├── conflict-resolver.ts
│   │   │   │   └── retry.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── api-client.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── network.service.ts
│   │   │   │
│   │   │   ├── store/
│   │   │   │   ├── auth.store.ts
│   │   │   │   ├── note.store.ts
│   │   │   │   └── ui.store.ts
│   │   │   │
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── constants/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   ├── assets/
│   │   ├── app.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   │
│   └── api/
│       ├── src/
│       │   ├── config/
│       │   │   ├── env.ts
│       │   │   └── config.ts
│       │   │
│       │   ├── db/
│       │   │   ├── client.ts
│       │   │   └── schema/
│       │   │       ├── users.ts
│       │   │       ├── notes.ts
│       │   │       ├── labels.ts
│       │   │       ├── checklist-items.ts
│       │   │       ├── sync-operations.ts
│       │   │       └── refresh-tokens.ts
│       │   │
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── auth.repository.ts
│       │   │   │   ├── auth.schema.ts
│       │   │   │   └── auth.routes.ts
│       │   │   │
│       │   │   ├── notes/
│       │   │   │   ├── note.controller.ts
│       │   │   │   ├── note.service.ts
│       │   │   │   ├── note.repository.ts
│       │   │   │   ├── note.schema.ts
│       │   │   │   └── note.routes.ts
│       │   │   │
│       │   │   ├── labels/
│       │   │   │   ├── label.controller.ts
│       │   │   │   ├── label.service.ts
│       │   │   │   ├── label.repository.ts
│       │   │   │   ├── label.schema.ts
│       │   │   │   └── label.routes.ts
│       │   │   │
│       │   │   └── sync/
│       │   │       ├── sync.controller.ts
│       │   │       ├── sync.service.ts
│       │   │       ├── sync.repository.ts
│       │   │       ├── conflict-resolver.ts
│       │   │       └── sync.routes.ts
│       │   │
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts
│       │   │   ├── error.middleware.ts
│       │   │   └── rate-limit.middleware.ts
│       │   │
│       │   ├── plugins/
│       │   │   ├── auth.plugin.ts
│       │   │   └── db.plugin.ts
│       │   │
│       │   ├── utils/
│       │   ├── app.ts
│       │   └── server.ts
│       │
│       ├── drizzle/
│       │   └── migrations/
│       │
│       ├── tests/
│       │   ├── auth/
│       │   ├── notes/
│       │   └── sync/
│       │
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   │
│   ├── shared/
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── schemas/
│   │   │   ├── enums/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── config/
│       ├── eslint/
│       ├── prettier/
│       ├── typescript/
│       └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── sync.md
│   ├── database.md
│   └── api.md
│
├── .github/
│   └── workflows/
│       ├── mobile.yml
│       └── api.yml
│
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── .env.example
├── .gitignore
└── README.md
```

This structure is mandatory unless there is a strong technical reason to change it.

---

# 8. Architecture

Use this architecture:

```text
                    React Native
                         │
                         ▼
                    UI Components
                         │
                         ▼
                       Hooks
                         │
                         ▼
                    Repository
                         │
                         ▼
                       SQLite
                         │
                  ┌──────┴──────┐
                  │             │
                  ▼             ▼
              Local UI      Sync Queue
                                │
                                ▼
                           Sync Engine
                                │
                           Internet
                                │
                                ▼
                          API Client
                                │
                                ▼
                         Node.js API
                                │
                         Service Layer
                                │
                         Repository
                                │
                                ▼
                           PostgreSQL
```

The UI should primarily interact with the local repository.

Do not directly make API calls from UI components.

---

# 9. Local-First Requirement

The application must work without internet connectivity.

Example:

```text
User creates note
       ↓
Save to SQLite immediately
       ↓
Update UI immediately
       ↓
Create sync operation
       ↓
Internet available?
       ↓
Sync with backend
```

Never make the user wait for the backend to create or update a note.

When offline, these operations must continue working:

```text
Create
Update
Delete
Archive
Pin
Change label
```

---

# 10. Local Database

Use SQLite with Drizzle ORM.

Create tables similar to:

## notes

```text
id
user_id
title
content
type
color
is_pinned
is_archived
created_at
updated_at
deleted_at
version
sync_status
```

`type` should support:

```text
TEXT
CHECKLIST
```

Design the schema so future note types can be added.

---

## checklist_items

```text
id
note_id
text
is_completed
position
created_at
updated_at
```

---

## labels

```text
id
user_id
name
color
created_at
updated_at
```

---

## note_labels

```text
note_id
label_id
```

---

## sync_queue

```text
id
operation_id
entity_type
entity_id
operation
payload
created_at
retry_count
last_error
```

Possible operations:

```text
CREATE
UPDATE
DELETE
```

---

# 11. Note Model

A note should support:

```text
id
title
content
type
color
isPinned
isArchived
createdAt
updatedAt
deletedAt
version
syncStatus
```

Use UUIDs generated on the client.

This allows notes to be created while offline.

---

# 12. Soft Delete

Do not immediately remove notes from the local database.

Use:

```text
deleted_at
```

This allows deleted notes to synchronize with the backend.

Example:

```text
User deletes note
       ↓
Set deleted_at
       ↓
Create DELETE operation
       ↓
Sync with backend
       ↓
Server marks note deleted
```

Eventually implement cleanup of old deleted records.

---

# 13. Synchronization

Build a dedicated sync engine inside:

```text
apps/mobile/src/sync/
```

The sync engine should:

1. Detect network availability.
2. Read pending operations from `sync_queue`.
3. Send operations to the backend.
4. Retry failed operations.
5. Remove successful operations from the queue.
6. Pull remote changes.
7. Update SQLite.
8. Handle conflicts.

Sync should run:

- When the application starts
- When the application returns to foreground
- When network connectivity changes
- After local changes
- Manually through a refresh/sync action

Do not continuously poll the server.

---

# 14. Idempotency

Sync operations must be idempotent.

Every sync operation should have a unique:

```text
operation_id
```

Example:

```text
operation_id
client_id
entity_id
operation
payload
```

If the same operation reaches the backend multiple times, the server must not apply it twice.

Implement server-side idempotency.

---

# 15. Conflict Resolution

Design the system for multi-device conflicts.

Start with:

```text
Last Write Wins
```

using:

```text
updated_at
version
```

Structure the code so a more advanced conflict-resolution strategy can be added later.

Do not hide conflict logic inside controllers.

Create a dedicated conflict/sync service.

---

# 16. Authentication

Implement:

```text
Register
Login
Logout
Refresh token
Current user
```

Use:

```text
Access Token
Refresh Token
```

Store sensitive authentication information securely on the device.

Use Expo Secure Store.

Do not store authentication tokens in normal AsyncStorage.

---

# 17. Mobile Screens

Create:

## Authentication

```text
Splash
Login
Register
```

## Main application

### Notes Home

Display:

```text
Pinned Notes
All Notes
```

Provide:

- Search
- Add note
- Archive
- Labels

### Note Editor

Allow:

```text
Title
Content
Color
Pin
Archive
Labels
Delete
```

Autosave changes locally.

Do not require an explicit Save button.

### Checklist Editor

Allow:

- Add item
- Delete item
- Reorder item
- Mark completed

### Search

Search:

```text
Title
Content
Labels
```

Use SQLite full-text search where practical.

Search must work offline.

### Archive

Show archived notes.

### Labels

Allow:

```text
Create label
Rename label
Delete label
Filter notes by label
```

### Settings

Include:

```text
Account
Theme
Sync status
Storage
Logout
```

---

# 18. UI/UX

The UI should be modern and minimal.

Design inspiration:

- Google Keep
- Apple Notes
- Notion

Do not directly copy their UI.

Use:

- Rounded cards
- Clean typography
- Good spacing
- Smooth animations
- Light mode
- Dark mode
- Responsive layouts

The notes home screen should feel lightweight and fast.

---

# 19. Offline Indicator

Show synchronization status:

```text
Synced
Syncing...
Offline
Sync failed
```

Example:

```text
✓ Synced
⟳ Syncing...
⚠ Offline
```

The user should always know whether changes have reached the server.

---

# 20. Optimistic UI

All local changes should immediately update the UI.

Example:

```text
User pins note
      ↓
SQLite updated
      ↓
UI updates immediately
      ↓
Sync queue updated
      ↓
Backend synchronization happens later
```

Never block the UI waiting for the API.

---

# 21. Backend Database

PostgreSQL should contain:

```text
users
notes
checklist_items
labels
note_labels
sync_operations
refresh_tokens
```

Use:

- Foreign keys
- Indexes
- Unique constraints
- Transactions
- Timestamps

Add indexes for:

```text
user_id
updated_at
deleted_at
```

---

# 22. Sync API

Design:

```http
POST /api/v1/sync
```

Request:

```json
{
  "deviceId": "device-id",
  "lastSyncAt": "timestamp",
  "operations": []
}
```

Response:

```json
{
  "acceptedOperations": [],
  "changes": [],
  "serverTime": "timestamp"
}
```

The exact structure can be improved if necessary.

The important requirement is:

```text
Push local changes
Pull remote changes
```

efficiently.

Shared request/response schemas should live in:

```text
packages/shared
```

---

# 23. API Design

Use consistent response structures.

Example:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

For errors:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOTE_NOT_FOUND",
    "message": "Note not found"
  }
}
```

Use proper HTTP status codes.

---

# 24. Backend Architecture

Inside:

```text
apps/api/src/modules/
```

use:

```text
auth/
notes/
labels/
sync/
```

Each module should contain appropriate:

```text
controller
service
repository
schema
routes
```

Example:

```text
notes/
├── note.controller.ts
├── note.service.ts
├── note.repository.ts
├── note.schema.ts
└── note.routes.ts
```

Keep responsibilities separated:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

Controllers should not contain complex business logic.

---

# 25. Mobile Repository Pattern

Create:

```text
apps/mobile/src/repositories/
```

with:

```text
note.repository.ts
label.repository.ts
user.repository.ts
sync.repository.ts
```

Example:

```ts
noteRepository.create()
noteRepository.update()
noteRepository.delete()
noteRepository.findById()
noteRepository.findAll()
noteRepository.search()
```

The UI should not directly execute SQL queries.

---

# 26. State Management

Use Zustand only for application state.

Do not use Zustand as the primary database.

Persistent note data must live in SQLite.

Architecture:

```text
SQLite
   ↓
Repository
   ↓
Zustand
   ↓
React UI
```

---

# 27. Error Handling

Handle:

- Network failures
- Database failures
- Authentication expiration
- API errors
- Sync conflicts
- Invalid input
- Retry exhaustion

Never silently swallow errors.

Provide useful logs during development.

---

# 28. Retry Strategy

For failed synchronization:

```text
Attempt 1
   ↓
Failure
   ↓
Wait
   ↓
Attempt 2
   ↓
Failure
   ↓
Exponential backoff
```

Use a reasonable maximum retry count.

Avoid infinite retry loops.

---

# 29. Testing

Write tests for critical business logic.

## Backend

```text
Auth
Notes
Labels
Sync
Idempotency
Conflict resolution
Authorization
```

## Mobile

```text
Note repository
Sync queue
Sync engine
Offline behavior
```

Especially test:

```text
Create note offline
Update note offline
Delete note offline
Reconnect
Synchronize
```

Also test multi-device synchronization.

---

# 30. Security

Implement:

- Password hashing
- JWT expiration
- Refresh token rotation where appropriate
- Input validation
- Authorization checks
- Rate limiting
- Secure token storage
- SQL injection protection through ORM
- Proper CORS configuration
- Environment variables for secrets

Never trust:

```text
user_id
note_id
device_id
```

coming from the client without validation and authorization.

A user must never be able to access another user's notes.

---

# 31. Docker

Provide Docker configuration for the backend and PostgreSQL.

Development should be possible with:

```bash
docker compose up
```

The root `docker-compose.yml` should be able to start required backend infrastructure.

Environment variables should be provided through:

```text
.env
.env.example
```

Never commit secrets.

---

# 32. PNPM Workspace

Configure the root:

```text
package.json
pnpm-workspace.yaml
turbo.json
```

Example workspace configuration:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

The root package should provide useful commands such as:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm typecheck
```

Use Turborepo to orchestrate tasks across packages.

Example:

```text
pnpm dev
    ↓
Turbo
 ├── apps/mobile
 └── apps/api
```

Use workspace dependencies for internal packages.

For example:

```text
apps/mobile
      ↓
@repo/shared

apps/api
      ↓
@repo/shared
```

Do not duplicate shared types between applications.

---

# 33. Environment Variables

Keep environment configuration separated by application.

Use appropriate files such as:

```text
.env.example
apps/api/.env.example
apps/mobile/.env.example
```

Do not commit actual secrets.

The backend must never expose server-only secrets to the mobile application.

---

# 34. Git Strategy

Use conventional commits:

```text
feat:
fix:
refactor:
test:
docs:
chore:
```

Examples:

```text
feat: add offline note creation
feat: implement note synchronization
fix: handle sync retry failure
test: add sync engine tests
```

Keep commits small and focused.

---

# 35. Development Phases

Build the project incrementally.

## Phase 1 — Monorepo Foundation

Set up:

```text
pnpm
Turborepo
apps/mobile
apps/api
packages/shared
packages/config
```

Configure:

```text
TypeScript
ESLint
Prettier
Git
```

Verify that all workspace packages can build/type-check.

---

## Phase 2 — Mobile Foundation

Set up:

```text
React Native
Expo
TypeScript
Expo Router
Zustand
SQLite
Drizzle
```

Build the basic navigation and UI.

---

## Phase 3 — Local Notes

Implement:

```text
Create
Read
Update
Delete
Pin
Archive
Colors
```

Everything must work offline.

---

## Phase 4 — Checklist

Implement checklist notes.

---

## Phase 5 — Search and Labels

Implement:

```text
Search
Labels
Filtering
```

Search must work offline.

---

## Phase 6 — Backend

Implement:

```text
Node.js
Fastify
PostgreSQL
Drizzle
Authentication
Notes API
Labels API
```

---

## Phase 7 — Shared Contracts

Move common:

```text
Types
Enums
Zod schemas
API contracts
Sync types
```

into:

```text
packages/shared
```

Both mobile and API must consume these shared definitions.

---

## Phase 8 — Synchronization

Implement:

```text
Sync queue
Push
Pull
Retry
Idempotency
Conflict handling
```

---

## Phase 9 — Multi-device Support

Test:

```text
Device A
   ↓
Server
   ↓
Device B
```

Verify that changes eventually appear on both devices.

Test conflicts and offline changes from both devices.

---

## Phase 10 — Production Hardening

Add:

```text
Rate limiting
Logging
Error monitoring
Testing
Docker
CI/CD
Database migrations
Backups
```

---

# 36. Future Features

Do not implement these in the initial MVP.

However, design the architecture so they can be added later:

```text
Images
File attachments
Voice notes
Drawing
Markdown
Rich text
Reminders
Push notifications
Shared notes
Collaborative editing
Real-time synchronization
Note history
Trash
AI summarization
AI search
Semantic search
Embeddings
Tags
Web application
Desktop application
```

---

# 37. AI Features — Future Architecture

Keep AI functionality separate from the core notes system.

Eventually support:

```text
Summarize note
Rewrite note
Extract tasks
Generate title
Semantic search
Ask questions about notes
```

Potential architecture:

```text
Mobile
   ↓
Backend
   ↓
AI Service
   ↓
LLM
```

Do not couple the note repository directly to an LLM provider.

---

# 38. Code Quality Rules

Follow these rules:

1. Use TypeScript strictly.
2. Avoid `any`.
3. Keep functions small.
4. Keep business logic out of UI components.
5. Use repository/service layers.
6. Validate external input.
7. Use meaningful names.
8. Avoid unnecessary abstractions.
9. Do not duplicate business logic.
10. Write tests for critical functionality.
11. Handle errors explicitly.
12. Keep modules independently understandable.
13. Prefer simple solutions over premature optimization.
14. Do not introduce a library when native functionality is sufficient.
15. Never hardcode secrets.
16. Do not duplicate shared types or schemas between apps.
17. Keep mobile-specific code inside `apps/mobile`.
18. Keep backend-specific code inside `apps/api`.
19. Keep genuinely shared code inside `packages/shared`.
20. Do not create circular dependencies between workspace packages.

---

# 39. Dependency Rules

Follow these dependency boundaries:

```text
apps/mobile
    ↓
packages/shared
    ↓
No dependency on apps/api

apps/api
    ↓
packages/shared
    ↓
No dependency on apps/mobile
```

Never import:

```text
apps/mobile → apps/api
apps/api → apps/mobile
```

The mobile app communicates with the API through HTTP.

The API communicates with PostgreSQL.

Shared code should remain framework-independent whenever possible.

---

# 40. Definition of Done

The MVP is complete when a user can:

1. Register.
2. Login.
3. Create a note.
4. Edit a note.
5. Delete a note.
6. Pin a note.
7. Archive a note.
8. Create checklist notes.
9. Add labels.
10. Search notes.
11. Use the application completely offline.
12. Close and reopen the application without losing data.
13. Reconnect to the internet and synchronize changes.
14. Login on another device and see synchronized notes.
15. Make changes from two devices without corrupting data.
16. Logout securely.

The application should remain responsive even when the backend is unavailable.

---

# 41. Important Development Rule

Do not try to implement the entire application in one step.

Work incrementally.

For each phase:

1. Explain what will be implemented.
2. Create the required files.
3. Implement the feature.
4. Run/type-check/test it.
5. Fix errors.
6. Verify the feature.
7. Only then move to the next phase.

Do not rewrite working code unnecessarily.

Before creating a new package, library, service, or abstraction, determine whether it is actually necessary.

If a technical decision is ambiguous, choose the simplest production-appropriate solution and document the decision.

---

# 42. Final Goal

The final application should not merely be a CRUD notes application.

The engineering goal is to demonstrate:

```text
React Native
        +
Expo
        +
PNPM Monorepo
        +
Turborepo
        +
Offline-first architecture
        +
SQLite
        +
Repository pattern
        +
Sync engine
        +
REST API
        +
Fastify
        +
PostgreSQL
        +
Authentication
        +
Shared TypeScript contracts
        +
Idempotency
        +
Conflict resolution
        +
Multi-device synchronization
```

The application should be simple for users but technically strong underneath.

The final repository must remain organized as a clean monorepo:

```text
noto/
├── apps/
│   ├── mobile/
│   └── api/
├── packages/
│   ├── shared/
│   └── config/
├── docs/
├── .github/
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

Do not deviate from this monorepo architecture without a strong technical reason.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
