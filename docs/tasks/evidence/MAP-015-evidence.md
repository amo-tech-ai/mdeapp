# MAP-015 evidence — place card ↔ pin sync

**Date:** 2026-05-25  
**Status:** Done

## Change

- `PlaceResultCard` — `pinId`, `selected`, `onSelect` (F50 pattern)
- `GenericResults` + `GroundedResults` — `panToPin`, `data-pin-id`, scroll-into-view on select

## Verification (localhost :3001)

| Check | Result |
|-------|--------|
| `npm run smoke:f50-pin-sync` | rental card ↔ pin ✅ (regression) |
| Vitest `place-result-card.test.tsx` | pin attrs render |
| `npm run floor` | exit 0 |

**Manual (grounded):** card click calls `panToPin(grounded-{id})` — same path as rentals; verify with grounding query when ADK sidecar reachable.
