---
id: MAP-016
title: fitBounds after multi-pin tool merge
status: Done
priority: P2
phase: MVP-hardening
effort: 2h
owner: claude
depends_on: [MAP-001, MAP-008, F49]
blocks: [MAP-009]
skill: [mde-maps, testing]
audit_ref: ../audit/27-maps-audit.md §6 P2 · MAP-008 §4 deferred
verified_against:
  - https://visgl.github.io/react-google-maps/
  - /home/sk/mdeai/github/maps/react-google-maps/website/src/examples/
---

# MAP-016 — fitBounds on search results

## At a glance

**Problem:** `MapFocusController` pans to **one** pin at zoom 15. After a multi-result rental/event/grounding search, **Camila** may not see all pins without manual pan/zoom.

**Goal:** When a tool merge adds **≥2** finite-coordinate pins in the active category, fit map bounds with padding (vis.gl `useMap()` + `LatLngBounds`).

**Note:** MAP-008 §4 listed `fitBounds` but shipped without it. MAP-009 adds cluster-aware bounds — this task is the **pre-cluster** baseline.

## Build scope

### Frontend
- **`MapFitBoundsController.tsx`** (new) — child of `<Map>`; listens to `MapContext.pins` or a `fitBoundsRequest` ref/counter set after merge.
- Trigger: after `ToolPinsSync` merge when incoming batch has ≥2 valid coords; **do not** fit on every `selectedPinId` change (single-pin `panToPin` stays in `MapFocusController`).
- Sensible padding (e.g. 48px); max zoom cap so single-neighborhood searches don't over-zoom.
- Skip when only `mock` source pins visible.

### Do not
- Replace `MapFocusController` single-pin behavior.
- Implement clustering (MAP-009).

## Acceptance criteria

1. Laureles rental query with ≥3 cards → all pins visible without manual pan (desktop).
2. Single-pin focus (`panToPin`, card click) still uses zoom-15 pan, not fitBounds fight.
3. Vitest: bounds helper given N coords returns expected NE/SW (pure function).
4. `npm run smoke:map-pins` pass.
5. `npm run floor` exit 0.

## Verification

- Evidence: `tasks/notes/MAP-016-evidence.md` — screenshot before/after search showing all pins in viewport.

## Definition of Done

§4 acceptance + evidence. MAP-009 may extend same controller for cluster bounds.
