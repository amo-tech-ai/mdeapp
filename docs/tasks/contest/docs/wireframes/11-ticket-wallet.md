---
title: Ticket Wallet Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-11
path: /me/tickets
persona: Andres / Miguel
task: CTEST-003
phase: MVP
repo_refs:
  - Hi.Events
code_refs:
  - /home/sk/mdeai/mdeapp/src/app/me/tickets/page.tsx
  - /home/sk/mdeai/mdeapp/src/components/tickets/my-tickets-list.tsx
  - /home/sk/mdeai/mdeapp/src/components/tickets/ticket-qr-display.tsx
  - /home/sk/mdeai/mdeapp/src/lib/tickets/wallet-format.ts
---

# Ticket Wallet

## Purpose

Ticket holders see contest tickets, QR codes, and event entry status.

## Wireframe

```text
+------------------------------------------------------------------+
| My tickets                                                        |
+----------------------------+-------------------------------------+
| Ticket list                | Selected ticket                     |
| Finals VIP                 | QR code                             |
| Casting general            | Venue, time, status                 |
| Used / refunded badges     | Transfer/share receipt              |
+----------------------------+-------------------------------------+
```

## Components And Code To Use

- Reuse the existing ticket wallet and QR display code.
- Use Hi.Events only for attendee/order modeling ideas.
- Use shadcn `Card`, `Badge`, `Button`, `Skeleton`.

## States

No tickets, loading, valid QR, checked-in, refunded, transferred, expired, auth denied.

## Responsive

Mobile uses a list then detail page. Desktop uses split list/detail layout.

## Tests / Proof

Existing wallet route smoke, QR rendering, wallet API test, checked-in status display, responsive screenshot.

## Confidence

High. Existing route already exists and should be extended.
