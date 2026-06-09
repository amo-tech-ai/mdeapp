---
type: wireframe
id: WIRE-020
number: "020"
title: My Tickets + QR
persona: Andrés
path: /me/tickets
priority: P1
build_status: Done
screens:
  - 015-scr-my-tickets-qr.md
screen_ids:
  - SCREEN-015
skill:
  - mde-wireframe
---
# Wireframe: My Tickets + QR

**Source:** legacy `MyTickets.tsx`, `TicketDetail.tsx`  
**Persona:** Andrés · **Path:** `/me/tickets`, `/me/tickets/:id`

## Ticket list

```text
┌─────────────────────────────────────────────────────────────────┐
│ My tickets                              [Back to chat]          │
├─────────────────────────────────────────────────────────────────┤
│ UPCOMING                                                        │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Salsa en Provenza · Fri Jun 14 9:00 PM                      │ │
│ │ General Admission × 1 · Order #EO-1042 · Paid ✓             │ │
│ │ [Show QR →]                                                 │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ PAST                                                            │
│ ┌ … used Jun 1 · Comuna 13 tour … ────────────────────────────┐ │
└─────────────────────────────────────────────────────────────────┘
```

## QR detail (`/me/tickets/:id`)

```text
┌─────────────────────────────────────────────────────────────────┐
│ ← My tickets                                                    │
│                                                                 │
│              ┌─────────────────────┐                            │
│              │                     │                            │
│              │    [ QR CODE ]      │                            │
│              │                     │                            │
│              └─────────────────────┘                            │
│              Salsa en Provenza                                  │
│              Andrés · General · 1 ticket                        │
│              Valid Fri Jun 14 · scan at door                      │
│                                                                 │
│              Order #EO-1042 · Paid $27.50                       │
│              [Add to Apple Wallet — P2]                         │
│              [Directions] [Contact host]                        │
└─────────────────────────────────────────────────────────────────┘
```

## Auth model

- Logged in: list from `event_orders` by user
- Anonymous purchase: access token in URL / localStorage (legacy pattern) — prefer magic link post-checkout

## Post-checkout landing

Stripe return URL → `/me/tickets?order=EO-1042` + confirmation card in chat thread

## Edge fn

Staff validates QR via `ticket-validate` — Patricia/admin observability

## Mobile

QR full-screen brightness boost; offline QR cache P2
