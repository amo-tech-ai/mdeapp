# CK-V2-015 — Events chip agent path empty state

**Task:** CK-V2-015 (blocks [SAN-896 · CK-V2 — CopilotKit v2 migration sign-off](https://linear.app/sanjiovani/issue/SAN-896) until resolved or waived)

**Persona / surface:** Tourist on `/chat` — Events chip + `salsa events this weekend in Medellín` showed “No events found” while agent prose claimed results.

## Verdict

**Fixed (agent empty state)** — hybrid `search-events` results were filtered out when Events sub-chip set `category=nightlife` but salsa `queryText` maps to `music` event types.

## Root cause

1. Events chip / sub-chips write `lastEventQuery.category=nightlife` into working memory.
2. Agent calls `search-events` with `category=nightlife` + `queryText` (salsa).
3. Hybrid RPC ranks salsa rows (`hybrid_semantic`, `salsa_intent` visible in UI).
4. Post-hybrid filter in `intelligence-event-search.ts` keeps only `mapCategory(event_type) === query.category` → **music rows dropped** → `results: []` → `events-empty`.

Fast-path classifier already picks `music` from “salsa” in the user message; agent path trusted chip category.

## Fix (surgical)

- `resolveEventCategoryForQuery()` in `src/mastra/lib/intelligence-event-search.ts` — remap `nightlife` → `music` when `queryText` has salsa/live-music signals.
- Applied in `searchEvents()` before intelligent + structured search (`src/mastra/tools/search-events.ts`).
- Also shipped: AG-UI tool envelope unwrap (`normalize-tool-envelope.ts`), `ConciergeChatView` send bridge, e2e retry wording without “nightlife” pollution.

## Evidence

- Screenshot: `docs/tasks/testing/evidence/CK-V2-015/screenshots/01-events-chip-agent-path.png`
- Playwright: `e2e/ck-v2-015-events-chip.spec.ts`

## Verification

| Check | Result | Notes |
|-------|--------|-------|
| Vitest `resolveEventCategoryForQuery` | PASS | 3 new cases |
| Vitest normalize-tool-envelope + event fast-path | PASS | 33 tests |
| `infisical` `searchEvents({ category: nightlife, queryText: salsa… })` | PASS | 1 result, `hybridUsed: true` (was 0) |
| `npm run build` | PASS | |
| `npm run audit:copilotkit-v2` | PASS | |
| Playwright CK-V2-015 events chip | PASS | `event-card` ≥ 1, no `events-empty`, `consoleErrors: []` |
| Playwright regressions (rentals, cafés, events w/o chip) | PASS | `e2e/ck-v2-015-events-chip.spec.ts` (4 tests) |
| Map pins on events chip path | N/A | Weekend salsa rows may lack lat/lng — separate MAP/data task |

## Remaining (not CK-V2-015 core)

- Map pins: `ToolPinsSync` only pins geocoded rows; weekend salsa set may return events without `latitude`/`longitude`.
- E2E clarify test: update selector for v2 local-chat / fast-path clarify copy.
- Optional: route simple event queries through fast-path when `ConciergeChatView.onSubmitMessage` fires (reduces 10–31s agent latency).

## SAN-896

Keep **In Review** — card empty-state blocker cleared; full matrix needs pin data or relaxed pin assertion + clarify e2e fix.
