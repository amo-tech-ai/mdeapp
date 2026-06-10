# PR #153 — Restaurant filter chips — verification

**Branch:** `ui/restaurant-filter-chips`  
**PR:** https://github.com/amo-tech-ai/mdeapp/pull/153  
**Date:** 2026-06-09  
**Persona:** Tourist on `/chat`

## Summary

Generic restaurant asks show one clarify + filter chips; chip tap or specific query runs fast-path search without agent interview.

## Checks

| Check | Command / surface | Result |
|-------|-------------------|--------|
| Vitest classifier + fast path | `npm test -- --run src/lib/__tests__/restaurant-search-fast-path.test.ts src/components/chat/__tests__/restaurant-filter-chips.test.tsx` | ✅ 12/12 pass |
| Typecheck | `npx tsc --noEmit` | ✅ pass (local) |
| Localhost chip flow | `suggest restaurants` → `restaurant-filter-chips` → tap Italian → 3 cards + pin | ✅ manual browser |
| Localhost immediate search | `fine dining modern poblado` → 1 card El Poblado, no second clarify | ✅ manual browser |
| Floor CI | GitHub Actions `floor` on PR #153 | ⏳ re-run after lint fix |
| Vercel preview | PR #153 deployment | ✅ pass |
| Prod Tier-2 | `https://www.mdeai.co/chat` after merge | ⏳ pending deploy |

## Screenshots

- `restaurant-filter-chips-italian.png` (localhost, Italian chip → 3 restaurants)

## Notes

- `/chat` mobile layout below `lg` (1024px); automated Chrome may use narrow viewport — use ≥1360px for desktop 3-pane proof.
- Geolocation "Near me" not exercised in CI (browser permission); fallback chips verified in unit tests.
