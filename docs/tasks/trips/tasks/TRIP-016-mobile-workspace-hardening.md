---
task_id: TRIP-016
title: Mobile workspace UX hardening
layer: APP + UX
priority: P1
phase: hardening
status: Not Started
estimated_effort: 5h
persona: Camila, Lucia
depends_on: [TRIP-004, TRIP-008, TRIP-009]
unblocks: [TRIP-012]
skills: [copilotkit-develop, mde-maps, testing]
description: Make the trip workspace usable on mobile with map collapse, reachable itinerary controls, and no Mindtrip-style desktop split.
---

# TRIP-016 — Mobile workspace UX hardening

## Goal

Camila should be able to review a trip from her phone without the map, chat, or itinerary controls fighting for the same screen.

## Build scope

- Mobile workspace mode switch: itinerary, map, saved/bookings.
- Map opens as a collapsible panel or bottom sheet with stable height.
- Sticky add/save controls remain reachable.
- Touch targets meet minimum size; no horizontal overflow.
- Conflict HITL card fits on mobile without covering itinerary actions.

## Acceptance criteria

- [ ] `/trips/[id]` passes mobile Playwright screenshot at 390px and 430px widths.
- [ ] Opening map does not hide the active itinerary action permanently.
- [ ] No text overlap or layout shift when cards have long names.
- [ ] Bottom sheet/collapse state is keyboard accessible.

## Tests

- Playwright mobile viewport for map open/closed and conflict banner states.
- Console sweep: no hydration/layout errors.

## Do not do

- Do not copy Mindtrip's desktop side-panel density onto mobile.
