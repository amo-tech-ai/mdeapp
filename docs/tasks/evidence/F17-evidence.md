# F17 evidence — rentalAgent + search-rentals + rental-search-workflow

**Date:** 2026-05-24  
**Verifier:** audit 22 doc-fix pass

## Files on disk

| File | Status |
|------|--------|
| `mdeapp/src/mastra/agents/rental-agent.ts` | ✅ |
| `mdeapp/src/mastra/tools/search-rentals.ts` | ✅ |
| `mdeapp/src/mastra/workflows/rental-search-workflow.ts` | ✅ |
| `mdeapp/src/mastra/index.ts` registers agent + workflow | ✅ |

## Tests

```bash
cd mdeapp && npm test && npm run smoke:map-pins && npm run smoke:f50-pin-sync
# 91/91 tests · 5 rental cards · 6 pins (2026-05-24)
```

## Dep note

Shipped before MAP-004 — MAP-001 + Supabase read sufficient for MVP. MAP-004 adds Places depth only.
