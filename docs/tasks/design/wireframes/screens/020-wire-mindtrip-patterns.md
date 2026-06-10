---
type: wireframe
id: WIRE-013
number: "013"
title: Mindtrip Observed Patterns
persona: —
path: reference
priority: —
build_status: Reference
screens:
  []
screen_ids:
  []
skill:
  - mde-wireframe
reference_only: true
---
# Wireframe: Mindtrip Observed Patterns

**Source:** Playwright session on mindtrip.ai (authenticated)  
**Screenshots:** `screenshots/chat/02–05`

---

## Visible workflow strip (copy for mdeai)

```text
┌─ Agent progress (collapsible, Skip) ─────────────────────────┐
│ ○ Handing off to our hotel agent…                          │
│ ○ Scanning Medellin for top-rated hotels under $100…       │
│ ○ Considering 21 hotels out of 3,429…                      │
│ ○ Verifying June availability and pricing…                   │
│ ○ Finalizing top 10 list and creating bookable quotes…     │
│   └─ 6 quotes created [mini list: Masaya $81, Dorado $69…] │
└────────────────────────────────────────────────────────────┘
```

mdeai: `WorkflowProgressStrip` fed by Mastra workflow step events.

---

## Thought disclosure

```text
[ Thought for 24s ▼ ]
  (expandable reasoning — optional dev mode)
```

---

## Hotel / rental card (inline)

```text
┌─ Masaya Medellin ──────────────────── ★4.8 (3.9k) ────────┐
│ ┌──────── carousel ────────┐  $81/night                    │
│ │ [photo] [< >]            │  Jun 17–19 · 2 nights         │
│ └──────────────────────────┘  AI blurb…                     │
│ [Price details]  [Choose room]                              │
│ [♡ Save]  [+ Add to trip]     "Saved by 5 people"           │
└─────────────────────────────────────────────────────────────┘
```

mdeai rental card: replace **Choose room** with **Schedule viewing**; add **Buy tickets** on event cards.

---

## Top filter bar (map open, desktop)

```text
[ Medellín ▼ ] [ Jun ▼ ] [ Who ▼ ] [ $ ▼ ]     [Create a trip] [Share]
```

mdeai: `ChatQueryBar` — neighborhood, dates, guests, budget.

---

## 3-panel with labeled map markers

```text
CENTER: cards list          RIGHT: Google Map
                            ┌─────────────────┐
                            │ [Masaya Medellin]│← labeled marker
                            │    [Hotel Dix]   │
                            │ [Dorado la 70]   │
                            └─────────────────┘
```

mdeai: numbered rank markers + `AdvancedMarker` + optional name on hover.

---

## OTA modal (anti-pattern — do NOT ship)

```text
┌─ Masaya Medellin — Booking options ─────────────── [×] ─┐
│ Expedia          Book at expedia.com      [View deal]   │
│ Hotels.com       Book at hotels.com       [View deal]   │
│ Direct           Book directly with hotel  [View deal]  │
└─────────────────────────────────────────────────────────┘
```

mdeai: [06-booking-checkout.md](06-booking-checkout.md) internal Stripe / lead capture.

---

## Inline trip CTA (post-search)

```text
┌─ Looks like you're headed to Medellin in June ──────────┐
│ Create a trip to keep plans in one place…               │
│ [ Create trip ]                                         │
└─────────────────────────────────────────────────────────┘
```

mdeai: bind to active `trip_id` on `mastra_threads`.

---

## Left icon nav (64px)

```text
[★] Chats | Trips | Explore | Saved | Updates | Inspiration | Create
[avatar MK]
```

mdeai: `ChatNavRail` wire to Supabase (Phase 2).
