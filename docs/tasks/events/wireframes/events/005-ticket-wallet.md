---
type: wireframe
screen_number: "005"
title: Ticket Wallet
route: /me/tickets, /me/tickets/[id]
persona: [Andrés]
phase: Core
status: live
legacy: ../015-wire-my-tickets-qr.md
agent_mvp: attendeeAgent
---

# Wireframe: Ticket Wallet

## Page goal

Show upcoming/past tickets + QR for door entry; MVP adds attendee AI help.

## User type

Attendee

## User stories

```text
As Andrés I want my QR on my phone
So that staff can scan me in
```

## Components

TicketList · TicketCard · QRDisplay · UpcomingPastTabs · AttendeeChatFab (MVP)

## Mobile

```text
┌─────────────────────────┐
│ My tickets              │
│ [Upcoming][Past]        │
│ ┌─────────────────────┐ │
│ │ Visionarios Night   │ │
│ │ Sat 7pm · GA        │ │
│ │ [View QR]           │ │
│ └─────────────────────┘ │
│ [💬 Ask about ticket]   │
└─────────────────────────┘
```

## AI features (MVP)

`attendeeAgent` — gate time, nearby café, similar events

## Data sources

`tickets`, `orders`, `events`

## States

Empty → discover CTA · Auth gate → login

## Mermaid

```mermaid
flowchart TD
  A[/me/tickets] --> B[List upcoming]
  B --> C[Open ticket id]
  C --> D[Show QR fullscreen]
```
