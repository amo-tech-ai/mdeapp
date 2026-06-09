---
type: wireframe
screen_number: "036"
title: Attendee Inbox
route: /inbox
persona: [Andrés, Camila]
phase: MVP
agent: attendeeAgent
---

# Wireframe: Attendee Inbox

## Page goal

Attendee-facing messages — host updates, ticket notices, reminders.

**Diff from [024](./024-inbox.md):** 024 = **host** Q&A queue; 036 = **attendee** `/inbox`.

## Components

InboxThreadList · MessageBubble · TicketNoticeCard · ReminderChip · UnreadBadge

## Message types

| Type | Example |
|------|---------|
| Ticket confirmation | "Your QR is ready" |
| Event update | "Venue changed to …" |
| Host reply | Ask Host answer |
| Reminder | "Starts in 2 hours" |

## AI features

`attendeeAgent` summarize thread · smart reminders (MVP)

## Data sources

`messages`, `notifications`, `tickets`

## Mermaid

```mermaid
flowchart TD
  H[Host/system send] --> I[/inbox]
  I --> A[attendeeAgent optional summary]
  A --> U[User read + deep link]
```
