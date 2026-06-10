# F19 evidence — conciergeAgent + restaurants/attractions + /chat

**Date:** 2026-05-22  
**Verifier:** Composer agent

## Files on disk

| File | Status |
|------|--------|
| `src/mastra/agents/concierge.ts` | ✅ 4 tools + WM schema + beta processors |
| `src/mastra/tools/search-restaurants.ts` | ✅ |
| `src/mastra/tools/search-attractions.ts` | ✅ |
| `src/mastra/workflows/concierge-routing-workflow.ts` | ✅ |
| `src/mastra/types/tool-context.ts` | ✅ |
| `src/mastra/types/workflow-state.ts` | ✅ |
| `src/app/chat/layout.tsx` | ✅ `agent="conciergeAgent"` |
| `src/app/chat/page.tsx` | ✅ CopilotSidebar shell |

## Processors (beta names)

```ts
inputProcessors: [
  new ModerationProcessor({ model: FLASH_MODEL, strategy: "warn" }),
  new SystemPromptScrubber({ model: FLASH_MODEL, strategy: "warn" }), // @ts-expect-error type union drift
  new TokenLimiterProcessor({ limit: 8192 }),
]
```

Imports from `@mastra/core/processors`.

## Tests

```bash
cd mdeapp && npm test
# 62 passed total

# F19-specific:
# - src/mastra/agents/__tests__/concierge.test.ts (5 tests)
# - src/mastra/tools/__tests__/search-restaurants-logic.test.ts (ported)
# - src/mastra/tools/__tests__/search-attractions-logic.test.ts (ported)
```

Working memory schema exported as `conciergeWorkingMemorySchema` for Vitest.

## Localhost proof (gate 9)

```bash
npm run dev:ui   # → http://localhost:3000
npm run dev:agent # → http://localhost:4111

curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/chat
# → 200

curl -s -o /dev/null -w '%{http_code}' -X POST http://localhost:3000/api/copilotkit \
  -H 'Content-Type: application/json' -d '{}'
# → 400 (runtime alive, empty body rejected)
```

## Mastra integration smoke

```bash
# Restaurant tool dispatch
curl -s -X POST http://localhost:4111/api/agents/concierge-agent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"list one restaurant in Laureles"}]}'
# → text includes "Mondongos Laureles", toolResults: 1

# Chitchat baseline
curl -s -X POST http://localhost:4111/api/agents/concierge-agent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Say hello in one word"}]}'
# → {"text":"Hello"}
```

## Working memory (schema + instructions)

Vitest verifies `conciergeWorkingMemorySchema` accepts `lastRentalQuery` + `selectedListingId` for follow-up refinement. Agent instructions encode "show cheaper options" → refine `lastRentalQuery` (multi-turn E2E deferred to MAP-001 Playwright).

## Build fix applied

`search-restaurants.ts`: changed `import ... from './search-events.js'` → `'./search-events'` (Turbopack module resolution).

## Out of scope (MAP-001 follow-on)

- vis.gl map pins on `/chat`
- `useCopilotAction` generative UI cards
- Playwright multi-turn "show cheaper" E2E
