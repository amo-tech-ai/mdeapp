---
id: EVP-009-core
legacy_id: F34
title: hostEventAgent — Roberto's event-creation backend (PRD §51 #14)
status: Done
priority: P0
phase: W3 — Day 2 (Roberto hero flow backend)
effort: 2h (agent + instructions + memory + tools registration + tests)
owner: claude
depends_on: [F13, EVP-008-core]
skill: [mastra, gemini, copilotkit-integrations]
prd_ref: §51 task 14 · §13 + §17 (Roberto hero) · §20 generative UI
distinct_from: EVP-004-core (eventAgent — Camila/Tourist search) — this is Roberto creation
verified_against:
  - CopilotKit/examples/canvas/mastra/src/mastra/agents/index.ts (Memory.workingMemory pattern)
  - CopilotKit/examples/canvas/mastra-pm/src/mastra/agents/{index,systemPrompt}.ts (PM agent persona)
  - /home/sk/mde/my-mastra-app/src/mastra/agents/event.ts (legacy reference, READ-ONLY)
  - F02 pingAgent shape (mdeapp current)
---

# EVP-009-core — `hostEventAgent` (Roberto's wizard backend)

## 1. Purpose

Roberto says "I want to host a salsa night for 200 people in El Poblado on Saturday" → `hostEventAgent` extracts `{title, capacity, neighborhood, dateIso}` into `EventDraftState` (EVP-008-core) and surfaces what's still missing (`venue`, `priceMinCop`, `description`). It is the conversational counterpart to the EVP-010-core form-fill wizard. **Distinct from EVP-004-core `eventAgent` which is Camila/Tourist's event-SEARCH backend.**

Pattern source: `canvas/mastra-pm` step-2 (structured Zod state + agent persona) + `canvas/mastra` (memory + render UI). Persona language adapted from PRD §13 (Spanish copy deferred to Phase 2 per CLAUDE.md Language scope).

## 2. Goals

- `mdeapp/src/mastra/agents/host-event.ts` exports `hostEventAgent` (Mastra `Agent`)
- Model: `google("gemini-3.5-flash")` per CLAUDE.md registry
- `Memory.workingMemory.schema = EventDraftState` (imported from EVP-008-core)
- `scope: "thread"` working memory (matches pingAgent)
- Instructions in `mdeapp/src/mastra/agents/host-event-prompt.ts` — Spanish-friendly tone (Roberto speaks Spanish day-1) but Phase-1 surface English per CLAUDE.md
- Registered in `mdeapp/src/mastra/index.ts` agents map under key `hostEventAgent`
- F13 `LoggingMastraAgent` wraps it (ai_runs row per turn with `agent_type: event_curator`)
- ≥ 3 Vitest tests (agent id · instructions present · schema attached)
- **No tools yet** — EVP-010-core layer ships `useCopilotAction({ parameters })` actions: `set_event_basics`, `set_venue`, `set_pricing`, `preview_and_publish` (HITL EVP-011-core)

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Roberto** | "Quiero un evento de salsa para 200 en El Poblado el sábado" → agent fills 4 fields, asks for venue + price + description |
| **Camila / Tourist** | None directly — EVP-009-core backs Roberto's `/host/event/new` only |
| **Patricia** | `ai_runs.agent_type = event_curator` rows per Roberto session — usage trail |

## 4. Workflows

1. **Pre-flight:**
   - `ls /home/sk/mdeai/mdeapp/src/lib/types/event-draft.ts` (EVP-008-core must exist)
   - Verify Mastra Memory + scope:"thread" still works (F02 pingAgent pattern)
   - Confirm `event_curator` exists in `agent_type` enum (Supabase MCP — see F13 §4.2)
2. Write `mdeapp/src/mastra/agents/host-event-prompt.ts`:
   ```ts
   export const HOST_EVENT_INSTRUCTIONS = `
   You are Roberto's event-hosting assistant for Medellín.
   ...
   `; // ~30 lines; see canvas/mastra-pm step-2 systemPrompt for shape
   ```
3. Write `mdeapp/src/mastra/agents/host-event.ts`:
   ```ts
   import { Agent } from "@mastra/core/agent";
   import { google } from "@ai-sdk/google";
   import { Memory } from "@mastra/memory";
   import { LibSQLStore } from "@mastra/libsql";
   import { EventDraftState } from "@/lib/types";
   import { HOST_EVENT_INSTRUCTIONS } from "./host-event-prompt";

   export const hostEventAgent = new Agent({
     id: "host-event-agent",
     name: "Host Event Agent",
     model: google("gemini-3.5-flash"),
     tools: {},
     instructions: HOST_EVENT_INSTRUCTIONS,
     memory: new Memory({
       storage: new LibSQLStore({ id: "host-event-memory", url: "file::memory:" }),
       options: {
         workingMemory: { enabled: true, schema: EventDraftState, scope: "thread" },
       },
     }),
   });
   ```
   (Apply `// @ts-expect-error` Memory drift comment matching F02 pattern if tsc complains.)
