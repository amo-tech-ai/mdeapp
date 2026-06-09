---
id: MASTRA-002
title: Wire routerAgent on /chat (replace pingAgent on product surface)
status: Superseded
superseded_by: ../core/F19-concierge-and-restaurants-attractions.md
superseded_note: F19 ships conciergeAgent on `/`; `/chat` redirects to `/` — do not execute
priority: P0
phase: MVP — Mastra M2
effort: 1-2h
owner: claude
depends_on: [../maps/MAP-001-platform-map-pipeline.md, MASTRA-001]
blocks: [MASTRA-003]
skill: [copilotkit-integrations, mastra, mde-maps]
plan_ref: ../../plan/mastra/mastra-roadmap.md § MVP M2
target_files:
  - mdeapp/src/app/chat/layout.tsx
  - mdeapp/src/app/chat/page.tsx
  - mdeapp/src/lib/types.ts
verified_against:
  - ../../CopilotKit/examples/integrations/mastra/
  - ../../plan/mastra/03-best-practices.md
  - ../../plan/mastra/05-mastra-copilotkit.md
  - https://docs.copilotkit.ai/mastra/quickstart
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write
example_canon:
  runtime: integrations/mastra
  patterns_not_runtime:
    - CopilotKit/examples/canvas/mastra
    - CopilotKit/examples/canvas/mastra-pm
  note: Copy Zod/HITL patterns from canvas examples only — never downgrade CK pin or replace Pattern 1 route
crosswalk: ./CROSSWALK-ck-ui-e2e-state.md
follow_on_ck: [CK-001, CK-002, CK-005, CK-007]
integration_surface:
  pattern: Pattern 1 — Next POST /api/copilotkit → getLocalAgentsWithLogging
  agent_map_key: routerAgent
  not: Mastra HTTP :4111 for prod DoD
observability_table: public.ai_runs — agent_name router-agent per log-agent-run.ts
---

# MASTRA-002 — Wire `routerAgent` on `/chat`

## Easy summary

| | |
|---|---|
| **In one line** | Swap `/chat` from MAP-001’s **`pingAgent`** test wiring to the **real concierge router**. |
| **Who cares** | **Camila** · **Tourist** · **Sofía** (MVP outcome O4) |
| **Effort** | ~1–2 hours · **requires MAP-001 Done** |

**Real-world example — Camila:** She opens **`/chat`**, types *“2BR in El Poblado under $90/night.”* **CopilotKit** sidebar + map (MAP-001). **Mastra `routerAgent`** runs **`rentalSearchWorkflow`** — not **`pingAgent`** echo.

**Follow-up caveat:** `routerAgent` has **no `memory` block** today. Thread stickiness (“show cheaper”) is **prompt + CopilotKit thread** only until **MASTRA-003** (PostgresStore). Do not claim turn-11 recall in this task.

**MAP-001 handoff:** MAP-001 ships `/chat` with **`pingAgent`** + test pin tool. This task **replaces** nested provider to **`routerAgent`**, updates `useCoAgent`, and removes or repoints the MAP-001 test tool.

**Done looks like:** `curl :3001/chat` → 200; rental query → `ai_runs` with `router-agent`; evidence file.

---

## 1. Purpose

MVP **O4** requires unified concierge on `/chat`. MAP-001 delivers shell + map; this task switches **`pingAgent` → `routerAgent`** for classify → workflow dispatch.

**Keep `pingAgent` on `/`** only (root `app/layout.tsx` unchanged).

## 2. Integration surface

| Surface | mdeai | DoD probe |
|---------|-------|-----------|
| Pattern 1 in-process | ✅ `/api/copilotkit` | POST 200/400 from `/chat` session |
| Mastra HTTP :4111 | Studio debug only | **N/A** for Done |
| Agent map key | `routerAgent` | `grep agent= app/chat` + `useCoAgent` name |
| Agent `id` (logging) | `router-agent` | `SELECT agent_name FROM ai_runs …` |

## 3. Goals

- **`app/chat/layout.tsx`** — nested `<CopilotKit runtimeUrl="/api/copilotkit" agent="routerAgent">` wrapping MAP-001 chat subtree. **Do not** change root `app/layout.tsx` (`agent="pingAgent"`).
- **`app/chat/page.tsx`** — `useCoAgent({ name: "routerAgent" })`; keep MAP-001 three-panel + `<CopilotSidebar>` placement.
- English labels; sidebar copy reflects router mode (not day-1 echo).
- One manual turn: rental-style query → evidence in `ai_runs` (`agent_name = 'router-agent'` per F13 mapping).
- **Shared-state smoke (manual):** if map/card selection uses `useCoAgent` state, verify selection visible on next turn; note [CopilotKit #3426](https://github.com/CopilotKit/CopilotKit/issues/3426) if `useCopilotReadable` context fails to propagate.
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/chat` → **200**.

## 4. Acceptance criteria

- [ ] MAP-001 Done — `/chat` three-panel shell exists.
- [ ] `app/chat/layout.tsx` — `<CopilotKit agent="routerAgent">` (map key, not `id: "router-agent"`).
- [ ] `useCoAgent({ name: "routerAgent" })` matches `mastra/index.ts` agents key.
- [ ] Grep proof: `agent="routerAgent"` under `src/app/chat`; `agent="pingAgent"` only in root `layout.tsx`.
- [ ] POST `/api/copilotkit` returns **200 or 400** (not 404) while on `/chat`.
- [ ] `ai_runs` row with `agent_name = 'router-agent'` after one chat turn.
- [ ] `npm run floor` green.
- [ ] Pin↔card sync → [`CK-005`](../copilotkit/BACKLOG-ck-gaps.md) after F46 (not blocker for MASTRA-002 Done).
- [ ] AG-UI SSE smoke → [`CK-001`](../copilotkit/BACKLOG-ck-gaps.md) + [`CK-007`](../copilotkit/BACKLOG-ck-gaps.md) (production-ready Camila path, not MASTRA-002 Done).
- [ ] Typed `MapUiState` → [`CK-002`](../copilotkit/BACKLOG-ck-gaps.md) + MAP-001.
- [ ] Evidence: `tasks/notes/MASTRA-002-evidence.md` (curl + SQL + screenshot).

## 5. Verification commands

```bash
cd /home/sk/mdeai/mdeapp && npm run dev
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/chat
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/copilotkit \
  -H "Content-Type: application/json" -d '{}'
# Agent wiring (must pass before Done):
grep -R 'agent="routerAgent"' mdeapp/src/app/chat
grep -R 'useCoAgent({ name: "routerAgent" })' mdeapp/src/app/chat
grep 'agent="pingAgent"' mdeapp/src/app/layout.tsx
# SQL (Supabase): SELECT agent_name, created_at FROM ai_runs ORDER BY created_at DESC LIMIT 3;
cd /home/sk/mdeai/mdeapp && npm run floor
```

## 6. Anti-patterns

- Do not register 7 parallel module agents on `/chat` — router + workflows only.
- Do not call legacy `ai-chat` edge from mdeapp.
- Do not point `runtimeUrl` at `:4111` on Vercel.

## 7. Personas

| Persona | Surface | Notice |
|---------|---------|--------|
| **Camila** | `/chat` | Real rental/event routing, not echo bot |
| **Patricia** | `ai_runs` | `router-agent` rows from `/chat` |
| **Sofía** | `/` | Still `pingAgent` smoke |
