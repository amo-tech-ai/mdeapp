---
type: wireframe
screen_number: "023"
title: Notifications
route: /me/notifications
persona: [All]
phase: MVP
---

# Wireframe: Notifications

## Page goal

Ticket confirmations, event reminders, host alerts.

## Components

NotificationList · ReadUnread · DeepLinkToTicketOrEvent

## Data sources

`notifications` table or edge-triggered rows

## Mermaid

```mermaid
flowchart TD
  N[Notification] --> L[Deep link surface]
```
