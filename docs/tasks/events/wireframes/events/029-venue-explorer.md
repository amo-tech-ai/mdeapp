---
type: wireframe
screen_number: "029"
title: Venue Explorer
route: /venues
persona: [Roberto, Camila]
phase: Core
status: spec
specs: [VEN-004, VEN-005, SAN-498, SAN-499]
---

# Wireframe: Venue Explorer

## Page goal

First-class venue discovery — map search, capacity filters, AI scoring, compare — not only inside host wizard.

## User type

Host · Event planner · Camila (trip planning)

## User stories

```text
As Roberto I want to browse rooftops in Poblado for 250 guests
So that I shortlist venues before creating an event
```

## Components

VenueSearchBar · CapacityFilter · BudgetFilter · VenueMap · VenueCard · CompareTray · AiScoreBadge · CommandBarLink

## Three-panel

**Left:** saved venue lists · **Center:** search + results chat · **Right:** map + compared venues

## Desktop

```text
┌──────┬────────────────────────────┬──────────────┐
│ Nav  │ Rooftop 250 guests Poblado │ Map + pins   │
│      │ [venue-card 94%] [89%]     │ Compare (2)  │
│      │ Context: 📍 Venue          │              │
└──────┴────────────────────────────┴──────────────┘
```

## AI features

| Feature | Detail |
|---------|--------|
| Agent | `conciergeAgent` or future `venueSearchAgent` |
| Workflow | `venueShortlistWorkflow` |
| Tools | Places API field mask |
| State | `VenueExplorerState` |

## Data sources

`venues` (cached Places), `place_id`, optional `venue_bookings`

## States

Empty search · No results · Loading map · Places quota error

## Mobile

Map half-sheet; cards list below; compare sticky bar

## Mermaid

```mermaid
flowchart TD
  A[/venues] --> B[Filters + NL query]
  B --> C[Places search]
  C --> D[AI suitability score]
  D --> E{Compare?}
  E -->|Yes| F[Compare tray]
  E -->|Select| G[Wizard or booking request]
  F --> H[/venues/slug]
```

**Diff from [025](./025-venue-comparison.md):** 025 = wizard step only; 029 = public browse surface.
