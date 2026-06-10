---
task_id: TRIP-008
title: Trip map Google pins tab
layer: APP + MAPS
priority: P1
phase: mvp
status: Not Started
estimated_effort: 5h
persona: Camila
depends_on: [TRIP-005, MAP-008]
unblocks: []
skills: [mde-maps, copilotkit-develop, shadcn]
wireframes:
  - ../wireframes/012-wire-trip-workspace.md
path: /trips/[id]
description: Replace text pin list with Google Map + AdvancedMarker per MAP-008; cluster, lazy-load, and fit bounds safely.
---

# TRIP-008 — Trip map Google pins

## Current disk

✅ `TripMapPanel` — text list of coords in `itinerary-panel.tsx`  
❌ No `<Map mapId=...>` on trip tab

## Build scope

- **Create** `components/trips/trip-map-panel.tsx` (or refactor export)
- Parent `<Map>` with required `mapId`
- `<AdvancedMarker>` per `trip_items` with lat/lng
- Fit bounds to all pins
- Lazy-load map bundle when the Map tab opens, not on initial itinerary page load
- Cluster markers when pin count is high enough to overlap; keep single-item pins unclustered
- Pin source priority: `trip_items.latitude/longitude` snapshot first, source entity second, Places cache third, no live Places call from browser
- Mobile: map uses a collapsible/bottom-sheet pattern so Camila can still reach itinerary controls
- Field mask / Places: read-only details on marker click via cache/proxy only (optional MVP)

## Acceptance criteria

- [ ] Map tab renders without console errors
- [ ] Every scheduled item with coords shows marker
- [ ] `data-testid="trip-map-panel"` preserved
- [ ] Follow mde-maps: mapId on parent Map
- [ ] Bounds fit all finite pins and ignore invalid/null coordinates
- [ ] Marker clustering verified with fixture containing 10+ nearby pins
- [ ] No direct browser call to Places API New; any details use MAP-005 cache/proxy

## Do not do

- No route lines / Directions API (POST-MVP MAP-011)
- No ADK write path
