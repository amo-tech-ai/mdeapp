---
type: wireframe
id: WIRE-001
number: "001"
title: Home / Concierge Chat
persona: Camila, Tourist
path: /
priority: P0
build_status: Done
screens:
  - 001-scr-home-chat-chrome.md
screen_ids:
  - SCREEN-001
skill:
  - mde-wireframe
---
# Wireframe: Home / Concierge Chat

**Persona:** Camila · **Path:** `/` · **Viewport:** desktop primary

## Desktop ASCII

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ [≡] mdeai          Trip: "June Medellín" ▼    Laureles ▼  When ▼  Budget ▼  [+ Trip] │
├────────────┬─────────────────────────────────────────────────────┬───────────────────┤
│ LEFT 260px │ CENTER (CopilotChat canvas)                         │ RIGHT 400px       │
│            │                                                     │ [Map|Itinerary|…] │
│ [+ Chat]   │ ┌─ Workflow strip ───────────────────────────────┐  │                   │
│            │ │ Handoff → Rental agent · Ranking · 8 results    │  │   Google Map      │
│ Chats      │ └────────────────────────────────────────────────┘  │   ┌───┬───┐       │
│ · Today    │ USER: 1BR Laureles under $80/night for June         │   │ 1 │ 2 │ pins  │
│ · Laureles │                                                     │   └───┴───┘       │
│            │ ASSIST: Here are 8 walkable Laureles picks…         │   cluster @ zoom  │
│ Trips      │ ┌ RentalCard #1 ─────────────────── [♡][View] ─┐  │                   │
│ · June MDE │ │ photo │ Studio · Laureles · $72/n │ Schedule ▶ │  │   [Layers ▼]      │
│            │ └────────────────────────────────────────────────┘  │   Rentals Events  │
│ Saved (3)  │ ┌ RentalCard #2 …                                   │                   │
│            │ [Show cheaper] [2BR only] [Schedule #1]               │   InfoWindow ──▶  │
│ Bookings   │ ─────────────────────────────────────────────────── │   #1 title $72    │
│ · pending  │ [ Ask anything…                          ] [Send]   │                   │
│            │                                                     │                   │
│ [avatar]   │                                                     │                   │
└────────────┴─────────────────────────────────────────────────────┴───────────────────┘
```

## Mobile ASCII

```text
┌─────────────────────────┐
│ mdeai    [Trip ▼] [≡]   │
├─────────────────────────┤
│ CopilotChat + cards     │
│ (full width)            │
│ …                       │
├─────────────────────────┤
│ [ Ask…            Send] │
├─────────────────────────┤
│ [ Open map (8 pins) ]   │  ← MapMobileSheet trigger
└─────────────────────────┘
```

## Components

| Component | Type | CK / Mastra |
|-----------|------|-------------|
| ChatNavRail | composite | Supabase threads (Phase 2) |
| ChatQueryBar | composite | filter → agent context |
| CopilotChat | CK | runtime `/api/copilotkit` |
| WorkflowProgressStrip | page-specific | Mastra step events |
| RentalCard | domain | `useCopilotAction` render |
| ChatMap | composite | `MapContext` |

## States

| State | Center | Map |
|-------|--------|-----|
| Default | Initial greeting | Medellín default viewport |
| Searching | Workflow strip + skeleton cards | — |
| Results | Cards + follow-up chips | Pins numbered 1–N |
| Error | Retry + clarify question | Last good pins or empty |

## Interactions

- Card click → `panToPin` + scroll sync
- Follow-up chip → same thread, working memory refine
- Schedule viewing → HITL sheet (see 06)
