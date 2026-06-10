---
type: wireframe
id: WIRE-008
number: "011"
title: Map Exploration Panel
persona: Tourist
path: right panel
priority: P1
build_status: Not Started
screens:
  - 011-scr-map-exploration-panel.md
screen_ids:
  - SCREEN-010
skill:
  - mde-wireframe
---
# Wireframe: Map Exploration Panel

**Persona:** Tourist · **Surface:** right panel Map tab + `/explore` (Phase 2)

## Map-first mode

```text
┌─ RIGHT (Map tab, expanded) ─────────────────────────────┐
│ [Search this area]  Layers: [Rentals][Events][Food][POI]│
│ ┌─────────────────────────────────────────────────────┐ │
│ │                    Google Map                        │ │
│ │     (1) (2)    cluster(12)     (3)                   │ │
│ │           Laureles polygon overlay ───               │ │
│ │     route preview: 12 min to Provenza ──             │ │
│ └─────────────────────────────────────────────────────┘ │
│ Selected: #2 El Poblado Rooftop Bar                     │
│ [Save] [Directions] [Ask concierge about this area]     │
└─────────────────────────────────────────────────────────┘
```

## Behaviors

| Behavior | Implementation |
|----------|------------------|
| Cluster | `@googlemaps/markerclusterer` |
| Search this area | `useFitBounds` + re-query |
| Heatmap (P2) | rental density layer |
| ADK POI | grounded pins + attribution |
| Realtime (P2) | Supabase Realtime on `events` status |

## Filter bar sync

Map layer toggle ↔ agent tool filters ↔ card category in chat
