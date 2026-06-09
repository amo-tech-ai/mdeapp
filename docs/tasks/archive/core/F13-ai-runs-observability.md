---
id: F13
title: Port ai-runs.ts + audit-wrapper observability lib from my-mastra-app
status: Done
priority: P0
phase: W3 prep
effort: 2.5h port + hook carve-out + CopilotKit wiring
owner: claude
depends_on: [F06, F09-floor-script-and-vitest]
skill: [mastra, mde-supabase, copilotkit-integrations]
master_plan: /home/sk/mdeai/plan/05-path-a-mastra-migration.md
source_files:
  - /home/sk/mde/my-mastra-app/src/mastra/lib/ai-runs.ts (90 lines)
  - /home/sk/mde/my-mastra-app/src/mastra/lib/ai-runs-middleware.ts (90 lines — dev-server only, optional)
  - /home/sk/mde/my-mastra-app/src/mastra/tools/audit-wrapper.ts (46 lines)
  - /home/sk/mde/my-mastra-app/src/mastra/tools/risk-levels.ts (small enum)
target_files:
  - /home/sk/mdeai/mdeapp/src/mastra/lib/ai-runs.ts
  - /home/sk/mdeai/mdeapp/src/mastra/lib/log-agent-run.ts (NEW)
  - /home/sk/mdeai/mdeapp/src/mastra/copilotkit/logging-mastra-agent.ts (NEW — wraps @ag-ui/mastra)
  - /home/sk/mdeai/mdeapp/src/mastra/tools/audit-wrapper.ts
  - /home/sk/mdeai/mdeapp/src/mastra/tools/risk-levels.ts
  - /home/sk/mdeai/mdeapp/src/app/api/copilotkit/route.ts (use logging wrapper + optional JWT user_id)
integration_pattern: in-process
verified_against:
  - plan/audit/05-copilotkit-mastra-setup-checklist.md (Pattern 1 ✅ mdeapp)
  - plan/audit/04-supabase-audit.md §10 (ai_runs ~182 rows; mastra_ai_spans 932 rows)
  - CLAUDE.md hard rule "no service-role keys in mdeapp/src/**"
  - CopilotKit: https://docs.copilotkit.ai/mastra/quickstart · https://docs.copilotkit.ai/mastra/copilot-runtime · https://docs.copilotkit.ai/mastra/ag-ui
  - Mastra Pattern 2 (not mdeapp): https://mastra.ai/guides/build-your-ui/copilotkit (`registerCopilotKit` + `runtimeUrl` :4111/chat)
  - Mastra embedded: docs-server-middleware.md · reference-agents-generate.md (`onFinish` on stream/generate only)
  - `@ag-ui/mastra/dist/index.mjs` — `agent.stream()` without `onFinish`
  - `.claude/skills/copilotkit-integrations/references/integrations/mastra.md`
  - `.claude/skills/mastra/references/mdeai-concierge.md` § ai_runs logging
---

# F13 — Port `ai-runs.ts` + `audit-wrapper.ts` (observability foundation)

## 1. Purpose

Every Mastra agent turn in mdeapp should leave a **product audit row** in `public.ai_runs` (Patricia/compliance parity with legacy edge functions). Legacy `my-mastra-app` already implements the writer (`recordMastraRun`, 500ms race timeout, never throws) and tool wrapper (`withAudit`). **F14–F20 depend on this.** Native Mastra trace storage (`mastra_ai_spans`, 932 rows) is separate — F20/PgStore may extend spans later; F13 owns **`ai_runs` writes only**.

## 2. Goals

- `mdeapp/src/mastra/lib/ai-runs.ts` exports `recordMastraRun()` + `AgentType` + `MastraRunRecord`
- `mdeapp/src/mastra/lib/log-agent-run.ts` exports `logAgentRunForTurn()` — **CopilotKit/in-process** hook (required for prod chat)
- `audit-wrapper.ts` + `risk-levels.ts` ported verbatim
- First **pingAgent** chat turn inserts ≥1 row (`user_id` may be `null` for anonymous W1 smoke)
- Hook carve-out for `mdeapp/src/mastra/lib/**` + CLAUDE.md documented
- ≥2 new Vitest tests green; `npm run build` exit 0

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Sofía** | When Roberto/Camila report a slow reply, she can `SELECT * FROM ai_runs ORDER BY created_at DESC` and see agent, duration, tokens |
| **Patricia** | Compliance trail separate from Mastra Studio spans — same table legacy edge fns used |
| **Roberto / Camila** | No UX change; logging is fire-and-forget |

