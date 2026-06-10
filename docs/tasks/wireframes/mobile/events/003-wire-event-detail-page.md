---
type: wireframe
id: WIRE-019
number: "003"
title: Event Detail Page
persona: Andrés
path: /events/:slug
priority: P0
build_status: Done
feature_group: "003"
paired_scr: 003-scr-event-detail-page.md
related_wires:
  - 003-wire-event-discovery.md
  - 010-wire-booking-checkout.md
related_specs:
  - 003-events-README.md
screens:
  - 003-scr-event-detail-page.md
screen_ids:
  - SCREEN-014
skill:
  - mde-wireframe
---
# Wireframe: Event Detail Page

> **Events group 003:** [003-events-README.md](003-events-README.md) · Build spec: [003-scr-event-detail-page.md](003-scr-event-detail-page.md) (SCREEN-014) · Upstream cards: [003-wire-event-discovery.md](003-wire-event-discovery.md)

**Source:** legacy `EventDetail.tsx`, `EventTicketCheckout`  
**Persona:** Andrés, Tourist · **Path:** `/events/:slug`  
**Layout:** Full page (not chat sheet) — in-chat overlay variant is [006-wire-venue-detail.md](006-wire-venue-detail.md) (SCREEN-007)

## Desktop

```text
┌─────────────────────────────────────────────────────────────────┐
│ [← Back to chat]  mdeai                    [Share] [Save ♡]       │
├──────────────────────────────┬──────────────────────────────────┤
│ HERO image / gallery         │ Salsa en Provenza                │
│                              │ Fri Jun 14 · 9:00 PM – 1:00 AM   │
│                              │ Club XYZ · Provenza, Medellín    │
│                              │ ──────────────────────────────── │
│                              │ From $25,000 COP                 │
│                              │ ┌ General  $25  [− 1 +] ───────┐ │
│                              │ │ VIP      $45  [− 0 +]        │ │
│                              │ └──────────────────────────────┘ │
│                              │ [Buy tickets →]                  │
│                              │ ──────────────────────────────── │
│                              │ About · Lineup · Dress code      │
│                              │ Map pin preview                  │
│                              │ Host: Roberto · [More events]    │
└──────────────────────────────┴──────────────────────────────────┘
```

## Checkout entry

Primary CTA opens [009-wire-booking-checkout.md](010-wire-booking-checkout.md) modal — Stripe Checkout Session (SCREEN-009).

## BackToChatBar (legacy pattern)

Sticky top when user arrived from chat thread:

```text
┌─────────────────────────────────────────────────────────────┐
│ ← Back to chat · "Salsa this Friday" thread                 │
└─────────────────────────────────────────────────────────────┘
```

## States

| State | UI |
|-------|-----|
| On sale | Tier selectors + Buy |
| Low inventory | "12 left" urgency |
| Sold out | Waitlist email capture |
| Past event | Archive + "Similar events" |

## Data

`events`, `event_tickets`, `event_orders`, Stripe price IDs

## Mobile

Stacked hero + sticky bottom bar `[Buy tickets $25]`
