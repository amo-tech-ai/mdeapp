---
task_id: RE-010
title: Saved + trips integration
layer: APP
priority: P1
phase: mvp
status: Not Started
persona: Camila
depends_on: [RE-004]
unblocks: [RE-015]
skills: [copilotkit-develop, mde-supabase]
related:
  - ../../trips/tasks/TRIP-006-saved-collections-page.md
  - ../../trips/tasks/TRIP-007-add-to-trip-from-cards.md
description: Enable Save CTA; saved_places + add-to-trip from rental cards.
---

# RE-010 — Saved + trips integration

## Scope

- Enable `RentalCard` Save (currently disabled)
- Implement save server action → `saved_places` (`location_type=apartment`)
- Add-to-trip modal (TRIP-007) from card
- CopilotKit action mirror optional

## Depends on

- **TRIP-006** `/saved` page shell
- **TRIP-007** add-to-trip tool

## Acceptance criteria

- [ ] Save creates `saved_places` row
- [ ] Item appears on `/saved`
- [ ] Add to trip creates `trip_items` (rental type)
- [ ] RLS: own saves only
