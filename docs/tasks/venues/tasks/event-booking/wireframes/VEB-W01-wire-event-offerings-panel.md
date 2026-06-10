---
legacy_id: EVT-051
linear: SAN-510
linear_url: https://linear.app/sanjiovani/issue/SAN-510/evt-051-wire-event-offerings-panel-event-venue-cta
type: wireframe
id: VEB-W01
title: Event offerings panel + restaurant Event Venue CTA
persona: Roberto, Tourist, Carlos
path: /chat (right column + result card)
priority: P0
build_status: Not Started
paired_tasks: [VEB-003, VEB-004]
skill: [mde-wireframe]
---

# Wireframe W01 — Event offerings panel

> **Linear:** [EVT-051 — Event offerings panel + restaurant Event Venue CTA](https://linear.app/sanjiovani/issue/SAN-510/evt-051-wire-event-offerings-panel-event-venue-cta) · **Project:** [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues)

> **Pack:** [`../INDEX.md`](../INDEX.md) · **Plan:** [`venues-booking.md`](../../../docs/venues-booking.md) §3–4

## Restaurant result card (extends VEN-009)

```text
┌─ Restaurant card ─────────────────────────────────────┐
│ [photo]  Mamacita Medallo                             │
│          Provenza · $$$ · Colombian                   │
│          🎉 Hosts Events                              │
│          "Great for birthdays & private dinners"      │
│                                                       │
│          [ Details ]    [ Event Venue ]               │
└───────────────────────────────────────────────────────┘
```

**Rules:** Hide **Event Venue** + badge when `accepts_event_bookings=false`.

## Event offerings panel (right column)

```text
┌─ Event venue — Mamacita Medallo ─────────────── [×] ─┐
│ 🎉 Hosts Events · Verified partner                   │
│ ┌──────── hero / carousel ────────────────────────┐  │
│ │  [img] [img] [map mini-preview with pin]        │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
│ EVENT TYPES                                           │
│ Birthdays · Private dinners · AI meetups              │
│                                                       │
│ CAPACITY                                              │
│ 60 seated · 120 standing                              │
│                                                       │
│ SPACES                                                │
│ [Rooftop] [Private room] [Main floor]                 │
│                                                       │
│ PACKAGES                                              │
│ ┌ Birthday dinner ─────────────────── from $25/p ─┐  │
│ │ Min 10 guests · Includes welcome drink           │  │
│ └──────────────────────────────────────────────────┘  │
│ ┌ AI meetup package ─────────────── from $15/p ────┐  │
│ └──────────────────────────────────────────────────┘  │
│                                                       │
│ AMENITIES                                             │
│ DJ · Projector · Sound · WiFi · Valet                 │
│                                                       │
│ BEST FOR / NOT IDEAL                                  │
│ ✓ Networking · Birthdays                              │
│ ✗ Large concerts · 500+ conferences                   │
│                                                       │
│ NEARBY (Places — cached)                              │
│ Parking · Hotels · Nightlife                          │
│                                                       │
│ ┌─────────────────────────────────────────────────┐  │
│ │        [ Request event proposal ]               │  │
│ └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
     Map column: venue pin highlighted + nearby context pins
```

## Component inventory

| Component | Props / notes |
|-----------|---------------|
| `EventVenueBadge` | `verified`, `acceptsEventBookings` |
| `EventVenueCTA` | Opens panel |
| `EventOfferingsPanel` | Sections from Supabase |
| `PackageCard` | `name`, `priceFrom`, `minGuests` |
| `MapContextRow` | Places-backed links |

## Mobile

- Panel becomes full-height sheet over map
- Card CTAs stack vertically: `[ Details ]` then `[ Event Venue ]`

## testids

`event-venue-cta` · `event-offerings-panel` · `request-proposal-btn` · `venue-package-card`
