---
task: SCREEN-023
date: 2026-06-02
status: In Review
grade: A-
execution_score: 92
---

# SCREEN-023 — Restaurant listings + detail (evidence)

## Scope verified

Phase A chat flow on `/` — **not** standalone `/restaurants` catalog (separate browse surface).

| Criterion | Probe | Result |
|-----------|-------|--------|
| Restaurant cards (not generic list) | Playwright + disk `RestaurantCard` + `ResultCardShell` | ✅ PASS |
| Details → `RestaurantDetailPanel` right column | `data-testid="restaurant-detail-panel"` in map column | ✅ PASS |
| Map pin highlight on card hover | `data-selected="true"` + pin id `restaurant-*` | ✅ PASS |
| Not café panel / not venue sheet | No `cafe-detail-panel`, no `venue-detail-sheet` | ✅ PASS |
| Booking stub | `restaurant-booking-sheet` opens from detail CTA | ✅ PASS |
| Mobile detail sheet | `restaurant-detail-mobile-sheet` | ✅ PASS |
| Rich-card dedup | `results-column` count 0 | ✅ PASS |
| Vitest | `restaurant-card`, `domain-results` | ✅ 6/6 |
| Playwright | `e2e/screens/SCREEN-023-restaurant-listings.spec.ts` | ✅ 2/2 |
| Floor | `npm run floor` | see run below |

## Commands (2026-06-02)

```bash
cd mdeapp
SMOKE_BASE_URL=http://localhost:3000 PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/screens/SCREEN-023-restaurant-listings.spec.ts --project=chromium --workers=1
# 2 passed

npm test -- --run restaurant-card domain-results
# 6 passed
```

## Disk (key files)

- `src/components/copilot/restaurant-card.tsx` — `ResultCardShell`
- `src/components/restaurant/restaurant-detail-panel.tsx`
- `src/components/copilot/domain-results.tsx` — `openRestaurantDetail` (not café)
- `src/components/chat/chat-map-panel.tsx`
- `src/app/restaurants/page.tsx` — catalog browse (parallel surface)

## Deferred (Phase B / follow-ups)

- `search-grounded-places` `intent: "restaurant"` merge
- Filter chips in chat chrome (002-wire)
- Admin booking persist (VEN-016+)

## Grade rationale (A- / 92)

**Strengths:** Full Mindtrip loop shipped; Playwright mirrors SCREEN-021 pattern; no wrong panel routing.

**Gaps (-8):** Phase B grounded restaurants not done; chat filter chips not wired; `/restaurants` catalog has no detail panel (intentional split).

## Linear

SAN-490 — ready for human **In Review → Done** after prod spot-check on [mdeai.co/chat](https://www.mdeai.co/chat).
