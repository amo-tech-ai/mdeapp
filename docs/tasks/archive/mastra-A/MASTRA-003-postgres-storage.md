---
id: MASTRA-003
aliases: [PROD-STORAGE-001]
title: PostgresStore + shared thread memory (production blocker — before MAP-001)
status: Done
priority: P0
phase: Production gate — shipped 2026-05-22
effort: 3-4h
owner: claude
depends_on: [MASTRA-002, ../../mvp.md]
blocks: []
skill: [mastra, mde-supabase, mde-vercel]
plan_ref: ../../plan/mastra/mastra-roadmap.md § Post-MVP
audit_ref: ../../plan/mastra/audit/00-supabase-mastra-audit.md
cross_task: ../core/F20-evaluation-and-deploy-prep.md
follow_on_ck: [CK-008]
target_files:
  - mdeapp/package.json
  - mdeapp/package-lock.json
  - mdeapp/src/mastra/index.ts
  - mdeapp/src/mastra/lib/agent-memory.ts
  - mdeapp/src/mastra/agents/index.ts
  - mdeapp/src/app/api/copilotkit/route.ts
  - mdeapp/.env.local
verified_against:
  - ../../plan/mastra/examples/features/08-storage.md
  - https://mastra.ai/docs/memory/storage
  - Supabase project zkwcbyxiwklihegjhuql (mastra_messages RLS service_role)
integration_surface:
  pattern: Pattern 1 — persistence server-side in Mastra storage + route thread/resource
  observability: ai_runs unchanged; mastra_messages for thread proof
---

# MASTRA-003 — PostgresStore + thread memory

## Easy summary

| | |
|---|---|
| **In one line** | Save chat history in **Supabase Postgres** so Camila’s thread survives cold start. |
| **Who cares** | **Camila** · **Patricia** (support) |
| **Effort** | ~3–4 hours · **shipped** 2026-05-22 as **PROD-STORAGE-001** |

**Real-world example:** Camila on `www.mdeai.co` — `/api/copilotkit` was **500** with `mastra-agent-memory.db` on read-only Vercel FS; after this fix, concierge runs and Postgres logs `[mastra-storage] using Postgres`.

**Ordering:** **Before MAP-001 deploy** (and any map UI work). Production CopilotKit was blocked without this — not a post-MVP nice-to-have anymore.

**F20 split:** **MASTRA-003 owns PostgresStore.** F20 = scorers + deploy prep only — no duplicate storage work in F20.

---

## 1. Purpose

Today three ephemeral stores exist:

| Store | Location |
|-------|----------|
| Instance | `mastra/index.ts` → `LibSQLStore(:memory:)` |
| Agent memory helper | `agent-memory.ts` → `file:mastra-agent-memory.db` |
| pingAgent WM | `agents/index.ts` → `LibSQLStore(file::memory:)` |

Replace with **one shared `PostgresStore`** (`@mastra/pg`). Supabase audit: **GO** — `mastra_messages` tables exist.

## 2. Pre-flight (before coding)

1. `npm install @mastra/pg` in `mdeapp/`.
2. Verify export: `node -e "import('@mastra/pg').then(m => console.log(Object.keys(m)))"` — confirm `PostgresStore` exists (MCP docs may lag; **lockfile + node_modules win**).
3. Read [Mastra storage docs](https://mastra.ai/docs/memory/storage) + [`08-storage.md`](../../plan/mastra/examples/features/08-storage.md).
4. Supabase MCP: confirm `mastra_messages` table + RLS (service_role for Mastra server writes).

## 3. Goals

- `npm install @mastra/pg` — **`@mastra/pg` not in lockfile today** (MCP `listMastraPackages` confirms only core/deployer/loggers/memory/server).
- Import `PostgresStore` from `@mastra/pg` per [official storage docs](https://mastra.ai/docs/memory/storage).
- **`DATABASE_URL`** — Supabase **pooler**, server-only (never `NEXT_PUBLIC_*`). Dev pool `max: 3`, prod `max: 10` per `plan/mastra/02-best-old.md`.
- **`createThreadMemory`** uses **same** store instance as `Mastra({ storage })`.
- **`route.ts`** — pass CopilotKit **thread + resource** (session user id) into `getLocalAgentsWithLogging({ mastra, resourceId, requestContext })` per `08-storage.md`.
- One chat turn → ≥1 new row in `mastra_messages` (SQL proof).
- Vercel Production: `DATABASE_URL` set.
- `npm run build` + `npm run floor` green.

## 4. Acceptance criteria

- [ ] `@mastra/pg` in `package.json` / lockfile.
- [ ] `rg ':memory:|file::memory:|file:mastra-agent-memory' mdeapp/src/mastra` → **0** matches.
- [ ] Local multi-turn chat → `SELECT count(*) FROM mastra_messages` increases (thread id in evidence).
- [ ] **Cold-start recall:** redeploy or restart dev → turn N+1 recalls prior thread (manual evidence step).
- [ ] `ai_runs` still writes (F13 not regressed).
- [ ] **Production cutover gate:** no prod promotion until cold-start test passes.
- [ ] Evidence: `tasks/notes/MASTRA-003-evidence.md` (SQL + env redaction).

## 5. Verification commands

```bash
cd /home/sk/mdeai/mdeapp && npm install @mastra/pg
node -e "import('@mastra/pg').then(m => console.log('PostgresStore' in m ? 'ok' : 'missing'))"
rg ':memory:|file::memory:|file:mastra-agent-memory' mdeapp/src/mastra
cd /home/sk/mdeai/mdeapp && npm run floor
# After chat on /chat:
# SELECT id, thread_id, created_at FROM mastra_messages ORDER BY created_at DESC LIMIT 5;
```

## 6. Defer

- `@mastra/observability` → `mastra_ai_spans` dual-write (F20 optional).
- `MastraCompositeStore` / ClickHouse — Phase 2+.

## 7. Personas

| Persona | Notice |
|---------|--------|
| **Camila** | Chat survives redeploy |
| **Patricia** | Support can query `mastra_messages` by thread |
