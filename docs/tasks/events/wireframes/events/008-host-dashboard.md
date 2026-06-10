---
type: wireframe
screen_number: "008"
title: Host Dashboard
route: /host/events
persona: [Roberto]
phase: Core
status: live
legacy: ../EVP-014-wire-host-events-list.md
---

# Wireframe: Host Dashboard

## Page goal

List hosted events with status, reg counts, quick actions to analytics and share.

## User type

Host

## User stories

```text
As Roberto I want to see all my live and draft events
So that I manage them from one grid
```

## Components

HostNavRail · CreateEventCTA · HostEventCard · StatusBadge · QuickActions

## Three-panel (target with hostOps)

**Left:** host nav · **Center:** event grid or chat · **Right:** selected event KPI preview

## Desktop

```text
┌──────────┬────────────────────────────────────┐
│ Host nav │ My events            [+ Create]    │
│ · Events │ ┌────────────────────────────────┐│
│ · Analytics│ Fashion Night · 42 reg · Live  ││
│ · New    │ │ [Manage][Insights][Share]      ││
│          │ └────────────────────────────────┘│
└──────────┴────────────────────────────────────┘
```

## AI features

MVP: `hostOpsAgent` sidebar on same layout (Multi-Page pattern)

## Data sources

`events` where `organizer_id` = auth user

## States

Empty → CTA wizard · Loading skeleton

## Mermaid

```mermaid
flowchart TD
  A[/host/events] --> B[Grid load RLS]
  B --> C{Action}
  C -->|Create| D[/host/event/new]
  C -->|Insights| E[/host/analytics]
  C -->|View| F[/events/slug]
```
