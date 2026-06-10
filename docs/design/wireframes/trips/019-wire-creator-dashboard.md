---
type: wireframe
id: WIRE-011
number: "011"
title: Creator Dashboard
persona: Creator
path: /creator
priority: P2
build_status: Frozen
screens:
  []
screen_ids:
  []
skill:
  - mde-wireframe
phase: Phase 2+
---
# Wireframe: Creator Dashboard

**Persona:** Local creator · **Path:** `/creator` · **Phase:** 3

## Layout (2-column admin-lite)

```text
┌──────────────────────────────────────────────────────────────┐
│ Creator studio · María L.                    [Preview guide] │
├──────────────┬───────────────────────────────────────────────┤
│ SIDEBAR      │ MAIN                                          │
│ My guides (3)│ ┌ Published: Best Laureles cafés for nomads ─┐│
│ Analytics    │ │ 1.2k saves · 340 map opens                 ││
│ Sponsors     │ │ [Edit] [View on map] [Promote — sponsor]   ││
│ Payouts      │ └────────────────────────────────────────────┘│
│              │ ┌ Draft: Provenza nightlife 2026 ────────────┐│
│              │ │ AI assist: add 3 more venues? [Generate]   ││
│              │ └────────────────────────────────────────────┘│
│              │ Map preview: guide pins                       │
└──────────────┴───────────────────────────────────────────────┘
```

## Agents

`creatorAgent` + `guideAgent` — CRUD guides, link `guide_places`, sponsor placements

## Tables (planned)

`guides`, `guide_places`, `collections`, sponsor.*

## Not in chat canvas

Separate surface — links back to chat for "Ask concierge about this guide"