## 4. Workflows

### 4.1 Integration surface (read first — do not skip)

**mdeapp = CopilotKit Pattern 1 (in-process).** Do not implement [Mastra separate-server guide](https://mastra.ai/guides/build-your-ui/copilotkit) (`registerCopilotKit`, `runtimeUrl="http://localhost:4111/chat"`) in `mdeapp/` — that is Pattern 2. See `plan/audit/05-copilotkit-mastra-setup-checklist.md` §A.

| Path | Traffic | F13 wiring |
|---|---|---|
| **Pattern 1 — mdeapp prod** | Browser → `runtimeUrl="/api/copilotkit"` → `CopilotRuntime` → `getLocalAgentsWithLogging({ mastra })` → `agent.stream()` | **Required:** `LoggingMastraAgent` hooks AG-UI `run()` completion |
| **Pattern 2 — optional dev** | Studio `:4111` or `registerCopilotKit({ path: '/chat' })` | **Optional:** `ai-runs-middleware.ts` — [Mastra middleware](https://mastra.ai/docs/server/middleware) — **not** prod DoD |
| **Mastra `mastra dev`** | Concurrent subprocess; chat still works without it (in-process) | No F13 dependency on :4111 |

**Why not `pingAgent` constructor `onFinish`?** Mastra docs place `onFinish` on `agent.stream()` / `generate()` options. `@ag-ui/mastra` calls `this.agent.stream(messages, { memory, runId, clientTools, requestContext })` with no `onFinish` — so logging must wrap `MastraAgent`, not only the Agent definition.

### 4.2 Pre-flight (Supabase MCP)

```sql
-- Columns (extras OK: conversation_id, estimated_cost_usd, temperature, completed_at)
SELECT column_name, data_type FROM information_schema.columns
WHERE table_schema='public' AND table_name='ai_runs' ORDER BY ordinal_position;

-- agent_type enum — NO 'ping' label exists
SELECT enumlabel FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname LIKE '%agent_type%' ORDER BY enumsortorder;
```

**Agent name → `agent_type` mapping (use existing enum values only):**

| mdeapp agent key | `agent_name` insert | `agent_type` |
|---|---|---|
| `pingAgent` | `ping-agent` | `general_concierge` |
| `eventAgent` (F14) | `event-agent` | `event_curator` |
| `rentalAgent` (F17) | `rental-agent` | `local_scout` |
| `conciergeAgent` (F19) | `concierge-agent` | `concierge` |
| `routerAgent` (F18) | `router-agent` | `concierge` |

Do **not** add `ping` to the TypeScript union until a DB migration adds the enum label.

### 4.3 Env (both locations)

Add to **`mdeapp/.env.local`** (Next + Mastra load from app dir):

```bash
SUPABASE_URL=<same as NEXT_PUBLIC_SUPABASE_URL host>
SUPABASE_SERVICE_ROLE_KEY=<from repo root .env.local — never commit>
```

`recordMastraRun` reads `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` only (not `NEXT_PUBLIC_*`).

### 4.4 Implementation steps

1. **Hook carve-out** — `.claude/hooks/no-service-role-in-src.mjs`: allowlist `^mdeapp\/src\/mastra\/lib\/` (still block `mdeapp/src/lib/**`, components, etc.).
2. **CLAUDE.md** — append carve-out sentence under Hard rules.
3. **Copy** `ai-runs.ts`, `audit-wrapper.ts`, `risk-levels.ts` from legacy.
4. **Prune `AgentType`** — keep enum values that exist in Postgres; drop unused persona labels from TS union if desired, but inserts must use labels from §4.2 table.
5. **Add `log-agent-run.ts`:**
   ```ts
   import { recordMastraRun, type AgentType } from './ai-runs';

   export async function logAgentRunForTurn(opts: {
     agentName: string;
     agentType: AgentType;
     userId: string | null;
     status: 'success' | 'error' | 'timeout';
     durationMs: number;
     modelName?: string;
     inputSummary?: Record<string, unknown>;
     outputSummary?: Record<string, unknown>;
   }): Promise<void> {
     await recordMastraRun({
       user_id: opts.userId,
       agent_name: opts.agentName,
       agent_type: opts.agentType,
       status: opts.status,
       duration_ms: opts.durationMs,
       model_name: opts.modelName ?? 'gemini-3.5-flash',
       input_data: opts.inputSummary ?? {},
       output_data: opts.outputSummary ?? {},
     });
   }
   ```
6. **Add `logging-mastra-agent.ts`** — extend `MastraAgent` from `@ag-ui/mastra`:
   - Record `startMs` at beginning of `run()`
   - On successful `RUN_FINISHED` (override `run()` or tap the Observable’s `complete`), call `logAgentRunForTurn({ agentName: '<agent-id>', agentType: per §4.2 table, userId: null, status: 'success', durationMs })`
   - On `error` path, log `status: 'error'`
   - Export `getLocalAgentsWithLogging({ mastra, resourceId?, requestContext? })` mirroring `getLocalAgents` but instantiating `LoggingMastraAgent`
7. **Update `api/copilotkit/route.ts`:**
   ```ts
   import { getLocalAgentsWithLogging } from "@/mastra/copilotkit/logging-mastra-agent";
   // ...
   agents: getLocalAgentsWithLogging({ mastra }),
   ```
   Optional: parse `Authorization` in route and pass `resourceId` / store `userId` on `requestContext` for F08+.
8. **Optional (dev only):** copy `ai-runs-middleware.ts` + `server: { middleware: [aiRunsMiddleware] }` in `mastra/index.ts` for Mastra Studio — separate from CopilotKit DoD.

## 5. User journeys

- **Sofía:** `npm run dev` → send "hi" on `/` → query `ai_runs` → sees new row with `agent_name = ping-agent`.
- **Anonymous visitor:** same flow with `user_id IS NULL` — still counts toward DoD (legacy middleware wrongly skipped these).

## 6. Agents

- **pingAgent** — first agent logged via `LoggingMastraAgent` (all registered agents get logging automatically).
- F14+ — same wrapper; per-agent `agent_type` mapping in `logging-mastra-agent.ts` switch on `agentId`.
- F15+ tools use `withAudit()` for console pre/post (complements `ai_runs`).

## 7. Integrations

| System | Role |
|---|---|
| Supabase `public.ai_runs` | Product/compliance audit: agent, status, duration, tokens, nullable `user_id` |
| `public.mastra_ai_spans` | Mastra-native traces (932 rows live); filled by `@mastra/observability` + Postgres store in F20 — **not** F13 |
| CopilotKit `/api/copilotkit` | Primary trigger surface |
| `@ag-ui/mastra` | `MastraAgent` bridge — wrap here for logging |
| Mastra `server.middleware` | HTTP layer only ([docs](https://mastra.ai/docs/server/middleware)) — optional Studio dev |

## 8. Summary

Port legacy observability libs + **fix the integration gap**: mdeapp never hits Mastra `/chat` HTTP; logging must hook in-process. Dual-table strategy: `ai_runs` = product audit (F13), spans = Mastra-native (F20+ optional).

## 9. Definition of Done

- [x] Target files exist (including `log-agent-run.ts`, `logging-mastra-agent.ts`)
- [x] `route.ts` uses `getLocalAgentsWithLogging` (not raw `MastraAgent.getLocalAgents`)
- [x] `npm test` ≥2 new tests pass; `npm run build` exit 0
- [x] Localhost: `npm run dev` → chat "hi" → SQL: `SELECT count(*) FROM ai_runs WHERE created_at > now() - interval '10 minutes' AND agent_name = 'ping-agent'` ≥ 1 (anonymous `user_id` OK)
- [x] Hook carve-out + CLAUDE.md updated
- [x] `tasks/notes/F13-evidence.md` with probe table + SQL count + test output
- [x] Gate 9 localhost proof per anti-fake-done checklist

## 10. Tests

**Vitest (`ai-runs.test.ts`):**

- Missing env → `recordMastraRun` resolves without throw
- Mock `createClient` insert error → swallowed

**Negative:**

- No `agent_type: 'ping'` in any insert (enum violation)

**Runtime smoke:**

```bash
cd mdeapp && npm run dev
curl -sI http://localhost:3001/ | head -1   # expect 200
# Chat "hi" in UI, then Supabase MCP:
# SELECT id, agent_name, agent_type, user_id, status, duration_ms
# FROM ai_runs ORDER BY created_at DESC LIMIT 3;
```

**Rollback:** single `git revert HEAD` (files + hook + CLAUDE.md). Keys in `.env.local` stay.

**Commit:** `feat(mastra): port ai-runs + CopilotKit log hook (F13)`
