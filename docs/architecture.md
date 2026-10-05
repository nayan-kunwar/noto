# Architecture

Local-first: `apps/mobile` reads/writes SQLite via repositories. Zustand mirrors SQLite, never the network.

```text
UI -> Hooks -> Repository -> SQLite -> Sync Queue -> Sync Engine -> API Client -> Fastify -> Postgres
```

* Mobile: Expo Router (`app/`), `src/db` (Drizzle + expo-sqlite), `src/repositories` (CRUD + enqueue), `src/store` (Zustand mirror), `src/sync` (engine/queue/LWW/retry), `src/services` (api-client/auth/network).
* API: `src/modules/{auth,notes,labels,sync}` each with repository/service/routes (+ `conflict-resolver.ts` for sync). Thin controllers in routes, business logic in services. `src/plugins`, `src/middleware` (auth/error/rate-limit), `src/db/schema`.
* Shared: `@repo/shared` types + Zod (`note/auth/sync`), enums, `ApiResponse` envelope. Both apps import from here; no duplication.
