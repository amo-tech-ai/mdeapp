# F14 evidence — eventAgent port

**Date:** 2026-05-24  
**Verifier:** audit 22 doc-fix pass  
**Status note:** Code shipped ahead of spec flip — do not re-port from legacy.

## Files on disk

| File | Status |
|------|--------|
| `mdeapp/src/mastra/agents/event-agent.ts` | ✅ |
| `mdeapp/src/mastra/index.ts` registers `eventAgent` | ✅ |

## Tests

```bash
cd mdeapp && npm test
# 91/91 passed (2026-05-24) — smoke.test.ts includes eventAgent registration
```

## Gate 9

Localhost: `conciergeAgent` on `/` can route to event discovery; agent registered in Mastra Studio (`npm run dev:agent` :4111).
