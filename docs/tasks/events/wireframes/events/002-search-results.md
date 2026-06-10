---
type: wireframe
screen_number: "002"
title: Search Results
route: /events
persona: [Andrés]
phase: Core
status: live
---

# Wireframe: Search Results

## Page goal

Browse events without chat — date/category/neighborhood filters for SEO and direct traffic.

## User type

Attendee

## User stories

```text
As Andrés I want to filter events this weekend in Laureles
So that I can browse without using AI chat
```

## Components

FilterBar · DateGroupHeader · EventBrowseCard · EmptyState

## Layout

Single column list (no 3-panel). Optional "Ask AI" FAB → `/chat`.

## Desktop

```text
┌─────────────────────────────────────────┐
│ Events in Medellín          [Ask AI]    │
│ [This week ▼] [Category ▼] [Area ▼]     │
├─────────────────────────────────────────┤
│ SAT · ┌────┬─────────────────────────┐ │
│       │img │ Salsa Social · $15       │ │
│       └────┴─────────────────────────┘ │
└─────────────────────────────────────────┘
```

## AI features

Optional: deep link to chat with query pre-filled via `useCopilotChat` initial message.

## Data sources

`events` public API, RLS published only

## States

Empty → adjust filters · Loading → skeleton rows

## Mobile

Sticky filter chip row; cards full width.

## Mermaid

```mermaid
flowchart TD
  A[/events] --> B[Apply filters]
  B --> C[EventBrowseView]
  C --> D[Click card]
  D --> E[/events/slug]
```
