---
id: MASTRA-004
title: ai_runs user_id + withAudit on all search tools
status: Done
priority: P1
phase: W3 — Mastra core hygiene
effort: 1.5h
owner: claude
depends_on: [../core/F08-supabase-auth-login-page.md, ../core/F13-ai-runs-observability.md, MASTRA-001]
skill: [mastra, mde-supabase, copilotkit-integrations]
plan_ref: ../../plan/mastra/audit/00-supabase-mastra-audit.md §4
target_files:
  - mdeapp/src/mastra/copilotkit/logging-mastra-agent.ts
  - mdeapp/src/mastra/lib/log-agent-run.ts
  - mdeapp/src/app/api/copilotkit/route.ts
  - mdeapp/src/mastra/tools/search-rentals.ts
  - mdeapp/src/mastra/tools/search-events.ts
  - mdeapp/src/mastra/tools/search-restaurants.ts
  - mdeapp/src/mastra/tools/search-attractions.ts
  - mdeapp/src/mastra/tools/audit-wrapper.ts
  - mdeapp/src/mastra/lib/log-agent-run.test.ts
cross_task: ../core/F13-ai-runs-observability.md
integration_surface:
  pattern: Pattern 1 — session read in route.ts → LoggingMastraAgent → logAgentRunForTurn
observability_table: public.ai_runs only — mastra_ai_spans out of scope
---

# MASTRA-004 — `ai_runs` user_id + tool audit coverage

## Easy summary

| | |
|---|---|
| **In one line** | Logged-in users get `user_id` on AI runs; all four search tools use **`withAudit`**. |
| **Who cares** | **Patricia** (ops) · **Camila** (logged-in leads) |
| **Effort** | ~1.5 hours · after **MASTRA-001**; logged-in `/chat` proof after **MASTRA-002** |

**Patricia example:**

```sql
SELECT * FROM ai_runs WHERE user_id = '<camila-uuid>' ORDER BY created_at DESC LIMIT 10;
```

Today `LoggingMastraAgent` hardcodes **`userId: null`**. After this task, authenticated sessions populate `user_id`.

---

## 1. Purpose

F13 ships turn logging; Patricia needs identity + tool audit trails on search side-effects.

**Out of scope:** `classify-intent` (read-only passthrough, no audit wrapper).

## 2. Integration surface

| Layer | Change |
|-------|--------|
| `route.ts` | `createServerClient` → session user id → `getLocalAgentsWithLogging({ mastra, resourceId, requestContext })` |
| `logging-mastra-agent.ts` | Pass `userId` into `logAgentRunForTurn` (not hardcoded `null`) |
| Search tools | Wrap execute with `withAudit` + risk levels |

## 3. Goals

- Probe **`agent_type` enum** via Supabase SQL before adding labels (`router-agent` → `concierge` per `log-agent-run.ts`).
- Route: Supabase session JWT → `userId` + `resourceId` (user uuid or `anonymous`).
- **`withAudit`** on: `search-rentals`, `search-events`, `search-restaurants`, `search-attractions`.
- Vitest: mock session → log payload includes `userId`.
- **Anonymous regression:** logged-out chat still inserts `ai_runs` with `user_id IS NULL`.
- Logged-in proof on `/chat` (after MASTRA-002) → `user_id` not null.

## 4. Acceptance criteria

- [ ] Supabase enum probe documented in evidence (no invented `agent_type` values).
- [ ] `route.ts` passes session into logging wrapper (grep `resourceId` / `userId`).
- [ ] ≥1 Vitest for `user_id` propagation.
- [ ] All four search tools import/use `withAudit`.
- [ ] **Dual-path evidence:** anonymous chat → `user_id IS NULL`; logged-in user → `user_id` = session uuid.
- [ ] Evidence: `tasks/notes/MASTRA-004-evidence.md`.
- [ ] `npm run floor` green.

## 5. Verification commands

```bash
cd /home/sk/mdeai/mdeapp && npm test
cd /home/sk/mdeai/mdeapp && npm run floor
# Supabase MCP or SQL:
# SELECT enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname ILIKE '%agent_type%';
# SELECT user_id, agent_name FROM ai_runs ORDER BY created_at DESC LIMIT 5;
```

## 6. Personas

| Persona | Notice |
|---------|--------|
| **Patricia** | Support tickets tied to Camila’s account |
| **Camila** | Logged-in rental search auditable |
