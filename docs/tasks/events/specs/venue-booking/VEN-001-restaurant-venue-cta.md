---
id: VEN-001
linear: SAN-494
status: Spec-only
persona: tourist
updated: 2026-06-08
---

# VEN-001 — Restaurant card “Event Venue” CTA

## Purpose

On restaurant/nightlife cards, offer **Book this space for your event** when venue has `event_offerings`.

## Persona example

Tourist views Mamacita card → **Event venue** → offerings panel (VEN-002).

## Component touchpoints

`restaurant-card.tsx` / grounded card variant · CTA row new button

## Layout

Secondary CTA beside Reserve/Details: `Event venue` outline button

## testId

`event-venue-cta`

## Acceptance

- [ ] Only if venue flagged event-capable
- [ ] Opens VEN-002 panel
- [ ] 44px touch target
