---
type: wireframe
screen_number: "006"
title: Saved Events
route: /saved
persona: [Camila]
phase: MVP
status: spec
---

# Wireframe: Saved Events

## Page goal

Collection of bookmarked events for trip planning and return visits.

## User type

Attendee

## User stories

```text
As Camila I want to save events from chat cards
So that I compare options later
```

## Components

SavedEventGrid · EventCard compact · EmptyState · AddToTrip CTA

## Layout

Left nav highlights Saved · Center grid · Right optional map of saved pins

## Data sources

`saved_items` or user saves table (RLS)

## States

Empty · Loading · Error

## AI features

`useCopilotReadable` saved IDs for "compare my saved events"

## Mermaid

```mermaid
flowchart TD
  A[Save on card] --> B[Persist save]
  B --> C[/saved grid]
  C --> D[Open detail or ask AI compare]
```
