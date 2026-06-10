---
id: UX-036
title: Restaurant search fast path (cards without agent)
status: In Review
pr: https://github.com/amo-tech-ai/mdeapp/pull/28
priority: P0
depends_on: [UX-014]
blocks: [UX-T-037]
skill: [copilotkit-integrations, mastra, testing]
output:
  - mdeapp/src/app/api/restaurants/search/route.ts
  - mdeapp/src/lib/restaurant-query-classifier.ts
  - mdeapp/src/lib/restaurant-search-fast-path.ts
  - mdeapp/src/hooks/use-restaurant-search-fast-path.ts
  - mdeapp/src/components/chat/restaurant-fast-path-*.tsx
description: |
  Mirror event fast path — intercept restaurant queries client-side, call
  /api/restaurants/search, render RestaurantFastPathPanel. Stops conciergeAgent
  from hallucinating prose without cards (e.g. "Mamasita Medallo" with no UI).
---

# UX-036 — Restaurant search fast path

## Problem

Events/rentals use fast paths; restaurants went through `conciergeAgent` only.
Agent could describe DB rows in prose without CopilotKit tool cards rendering.

## Success criteria

- `"suggest restaurants medellin"` → `restaurant-fast-path-panel` + map pins
- CopilotKit POST delta ≤ 2 on restaurant turn (no agent round-trip)
- Café queries still route to `search-grounded-places` (not hijacked)

## Verify

```bash
cd mdeapp && npm run dev
# Browser: "suggest restaurants medellin" → 5 cards + pins
npm test -- src/lib/__tests__/restaurant-search-fast-path.test.ts
npm run test:e2e:restaurant-fast-path
```

## Verification (2026-06-01)

| Check | Result |
|-------|--------|
| Local `npm run test:e2e:restaurant-fast-path` | ✅ PASS (~13s) |
| PR #28 CI lint · test · build | ✅ PASS |
| Preview smoke | ❌ blocked (Vercel SSO) — human required before merge |
| Prod [mdeai.co](https://www.mdeai.co) | ❌ cards until #28 deployed |

## Notes

- UX-014 removed dead `writer.custom`; cards must come from fast path or disabled tool render.
- Prod POST storm remains a separate P0 (client backoff) — not fixed by this slice.
- Do not use `quiet rooftop dinner in Provenza` in **request-budget** e2e — use `suggest restaurants medellin` in **restaurant-fast-path** e2e only.
