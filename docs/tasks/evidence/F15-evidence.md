# F15 evidence — search-events + event-discovery-workflow

**Date:** 2026-05-24  
**Verifier:** audit 22 doc-fix pass

## Files on disk

| File | Status |
|------|--------|
| `mdeapp/src/mastra/tools/search-events.ts` | ✅ |
| `mdeapp/src/mastra/workflows/event-discovery-workflow.ts` | ✅ |
| `mdeapp/src/mastra/agents/event-agent.ts` wires tool | ✅ |
| `mdeapp/src/mastra/agents/router.ts` lists eventDiscoveryWorkflow | ✅ |

## Tests

```bash
cd mdeapp && npm test
# includes search-events-logic.test.ts + router workflow registration tests
# 91/91 passed (2026-05-24)
```

## Remaining UI (not F15 scope)

EventCard polish → F25 + SCREEN-006. Generic render exists in `search-tool-renders.tsx`.
