---
id: SCREEN-023
linear: SAN-490
title: Restaurant Listings + Map
status: Done
completed_at: 2026-06-02
priority: P1
phase: MVP Phase 2
effort: 1-2d
evidence_file: ../../../../testing/evidence/2026-06-02/SCREEN-023-RESULTS.md
feature_group: "008"
depends_on:
  - SCREEN-001
  - SCREEN-004
  - MAP-001
  - F49
  - F50
blocks: []
skill:
  - mde-task-lifecycle
  - copilotkit-develop
  - mastra
  - mde-maps
  - tailwind-responsive-ui
  - shadcn
  - testing
  - webapp-testing
wireframes:
  - 008-wire-restaurant-listings-map.md
primary_wire: 008-wire-restaurant-listings-map.md
related_specs:
  - ../../archive/005-scr-cafe-listings-map-booking.md
  - 005-008-places-README.md
testing_standard: SCREEN-TESTING-STANDARD.md
playwright_spec: ../../../mdeapp/e2e/screens/SCREEN-023-restaurant-listings.spec.ts
path: /restaurants
browse_path: /restaurants
chat_path: /
---

# SCREEN-023 — Restaurant Listings + Map

> **Places group 008:** [005-008-places-README.md](005-008-places-README.md) · Wire: [008-wire-restaurant-listings-map.md](008-wire-restaurant-listings-map.md) · **Not cafés** — use [005-scr](../../archive/005-scr-cafe-listings-map-booking.md) for coffee/brunch.

## 1. Purpose

Polish **restaurant discovery** on `/`: ranked cards for dinner/lunch/cuisine queries, map pins, right-column `RestaurantDetailPanel`. Phase A uses existing **`search-restaurants`** (Supabase curated + fallback). Phase B adds Google-grounded rows via `search-grounded-places` `intent: "restaurant"`.

## 2. Current disk (2026-06-02)

| Item | Status |
|------|--------|
| `search-restaurants` tool + concierge routing | ✅ Shipped |
| `RestaurantCard` + `ResultCardShell` | ✅ Shipped |
| `RestaurantDetailPanel` (right column + mobile) | ✅ Shipped |
| Map pin sync for restaurants | ✅ Playwright SCREEN-023 |
| `/restaurants` catalog browse | ✅ Separate surface |
| Phase B grounded restaurant rows | ⚪ Not started |

## 3. Goals

**Phase A:**

- Replace `GenericResults` with `RestaurantResultCard` (mirror `CafeResultCard` density).
- Cuisine + neighborhood + price tier + rating + vibe chips from tool JSON.
- CTAs: Directions · Details · Reserve* (stub) · Source link when enriched.
- `RestaurantDetailPanel` — Overview · Reviews · Location; `getPlaceDetails` when `placeId` present.
- Rich-card dedup when restaurant cards visible.
- Filter chips align with [002-wire-chat-chrome](002-wire-chat-chrome.md): Colombian, Paisa, seafood, date night, etc.

**Phase B:**

- `search-grounded-places` `intent: "restaurant"` for Google-verified rows not in Supabase.
- Merge/dedupe by `placeId`; prefer Supabase row when both exist.

## 4. Personas

| Persona | Journey |
|---------|---------|
| **Tourist** | “Best paisa food Laureles” → cards + map → detail → Directions |
| **Camila** | Date-night international in Poblado → filter chips → compare cards |

## 5. Workflows — files to touch

| Area | Action |
|------|--------|
| UI | `RestaurantResultCard.tsx`; update `search-tool-renders.tsx` restaurant branch |
| UI | `RestaurantDetailPanel.tsx` (fork from `CafeDetailPanel`) |
| UI | `rental-ui-context.tsx` — `restaurantDetail`, column mode |
| Mastra | Keep `search-restaurants`; extend concierge copy — **never** use for pure café queries |
| Mastra | Phase B: nightlife/restaurant intent split in `search-grounded-places` |
| Tests | `SCREEN-023-restaurant-listings.spec.ts` |

## 6. Agent

| Agent | Tool |
|-------|------|
| `conciergeAgent` | `search-restaurants` (Phase A) |
| Same | `search-grounded-places` `intent: "restaurant"` (Phase B) |

## 7. Acceptance criteria (Phase A)

- [x] “paisa restaurant Laureles” returns ≥2 polished restaurant cards (fast path: `suggest restaurants medellin`).
- [x] Details opens `RestaurantDetailPanel` in right column.
- [x] Map pin highlights on card select when lat/lng present.
- [ ] Café query does **not** call `search-restaurants` (concierge guard — existing unit test).
- [x] `npm run floor` exit 0; Playwright SCREEN-023 pass (2/2).

## 8. Do not do

- Use `search-restaurants` for café/coffee discovery (use group 005)
- Use SCREEN-007 venue sheet for restaurants
- Invent menu items or prices not in tool payload
- Standalone `/restaurants` catalog — ✅ shipped 2026-06-02 (SAN-490)
