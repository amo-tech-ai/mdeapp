---
screen: Event Detail
screenshots: [Events-details-1.png, E-1.png]
route: /events/[slug]
persona: Camila, Andrés
mdeai_status: partial
linear: SAN-135
spec: ../../../specs/pages/PAGE-003b-event-detail-luma.md
---

# Wireframe — Luma Event Detail

## Goals

Convert interest → registration in &lt;30s mobile scroll; establish trust via host + social proof.

## ASCII — mobile (target PAGE-003b)

```text
┌─────────────────────────────────────┐
│ [← Back]                    [Share] │
├─────────────────────────────────────┤
│▓▓▓▓▓▓▓▓ HERO IMAGE ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ [Networking] badge                  │
├─────────────────────────────────────┤
│ Visionarios Night: Medellín Vol. IV │
│ Thu May 28 · 6:30–9:00 PM COT       │
│ El Poblado · Rooftop venue          │
├─────────────────────────────────────┤
│ [av] Hosted by Parceros Community   │
├─────────────────────────────────────┤
│ [Ambitious] [Startup] [Solo-OK]     │
├─────────────────────────────────────┤
│ AI: Best for founders & nomads…     │
├─────────────────────────────────────┤
│ 👤👤👤 42 going · 12 founders…      │
├─────────────────────────────────────┤
│ About                               │
│ paragraph…                          │
├─────────────────────────────────────┤
│ Tickets                             │
│ GA $25  [Buy]                       │
│ VIP $80 [Buy]                       │
├─────────────────────────────────────┤
│ Ask Host  ▸                         │
├─────────────────────────────────────┤
│ Map · Nearby cafés                  │
├─────────────────────────────────────┤
│▓▓▓ STICKY [Register from $25] ▓▓▓▓▓│
└─────────────────────────────────────┘
```

## Component inventory

| Component | Type | Phase | mdeai file |
|-----------|------|-------|------------|
| EventDetailHero | page | P1 | planned |
| EventHostBlock | domain | P1 | planned |
| EventVibeTags | domain | P2 | — |
| EventAiSummary | domain | P2 | — |
| EventAttendeeStrip | domain | P2 | — |
| EventTicketTiers | domain | ✅ | existing |
| EventAskHost | domain | P2 | — |
| EventDetailMap | domain | P2 | — |
| StickyBuyBar | page | ✅ | existing |

## States

| State | testId | Behavior |
|-------|--------|----------|
| Loading | event-detail-skeleton | Hero + tier skeleton |
| Sold out | — | Disabled tier, waitlist later |
| No host data | — | Hide host block gracefully |
| No attendees | — | “Be the first to register” |

## Desktop

Two-column: left narrative stack · right **sticky ticket card** (enhance current layout).

## mdeai today

Commerce layout LIVE — missing host, vibe, attendees, map sections ([`luma-inspired-event-ux-review.md`](luma-inspired-event-ux-review.md)).

## Wireframe prompt

Attach `Events-details-1.png` + `E-1.png`. Output must match PAGE-003b section order.
