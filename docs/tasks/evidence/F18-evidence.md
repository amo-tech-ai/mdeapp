# F18 evidence — routerAgent + classify-intent

**Date:** 2026-05-22  
**Verifier:** Composer agent

## Beta API prereq (updated vs task spec)

Task spec (2026-05-20) claimed `Agent({ workflows })` absent on beta. **Current `@mastra/core@1.35.0` supports it:**

```bash
grep -n "workflows?" mdeapp/node_modules/@mastra/core/dist/agent/types.d.ts
# line 306: workflows?: DynamicArgument<Record<string, Workflow<...>>>
```

Verbatim legacy port with `workflows: { rentalSearchWorkflow, eventDiscoveryWorkflow }` is valid — tool-wrapper fallback not required on installed beta.

## Files on disk

| File | Status |
|------|--------|
| `src/mastra/agents/router.ts` | ✅ |
| `src/mastra/tools/classify-intent.ts` | ✅ |
| `src/mastra/types/intents.ts` | ✅ |
| `src/mastra/index.ts` registers `routerAgent` | ✅ |

## Tests

```bash
cd mdeapp && npm run typecheck && npm test
# 10 files, 62 tests passed (includes classify-intent.test.ts + router.test.ts)
```

New F18 tests:
- `src/mastra/tools/__tests__/classify-intent.test.ts` — 6 tests
- `src/mastra/agents/__tests__/router.test.ts` — 4 tests

## Runtime probes (Mastra Studio :4111)

```bash
curl -s -X POST http://localhost:4111/api/agents/router-agent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"hi"}]}'
# → polite chitchat reply, no workflow error

curl -s http://localhost:4111/api/agents/router-agent | jq -r '.name'
# → Router Agent
```

## Frontend note

F18 AC optional W6 rewire: **`/chat` uses `conciergeAgent` (F19)** as canonical product entry. `routerAgent` remains registered for internal dispatch / future multi-agent routing — not exposed on a dedicated route.

## Build

`npm run build` exit 0 (after fixing `search-restaurants.ts` import `./search-events`).