4. Update `mdeapp/src/mastra/index.ts` agents map: `{ pingAgent, hostEventAgent }`.
5. Add Vitest at `mdeapp/src/__tests__/host-event-agent.test.ts`:
   - T-A: `hostEventAgent.id === "host-event-agent"`
   - T-B: instructions string contains "Roberto" or "event" keyword
   - T-C: `mastra.getAgentById("host-event-agent")` returns defined
6. `npm run floor` exit 0.
7. Gate 9 localhost: dev server boots, `curl :3001/api/copilotkit -X POST -d '{}'` returns HTTP 400 (endpoint alive with both agents).
8. Evidence at `tasks/notes/EVP-009-core-evidence.md`.

## 5. User journeys

- **Roberto** opens `/host/event/new` (EVP-010-core) → CopilotSidebar mounts `useCoAgent<EventDraftState>({ name: "hostEventAgent" })` → types Spanish sentence → agent fills draft → wizard reflects state in real time.
- **Patricia** queries `SELECT * FROM ai_runs WHERE agent_type='event_curator' ORDER BY created_at DESC LIMIT 10` after a Roberto session.

## 6. Agents

- **`hostEventAgent`** (NEW) — Roberto's event creator, registered in Mastra agents map. Distinct from `eventAgent` (EVP-004-core, search).

## 7. Integrations

| Integration | Purpose |
|---|---|
| `@mastra/core/agent` | Agent class |
| `@mastra/memory` | Working-memory + scope:"thread" |
| `@mastra/libsql` | In-memory store (Phase 1) — F20 may swap to Postgres |
| `@ai-sdk/google` | Gemini 3.5 Flash |
| EVP-008-core `EventDraftState` | Memory schema |
| F13 `LoggingMastraAgent` | Logs `ai_runs` row per turn |

## 8. Summary

Build Roberto's event-creation Mastra agent. Two files (agent + prompt), one registration, 3 Vitest tests. Memory schema = EVP-008-core `EventDraftState`. ~2h. Unblocks EVP-010-core (wizard UI) + EVP-011-core (HITL approval).

## 9. Definition of Done

- [ ] `mdeapp/src/mastra/agents/host-event.ts` exists exporting `hostEventAgent`
- [ ] `mdeapp/src/mastra/agents/host-event-prompt.ts` exists with persona instructions
- [ ] `mdeapp/src/mastra/index.ts` agents map includes `hostEventAgent`
- [ ] Memory uses `scope: "thread"` + `schema: EventDraftState`
- [ ] ≥ 3 Vitest tests pass
- [ ] `npm run floor` exit 0
- [ ] Localhost: `POST /api/copilotkit` returns HTTP 400 (alive); dev studio :4111 lists `host-event-agent`
- [ ] F13 logging emits `ai_runs` row with `agent_type='event_curator'` on first turn (verified via Supabase MCP)
- [ ] Evidence at `tasks/notes/EVP-009-core-evidence.md`

## 10. Tests

| # | Test | Expected |
|---|---|---|
| T1 | Agent file exists | `test -f mdeapp/src/mastra/agents/host-event.ts` |
| T2 | Prompt file exists | `test -f mdeapp/src/mastra/agents/host-event-prompt.ts` |
| T3 | Registered in mastra/index.ts | `grep -q 'hostEventAgent' mdeapp/src/mastra/index.ts` |
| T4 | Vitest ≥ 3 new pass | `npm test` |
| T5 | Gemini model pinned | `grep -q 'gemini-3.5-flash' mdeapp/src/mastra/agents/host-event.ts` |
| T6 | Schema imports from types/ | `grep -q 'EventDraftState' mdeapp/src/mastra/agents/host-event.ts` |
| T7 | Floor green | `npm run floor` exit 0 |
| T8 | Localhost POST 400 | `curl -sX POST :3001/api/copilotkit -d '{}'` returns HTTP 400 |
| T9 | ai_runs row written | Supabase MCP `SELECT count(*) FROM ai_runs WHERE agent_type='event_curator' AND created_at > <test_start>` ≥ 1 |

## 11. Rollback

```bash
rm mdeapp/src/mastra/agents/host-event.ts mdeapp/src/mastra/agents/host-event-prompt.ts
# Revert mdeapp/src/mastra/index.ts agents map to { pingAgent } only
```

## Notes

- **CopilotKit compatibility:** `hostEventAgent` is consumed by `useCoAgent<EventDraftState>({ name: "hostEventAgent" })` in EVP-010-core. Single-mount provider invariant preserved (EVP-010-core doesn't re-mount).
- **Distinct from EVP-004-core:** EVP-004-core = eventAgent (search/listing). EVP-009-core = hostEventAgent (creation). Both can coexist; F18 routerAgent (W6) dispatches by intent.
- **Spanish instructions, English UI:** prompt body Spanish (Roberto's preference) but `instructions` is server-side; UI labels in EVP-010-core stay English Phase 1.
- **20 event-template heuristics from event-planner-os** referenced in PRD #14 — defer to a follow-on task; not blocking V1.
