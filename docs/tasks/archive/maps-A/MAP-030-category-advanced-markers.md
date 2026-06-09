---
id: MAP-030
title: Category-aware Advanced Markers (café ☕, rental 🏠, event 🎟️)
status: Done
priority: P1
phase: Post–MAP-019 polish — UI only (no grounding/search changes)
effort: 6-8h
owner: claude
depends_on: [MAP-008, MAP-015, MAP-019, F50b]
blocks: [MAP-009]
skill: [mde-maps, shadcn, testing, playwright-cli]
prd_ref: ../../../plan/maps/maps-prd.md
also_known_as: MAP-024A
official:
  - https://developers.google.com/maps/documentation/javascript/advanced-markers/migration
  - https://developers.google.com/maps/architecture/dynamic-advanced-markers
  - https://visgl.github.io/react-google-maps/docs/api-reference/components/advanced-marker
  - https://github.com/googlemaps/js-adv-markers-utils
parent_note: Café pipeline (Grounding Lite + MAP-019 CTAs) is Done — do not touch sidecar, MAP-002D, or enrichment.
---

# MAP-030 — Category-aware Advanced Markers

> **Alias:** café sprint notes call this **MAP-024A**; **MAP-024** in `tasks/listings/cafes/` remains **AI café scoring** — use **MAP-030** as the canonical maps task id.

## At a glance

**Description:** Replace generic blue dot pins with **lightweight** category glyphs (☕🏠🎟️🍽️) on `<AdvancedMarker>` — **no photos or ratings on the map**. Rich Mindtrip-style content (photo, carousel dots, editorial, save/trip placeholders, CTAs) lives only in **`SelectedPlaceOverlayCard`** via `MapPinInfoWindow` on pin click.

