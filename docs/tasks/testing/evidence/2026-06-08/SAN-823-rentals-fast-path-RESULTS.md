# SAN-823 — Rentals fast-path

**Date:** 2026-06-08

## Root cause

`apartments in laureles` scored **confidence 0.35** (`neighborhood + RENTAL_INTENT`) → `isGenericRentalQuery` → clarify instead of search.

## Fix

Bump `hasNeighborhood && RENTAL_INTENT_RE` confidence from **0.35 → 0.62** in `src/lib/rental-query-parser.ts`.

## Acceptance matrix (Vitest)

| Query | Expected | Test |
|-------|----------|------|
| apartments in laureles | Search | ✅ `rental-search-fast-path.test.ts` |
| 2BR poblado under $900 | Search | ✅ |
| furnished studio estadio | Search | ✅ |
| help me find a place | No fast-path | ✅ |
| I am moving soon | No fast-path | ✅ |
| list rentals medellin | Clarify | ✅ (unchanged) |

```bash
cd mdeapp && npm test -- --run src/lib/__tests__/rental-search-fast-path.test.ts src/lib/__tests__/rental-query-parser.test.ts
```

## Schedule viewing

No changes to HITL / `schedule_viewing_url` — fast-path only affects clarify gate.
