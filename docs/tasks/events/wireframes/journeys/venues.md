---
title: Venue Journeys
screens: [029, 030, 025, 031, 009]
---

# Venue Journeys

## Browse → detail → book → event

```mermaid
flowchart TD
  A[/venues explorer] --> B[Map + AI scores]
  B --> C[/venues/slug]
  C --> D{Path}
  D -->|Request booking| E[venue_bookings pending]
  D -->|Use in event| F[009 wizard set_venue]
  E --> G[031 host bookings]
  G --> H[VEN-007 admin approve]
```

## Wizard-only compare (025)

Embedded in create flow — not a substitute for 029 public browse.

Wireframes: [029](../events/029-venue-explorer.md) · [030](../events/030-venue-details.md) · [031](../events/031-host-bookings.md)