**Mindtrip map UX:** Lightweight `CategoryMapMarker` on the map; all photos and editorial UI in `SelectedPlaceOverlayCard` via `InfoWindow` — per [store locator best practices](https://developers.google.com/maps/solutions/store-locator/best-practices) and mde-maps [`maps-js-api.md`](../../../.agents/skills/mde-maps/references/maps-js-api.md).

**Purpose:** After Camila’s café query passes (5 cards, 5 pins, MAP-019 CTAs), the map still looks like “five identical dots.” Category markers make rentals, events, restaurants, and grounded cafés instantly recognizable.

| Persona | Effect |
|---------|--------|
| **Camila** | Café pins read as ☕; rental pins as 🏠 — faster scan on `/` chat map |
| **Tourist** | Event 🎟️ vs restaurant 🍽️ vs café ☕ on concierge map |
| **Sofía** | Smoke asserts `data-pin-category` + icon content per category |

## Current-state audit (2026-05-26)

| Area | File | Today |
|------|------|--------|
| Map shell | `mdeapp/src/components/maps/ChatMap.tsx` | ✅ `<AdvancedMarker>` + `mapId`; inner content is colored circle with `•` |
| Pin colors | `ChatMap.tsx` `CATEGORY_COLORS` | Hex per category — no iconography |
| Pin schema | `mdeapp/src/platform/contracts/map-pin.ts` | `category`: rental \| restaurant \| event \| attraction \| venue \| grounded |
| Merge / filter | `map-context.tsx`, `map-pin-filters.ts`, `active-map-category.ts` | Category merge, dim inactive category, renderable lat/lng |
| Card ↔ pin | `MAP-015` / `search-tool-renders.tsx`, `MapFocusController` | `selectedPinId`, `panToPin`, scroll-into-view |
| Enriched meta | `normalize-tool-output.ts` | grounded: `rating`, `openNow`, `photoName` in `meta` |
| Tests | `map-pin-filters.test.ts`, `smoke:map-pins`, `smoke:f50-pin-sync`, `smoke:grounding-attribution` | Pin count + sync; no category glyph assertions |
| Clustering backlog | `MAP-009` | Depends on marker chrome — implement **after** MAP-030 |

**Out of scope (explicit):** Grounding Lite MCP, Places enrich mask v3, `search-grounded-places`, MAP-002D web citations, Cloud Run deploy.

## Goals (phased)

### Phase 1 — Ship now (this task)

| # | Deliverable |
|---|-------------|
| G1 | `CategoryMapMarker` (or per-category components) used from `ChatMap.tsx` |
| G2 | Glyph map: grounded/café ☕, rental 🏠, event 🎟️, restaurant 🍽️, attraction 📍, venue 📌 |
| G3 | **Selected:** scale + ring (keep `selectedPinId` behavior) |
| G4 | **Dimmed:** opacity when `isPinDimmed` (inactive category) |
| G5 | **Closed café:** muted styles when `meta.openNow === false` on grounded pins |
| G6 | `aria-label`, `data-testid="map-pin"`, `data-pin-category`, `data-pin-id` preserved |
| G7 | Card click / `focusMapPin` still highlights matching marker |
| G8 | Google attribution unchanged; single `APIProvider` / one `<Map mapId>` |

### Phase 2 — Follow-on (separate tasks)

| Feature | Task hint | Reference |
|---------|-----------|-----------|
| InfoWindow mini-card on marker click | MAP-030B | [InfoWindow](https://developers.google.com/maps/documentation/javascript/reference/info-window) |
| Intent colors (work / brunch / specialty) | MAP-024 scoring + meta | Café directory |
| Marker clustering | **MAP-009** | `@googlemaps/markerclusterer` |
| Neighborhood polygons | MAP-032 | [Polygon](https://developers.google.com/maps/documentation/javascript/reference/polygon), Data layer |
| “Search this area” on drag | F50b extension | Viewport bias already exists |
| Dynamic marker updates (polling) | Optional | [Dynamic Advanced Markers + Firebase](https://developers.google.com/maps/architecture/dynamic-advanced-markers) |

## Suggested marker design

```tsx
// grounded (café POI from search-grounded-places)
<div className="category-marker category-marker--grounded" data-selected={selected}>
  <span aria-hidden>☕</span>
  {rating != null && <strong>4.8</strong>}
  {openNow === false && <span className="marker-dot marker-dot--closed" />}
</div>
```

| State | Visual |
|-------|--------|
| Default | Category glyph + optional rating (grounded only) |
| Selected | `scale(1.15)` + primary ring (existing pattern) |
| Dimmed | `opacity: 0.35` (existing) |
| Closed (`openNow === false`) | Gray/muted pill, optional gray dot |
| Cluster | Deferred → MAP-009 |

## Implementation plan

| Step | Work | Verify |
|------|------|--------|
| 1 | Add `src/components/maps/markers/CategoryMapMarker.tsx` (+ small CSS module or Tailwind) | Vitest: render variants per category |
| 2 | Refactor `ChatMap.tsx` to render `<CategoryMapMarker pin={pin} selected dimmed />` inside `<AdvancedMarker>` | Manual: café query shows ☕ |
| 3 | Pass `rating` / `openNow` from `pin.meta` for `grounded` | Closed café visually muted |
| 4 | Extend `e2e/maps-grounding.spec.ts` or new `maps-category-markers.spec.ts` | ≥1 pin contains ☕ for café query |
| 5 | Update smokes: assert `data-pin-category="grounded"` count ≥1 after café query | `smoke:grounding-attribution` |
| 6 | Run regression suite | Commands below |
| 7 | Evidence + screenshots | `tasks/notes/MAP-030-category-markers-evidence.md` |

### Files to touch (expected)

| File | Change |
|------|--------|
| `mdeapp/src/components/maps/ChatMap.tsx` | Delegate marker body to `CategoryMapMarker` |
| `mdeapp/src/components/maps/markers/CategoryMapMarker.tsx` | **New** |
| `mdeapp/src/components/maps/markers/category-map-marker.test.tsx` | **New** |
| `mdeapp/e2e/maps-category-markers.spec.ts` | **New** (optional if smoke sufficient) |
| `mdeapp/scripts/smoke-grounding-attribution.mjs` | Optional: assert pin text/icon not bare `•` |

**Do not edit:** `services/adk-grounding/*`, `search-grounded-places.ts`, `MAP-002D`*, `GroundedPlaceCard` CTAs (unless adding `data-pin-id` passthrough — already present).

## Acceptance criteria

- [ ] Café smoke query shows **≥5** map pins with **☕** (or `data-marker-glyph="cafe"`) for `category=grounded`
- [ ] Rental smoke shows **🏠** (or rental glyph) for `category=rental`
- [ ] Selected pin scales + ring; clicking card calls `panToPin` and selects same pin id
- [ ] `npm run floor` exit 0
- [ ] `npm run smoke:map-pins` pass
- [ ] `npm run smoke:f50-pin-sync` pass
- [ ] `SMOKE_GROUNDING_QUERY="list cafes in medellin" npm run smoke:grounding-attribution` pass
- [ ] No new critical console errors on `/`
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` still required — markers hidden when mapId missing (existing guard)

## Test commands

```bash
cd /home/sk/mdeai/mdeapp
npm run floor
npm run smoke:map-pins
npm run smoke:f50-pin-sync
SMOKE_GROUNDING_QUERY="list cafes in medellin" npm run smoke:grounding-attribution
# optional
npm run test:e2e:grounding
```

## Risks

| Risk | Mitigation |
|------|------------|
| Marker DOM too large at city zoom | Cap size; MAP-009 clustering later |
| `meta.openNow` missing on some pins | Fallback: treat as unknown (full color) |
| Legacy `google.maps.Marker` | Already on AdvancedMarker — confirm no Marker imports |
| Accessibility | Keep `aria-label="${category}: ${title}"` |
| Performance (many markers) | Phase 1 ≤20 pins typical; profile before MAP-009 |

## Rollback

- Revert `CategoryMapMarker` + `ChatMap.tsx` hunk → restores colored dot `•` pins (MAP-008 behavior).
- No DB or sidecar rollback.

## Evidence

`tasks/notes/MAP-030-category-markers-evidence.md` — before/after screenshots, test output, files changed.

## Related backlog

| ID | Relationship |
|----|----------------|
| MAP-009 | Clustering — **after** MAP-030 |
| MAP-031 | Map results panel copy when grounded cards shown |
| MAP-024 (listings) | Café scoring — separate from this task |
| MAP-008 | Done — Map ID + AdvancedMarker baseline |
