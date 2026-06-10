---
id: MAP-034
title: Advanced marker UX polish — selection, badges, mobile sheet, a11y
status: Not Started
priority: P2
phase: Post-MVP — map UX refinement
effort: 6-8h
owner: claude
depends_on: [MAP-008, MAP-009, MAP-030]
blocks: []
skill: [mde-maps, copilotkit-develop, shadcn, testing]
prd_ref: ./docs/maps-prd.md §5
related:
  - ./docs/maps-audit-plan.md §9
  - ../archive/maps-A/MAP-030-category-advanced-markers.md
description: Post-MVP marker UX bundle from audit — z-index ring, price badges, collision, mobile bottom sheet, accessibility labels.
---

# MAP-034 — Advanced marker UX polish

## At a glance

**Description:** Harden marker UX after MAP-008/009/030 — selected state, rental price badges, mobile sheet, accessibility.

**Purpose:** Camila compares rentals on the map; pins must be scannable on mobile without losing category colors or attribution.

**Not MVP-blocking** — ship after MAP-005 spine (005 → 006 → 012).

## Scope checklist

| Item | Today | Target |
|------|-------|--------|
| Custom HTML/CSS marker content | ✅ `CategoryMapMarker` | Keep category tokens |
| Selected marker z-index + ring | ⚠️ partial | Universal selected ring on active pin |
| Accessible marker labels | ⚠️ partial | `aria-label` on every pin type |
| Marker clustering | ✅ MAP-009 | — |
| Marker collision behavior | ❌ | Configure collision / priority for selected pin |
| Numbered rental/event pins | ❌ | Optional rank badge when list sorted |
| Price badges for rentals | ❌ | `$XX/night` on rental AdvancedMarker |
| Category colors | ✅ | rental/event/restaurant/attraction/grounded |
| Mobile bottom sheet on click | ⚠️ overlay card | ECL-style sheet or shadcn drawer — **single map loader rule** |
| Fallback when mapId missing | ✅ MAP-008 | Add runtime capability probe test |
| map capabilities test | ⚠️ | Vitest + Playwright prod env gate |

## Files likely touched

- `mdeapp/src/components/maps/markers/CategoryMapMarker.tsx`
- `mdeapp/src/components/maps/SelectedPlaceOverlayCard.tsx`
- `mdeapp/src/components/maps/ChatMap.tsx`
- `mdeapp/e2e/maps-layout-mobile.spec.ts`

## Acceptance criteria

- [ ] Selected pin visible above cluster at all zoom levels
- [ ] Rental pin shows price when `price_daily` in pin meta
- [ ] Mobile: marker tap opens bottom sheet (keyboard + screen reader reachable)
- [ ] Playwright mobile spec covers tap → sheet → attribution
- [ ] No second Google map loader introduced
- [ ] `npm run floor` green

## Out of scope

- New map library
- Browser Places SDK
- Itinerary/trip map mode (TRIP-*)
