---
id: MASTRA-001
title: Mastra core wiring smoke — router, workflows, tools
status: Done
completed_at: 2026-05-24
note: Vitest + smokes + smoke:map-pins; evidence at tasks/notes/MASTRA-001-evidence.md
priority: P0
phase: W3 — Mastra core (before /chat router)
effort: 2-3h
owner: claude
depends_on: [../core/F09-floor-script-and-vitest.md, ../core/F13-ai-runs-observability.md]
blocks: [MASTRA-002, MASTRA-004]
skill: [mastra, copilotkit-integrations, testing, mastra-smoke-test]
plan_ref: ../../plan/mastra/mastra-roadmap.md § MVP prep
prd_ref: ../../plan/mastra/prd-mastra.md §2.4
target_files:
  - mdeapp/src/mastra/index.ts
  - mdeapp/src/mastra/agents/router.ts
  - mdeapp/src/mastra/workflows/rental-search-workflow.ts
  - mdeapp/src/mastra/workflows/event-discovery-workflow.ts
  - mdeapp/src/mastra/tools/classify-intent.ts
  - mdeapp/src/mastra/tools/search-rentals.ts
  - mdeapp/src/mastra/tools/__tests__/classify-intent.test.ts
  - mdeapp/src/mastra/tools/__tests__/search-rentals-logic.test.ts
  - mdeapp/src/__tests__/mastra-router-smoke.test.ts
  - mdeapp/src/__tests__/smoke.test.ts
verified_against:
  - ../../CopilotKit/examples/integrations/mastra/
  - ../../plan/mastra/03-best-practices.md
  - ../../plan/mastra/05-mastra-copilotkit.md
  - https://mastra.ai/docs/workflows/overview
example_canon:
  runtime: integrations/mastra
  patterns_not_runtime: [canvas/mastra, canvas/mastra-pm]
crosswalk: ./CROSSWALK-ck-ui-e2e-state.md
integration_surface:
  pattern: Pattern 1 in-process only
  probe: grep getLocalAgentsWithLogging mdeapp/src/app/api/copilotkit/route.ts
  studio: localhost:4111 optional — not required for DoD
observability_table: ai_runs only (F13) — mastra_ai_spans out of scope
---

# MASTRA-001 — Core wiring smoke (router + workflows + tools)

## Easy summary

| | |
|---|---|
| **In one line** | Prove the “backstage brain” (router + workflows + search tools) actually works before Camila sees it on the map. |
| **Who cares** | **Sofía** (CI) · **Lucía** (regression) |
| **Effort** | ~2–3 hours |

**Real-world example:** Camila will eventually ask *“2BR in Laureles under $80.”* Behind the scenes, **Mastra `routerAgent`** should classify that as `rental_search` and run **`rentalSearchWorkflow`**, which calls **`search-rentals`** against Supabase. That code **exists** in `mdeapp` today, but `/` still uses **`pingAgent`** echo — no automated proof the router registration and workflow steps hold.

**What this task does (plain English):**

- Adds **deterministic Vitest** (no live Gemini calls) so broken router/workflow registration fails CI.
- Tests **`classify-intent` schema**, workflow step output shape, and **`search-rentals`** empty-DB handling.
- Optional: Mastra Studio (`localhost:4111`) lists `routerAgent` + workflows.

**CopilotKit vs Mastra here:**

| Piece | Role in this task |
|-------|-------------------|
| **Mastra** | Router, workflows, tools — **this is what we test** |
| **CopilotKit** | Not on `/chat` yet — **MASTRA-002** after **MAP-001** |

**Done looks like:** `npm test` + `npm run floor` green; evidence file with test output.

---

## 1. Purpose

`mdeapp` registers **routerAgent**, **three workflows** (`rentalSearch`, `eventDiscovery`, `conciergeRouting`), and **five search tools** — but nothing proves dispatch wiring end-to-end in CI. This task adds **unit/smoke tests** so Sofía can merge Mastra changes without guessing.

**Not in scope:** `/chat` UI (MASTRA-002 + MAP-001), PostgresStore (MASTRA-003), live LLM integration tests, new agent ports (F14–F19).

**Out of scope note:** `conciergeRoutingWorkflow` is registered on `Mastra({ workflows })` but **not** on `routerAgent.workflows` — smoke must **not** assume concierge dispatch from router.

## 2. Goals

- **`classify-intent`** — Vitest on `intentSchema` + tool passthrough (tool echoes input; test schema, not Gemini).
- **`search-rentals-logic.test.ts`** — add missing test file; **mock Supabase client** — never hit production DB (match pattern in existing `search-*-logic.test.ts`).
- **Workflow steps** — `rentalSearchWorkflow` and `eventDiscoveryWorkflow` return structured output; empty DB → graceful empty array (no throw).
- **Router registration** — extend `mastra-router-smoke.test.ts`: `routerAgent` has `classifyIntentTool` + `rentalSearchWorkflow` + `eventDiscoveryWorkflow` keys; `mastra/index.ts` lists all six agent keys.
- **Follow-up / confidence rules** — document in test comments only (router prompt text); **do not** call Gemini to assert “show cheaper” behavior in CI.
- Fix any **pre-existing ESLint blockers** under `mdeapp/src/mastra/**` that prevent `npm run floor` (e.g. unused vars in tools).
- `npm run floor` exit 0 after new tests.
- Evidence: `tasks/notes/MASTRA-001-evidence.md` with test output + optional Studio screenshot.

## 3. Acceptance criteria

- [ ] `src/__tests__/mastra-router-smoke.test.ts` — **≥3** cases green (registration + workflow keys).
- [ ] `src/mastra/tools/__tests__/classify-intent.test.ts` — schema + execute passthrough.
- [ ] `src/mastra/tools/__tests__/search-rentals-logic.test.ts` — empty/mock DB graceful path.
- [ ] Existing tool logic tests still pass (`search-events`, `search-restaurants`, `search-attractions`).
- [ ] Evidence documents: Mastra map keys (`routerAgent`) ≠ agent `id` (`router-agent`) for future `useCoAgent({ name })`.
- [ ] Optional: `npm run dev` → Studio :4111 lists router + workflows.
- [ ] Optional: AG-UI SSE lifecycle → [`CK-001`](../copilotkit/BACKLOG-ck-gaps.md), [`CK-007`](../copilotkit/BACKLOG-ck-gaps.md) after MASTRA-002 (not MASTRA-001 DoD).
- [ ] No new service-role exposure in client bundles.
- [ ] `npm run floor` exit 0.

## 4. Verification commands

```bash
cd /home/sk/mdeai/mdeapp && npm test
cd /home/sk/mdeai/mdeapp && npm run floor
# Optional Studio
cd /home/sk/mdeai/mdeapp && npm run dev:agent
```

## 5. Personas

| Persona | Value |
|---------|-------|
| **Sofía** | CI catches broken workflow registration before Camila sees empty cards |
| **Lucía** | Regression anchor before MAP-001 map work |

## 6. Anti-patterns

- Do not add Playwright or CopilotKit UI tests here — MASTRA-002 + MAP-001.
- Do not call **live Gemini** in Vitest — schema/workflow/registration only.
- Do not call **Supabase production** from CI — `vi.mock` the client or use fixtures; service-role only in server runtime, never in tests without mocks.

## 7. Mock-safe test rules

| Rule | Why |
|------|-----|
| `vi.mock('@/lib/supabase/...')` or inject test doubles | Prevents accidental prod writes |
| No `GOOGLE_GENERATIVE_AI_API_KEY` in test path | Keeps CI deterministic + free |
| Workflow tests use empty/mock query results | Proves shape, not live listings |
