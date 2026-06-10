---
type: wireframe
screen_number: "025"
title: Venue Comparison
route: /host/event/new (venue step)
persona: [Roberto]
phase: MVP
---

# Wireframe: Venue Comparison

## Page goal

Compare top Places venues by capacity, neighborhood, budget.

## Components

VenueCompareTable · MapPins · ScoreColumn · SelectVenueCTA

## AI features

`venueShortlistWorkflow` · Google Maps Places field mask

## Mermaid

```mermaid
flowchart TD
  A[Venue query] --> B[Places search]
  B --> C[Score top 5]
  C --> D[Compare table]
  D --> E[set_venue]
```
