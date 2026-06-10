---
title: Ticketing Journeys
screens: [003, 004, 005]
---

# Ticketing Flows

## Checkout

```mermaid
flowchart TD
  D[Event detail] --> M[Checkout modal]
  M --> ST[Stripe hosted]
  ST --> W[/me/tickets]
```

## Wallet + QR

```mermaid
flowchart TD
  W[Wallet list] --> T[Ticket detail]
  T --> Q[Fullscreen QR]
  Q --> SCAN[Staff scan at door]
```

## Event entry

```mermaid
sequenceDiagram
  participant A as Andrés
  participant W as Wallet
  participant S as Staff scanner
  participant DB as Supabase

  A->>W: Open QR
  S->>DB: validate token
  DB-->>S: valid check-in
```

Wireframes: [003](../events/003-event-details.md) · [004](../events/004-checkout.md) · [005](../events/005-ticket-wallet.md)
