---
id: MAP-015
title: PlaceResultCard ↔ map pin sync (grounded / restaurant / attraction)
status: Done
priority: P2
phase: MVP-hardening
effort: 1h
owner: claude
depends_on: [F49, F50, MAP-002]
blocks: []
skill: [mde-maps, copilotkit-develop, testing]
audit_ref: ../audit/27-maps-audit.md §6 P2
companion_tasks: [F49, F50]
---

# MAP-015 — PlaceResultCard ↔ pin sync

## At a glance

**Problem:** `RentalResults` / `EventResults` call `panToPin` on card click; **`GenericResults`** and **`groundedRender`** use `PlaceResultCard` with **no** map focus — Tourist sees pins but card clicks don't sync.

**Goal:** All generative tool cards that emit pins support the same F50 pattern: click card → `panToPin` + `selectedPinId` highlight on map + results column.

| Surface | Today | After |
|---------|-------|-------|
| `search-grounded-places` | pins only | card click → pan + select |
| `search-restaurants` | pins only | card click → pan + select |
| `search-attractions` | pins only | card click → pan + select |

## Build scope

### Frontend
- **`place-result-card.tsx`** — optional `pinId`, `selected`, `onSelect` / `onOpenDetails` props (mirror rental/event minimal API).
- **`search-tool-renders.tsx`** — wire `GenericResults` + `groundedRender` like `RentalResults`: `useMapContext().panToPin`, `selectedPinId`, `scrollIntoView` on list ref.
- Pin id convention: use normalizer id `${category}-${rawId}` consistently in card `data-pin-id`.

### CopilotKit
- No new tools; extend existing disabled renders only.

### Do not
- Rebuild `search-restaurants` / grounding Mastra tools.
- Add Places API calls (MAP-004).

## Acceptance criteria

1. Grounding query ("quiet cafés near Laureles") → click `grounded-card` → matching `map-pin` selected + map pans (F50).
2. Restaurant/attraction tool render (when agent invokes) → card click → `panToPin`.
3. `data-testid="results-pin-row"` stays in sync when card clicked.
4. Extend `e2e/maps-grounding.spec.ts` or add lightweight Playwright assertion for grounded card → pin select.
5. `npm run floor` exit 0.

## Verification

- Evidence: `tasks/notes/MAP-015-evidence.md`
- Smokes: `npm run smoke:grounding-attribution` + `smoke:f50-pin-sync` (rentals unchanged)

## Definition of Done

§4 acceptance + evidence file.
