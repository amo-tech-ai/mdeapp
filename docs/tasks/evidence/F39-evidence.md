# F39 — Event clarify gate + category chips — evidence

**Date:** 2026-05-20  
**Task:** `tasks/events/EVP-006-core-event-clarify-gate-and-chips.md`  
**Status:** Done

## What shipped

| Layer | Files |
|-------|-------|
| Classifier | `mdeapp/src/lib/event-query-classifier.ts` + Vitest |
| Agent | `mdeapp/src/mastra/agents/concierge.ts` — event gate + `genericAskPending` |
| Types | `mdeapp/src/lib/types.ts` — `lastEventQuery` aligned to search-events |
| UI chips | `chat-filter-chips.ts`, `chat-query-bar.tsx`, `chat-filter-copilot-instructions.tsx` |
| E2E | `SCREEN-006-event-card.spec.ts` — generic clarify + specific cards |

## MCP / official docs

- CopilotKit `useCopilotAdditionalInstructions` — verified via `project-0-mdeai-copilotkit` MCP (`available: enabled | disabled`, conditional instructions).
- Chip send uses `useCopilotChat().appendMessage` + `TextMessage` / `MessageRole` from `@copilotkit/runtime-client-gql` (CopilotKit 1.55.2 public API).

## Verification probes

| Check | Result |
|-------|--------|
| `curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/` | **200** |
| `POST /api/copilotkit` (empty body) | **400** (runtime up) |
| `npm test` | **143/143** pass |
| `npm run floor` | exit **0** |
| `SCREEN-006` Playwright | **3/3** pass (incl. generic clarify) |
| Browser MCP `/` | Events chip → sub-chips visible; `"list events medellin"` → clarify prose, no cards |

## Acceptance criteria

- [x] `"list events medellin"` → clarify + categories; no cards same turn
- [x] `"salsa events this weekend"` (EVENT_QUERY) → cards + pins
- [x] Event sub-chips when Events active
- [x] English-only copy
- [x] `"Found N events"` rule preserved in prompt + Copilot instructions

## Task grade (task-verifier rubric)

| Dimension | Score | Notes |
|-----------|-------|-------|
| Spec accuracy | A | Matches `40-prompt-questions.md` + F39 AC |
| Implementation | A | Prompt + UI + classifier + tests |
| Test coverage | A | Vitest classifier + chips + concierge schema; e2e both paths |
| Runtime proof | A | localhost + Browser MCP + Playwright |

**Overall: A — safe to mark Done**

## Screenshots

- Playwright: `mdeapp/e2e/screens/evidence/SCREEN-006/` (existing capture path)
- Browser MCP: clarify state captured 2026-05-20 (assistant asks "What kind of events…")

## Next

- **F40** event agent prompt + URL sources (post-clarify polish)
- **SCREEN-011** saved events surface
