---
id: F19
title: Port conciergeAgent + search-restaurants + search-attractions + routing workflow
status: Done
priority: P0
phase: W6 — chat full surface
effort: 2h port + 1h adapt processors
owner: claude
depends_on: [F18-router-and-classify-intent]
skill: [mastra, mde-supabase, copilotkit-integrations]
copilotkit_agent_key: conciergeAgent
integration_pattern: in-process
copilotkit_docs:
  - https://docs.copilotkit.ai/mastra/agent-app-context
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write
  - https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow
  - https://docs.copilotkit.ai/mastra/human-in-the-loop/tool-based
  - https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering
master_plan: /home/sk/mdeai/plan/05-path-a-mastra-migration.md
source_files:
  - /home/sk/mde/my-mastra-app/src/mastra/agents/concierge.ts (201 lines — biggest agent)
  - /home/sk/mde/my-mastra-app/src/mastra/tools/search-restaurants.ts
  - /home/sk/mde/my-mastra-app/src/mastra/tools/search-attractions.ts
  - /home/sk/mde/my-mastra-app/src/mastra/workflows/concierge-routing-workflow.ts
  - /home/sk/mde/my-mastra-app/src/mastra/tools/__tests__/search-restaurants-logic.test.ts
  - /home/sk/mde/my-mastra-app/src/mastra/tools/__tests__/search-attractions-logic.test.ts
  - /home/sk/mde/my-mastra-app/src/mastra/types/tool-context.ts
  - /home/sk/mde/my-mastra-app/src/mastra/types/workflow-state.ts
target_files:
  - mdeapp/src/mastra/agents/concierge.ts
  - mdeapp/src/mastra/tools/search-restaurants.ts + tests
  - mdeapp/src/mastra/tools/search-attractions.ts + tests
  - mdeapp/src/mastra/workflows/concierge-routing-workflow.ts
  - mdeapp/src/mastra/types/tool-context.ts
  - mdeapp/src/mastra/types/workflow-state.ts
---

# F19 — Port `conciergeAgent` + restaurants/attractions tools + routing workflow

## 1. Purpose

The mdeai full-surface concierge agent — wraps all 4 search tools (rentals, events, restaurants, attractions) + working memory across both rental and event sub-flows + the pre-search clarification gate. Per PRD §13 + §51 task 16. Likely becomes the primary `<CopilotKit agent="conciergeAgent">` entry point in W6 chat.

**🟡 Beta API rename (verified 2026-05-20 — node_modules + MCP):** Legacy uses `inputProcessors: [PromptInjectionDetector(model), TokenLimiter(8192)]` from `@mastra/core/processors`. **Beta moves these to `@mastra/core/processors/processors/` with renamed class names** — port must use the new names:

| Legacy (1.32.x) | Beta replacement | Source path |
|---|---|---|
| `TokenLimiter(8192)` | `new TokenLimiterProcessor({ maxTokens: 8192 })` | `@mastra/core/processors/processors/token-limiter` |
| `PromptInjectionDetector({ model })` | `new ModerationProcessor({ model, ... })` + `new SystemPromptScrubber({ ... })` (defense-in-depth) | `@mastra/core/processors/processors/moderation` + `system-prompt-scrubber` |

All three classes confirmed present in `mdeapp/node_modules/@mastra/core/dist/processors/processors/`.

## 2. Goals

- `conciergeAgent` registered with 4 tools (`searchRentalsTool`, `searchEventsTool`, `searchRestaurantsTool`, `searchAttractionsTool`)
- `searchRestaurantsTool` queries `public.restaurants` (44 rows)
- `searchAttractionsTool` queries `public.tourist_destinations` (23 rows)
- `conciergeRoutingWorkflow` registered
- Working memory schema preserves: lastIntent, lastRentalQuery, lastRentalResults, selectedListingId, lastEventQuery, lastEventResults, selectedEventId
- Input processors enabled using the **beta names**: `inputProcessors: [new ModerationProcessor({ model }), new SystemPromptScrubber({}), new TokenLimiterProcessor({ maxTokens: 8192 })]` — imports come from `@mastra/core/processors/processors/*`. Do not use the legacy `PromptInjectionDetector` / `TokenLimiter` names.

## 3. Source files — port

8 files total. Same patterns as F14/F15/F17.

## 4. Workflow

1. **Pre-flight (Mastra MCP — confirm class names, no longer asking "do they exist"):**
   - `mcp__mastra__searchMastraDocs("@mastra/core/processors/processors TokenLimiterProcessor ModerationProcessor SystemPromptScrubber")`
   - `ls mdeapp/node_modules/@mastra/core/dist/processors/processors/` — expect at minimum `token-limiter.d.ts`, `moderation.d.ts`, `system-prompt-scrubber.d.ts` (already verified 2026-05-20)
   - Port uses the **renamed** classes per §-API table. Do not import `PromptInjectionDetector` or `TokenLimiter` (those identifiers do not exist on beta).

2. **Pre-flight (Supabase MCP):**
   - `restaurants` columns + `tourist_destinations` columns — confirm shape matches tools' mappers

3. **Copy 8 files** to target paths

4. **Register `conciergeAgent` + `conciergeRoutingWorkflow` in mastra/index.ts**

5. **Frontend:** Create `/chat` page with `<CopilotKit agent="conciergeAgent">` (do **not** replace W1 `pingAgent` on `/` until W6 cutover). Agent map key must be `conciergeAgent`.

## 5. API drift adjustments

| Risk | Check | Mitigation |
|---|---|---|
| `PromptInjectionDetector` identifier missing | already verified | Use `ModerationProcessor` (semantic equivalent) + `SystemPromptScrubber` (defense-in-depth) from `@mastra/core/processors/processors/{moderation,system-prompt-scrubber}` |
| `TokenLimiter` identifier missing | already verified | Use `TokenLimiterProcessor` from `@mastra/core/processors/processors/token-limiter`; constructor now accepts an options object — pass `{ maxTokens: 8192 }` |
| Workflow API same as F15/F17 | already verified | Same |

## 6. Tests

**Vitest:** port the 2 legacy `__tests__/` files (`search-restaurants-logic.test.ts`, `search-attractions-logic.test.ts`) verbatim. Add:
- `conciergeAgent.id === 'concierge-agent'`
- 4 tools registered
- working memory schema is well-formed Zod

**Integration smoke (chrome-devtools MCP):**
- Open localhost
- Type `"best cafés in Laureles for remote work"` → expects 3-5 restaurant cards
- Type `"day trip to Guatapé?"` → expects ≥1 attraction card
- Type `"1BR in Poblado"` (after previous restaurant query) → router should NOT mix intents; expects rental cards
- Verify `ai_runs` rows for each (F13)

## 7. Acceptance criteria

- [ ] 8 files at target paths
- [ ] mastra/index.ts updated
- [ ] Build, lint, tsc green
- [ ] 5+ new Vitest tests pass (2 ported + 3 new)
- [ ] Smoke chat handles all 4 tool dispatches correctly
- [ ] Working memory persists `lastRentalQuery` across turns (verified: send 1 rental query, send "show cheaper" — second call should refine, not reset)
- [ ] If processors dropped, follow-up note exists

## 8. Rollback

`git revert HEAD` removes 8 files + index update. Reverts to F18 state (router only).

## 9. Definition of Done

All ACs pass. Commit: `feat(mastra): port conciergeAgent + restaurants/attractions tools + routing workflow (F19)`.
