---
legacy_id: EVT-045
linear: SAN-504
linear_url: https://linear.app/sanjiovani/issue/SAN-504/evt-045-venue-availability-calendar
task_id: veb-013-advanced
tier: advanced
title: Venue availability calendar
layer: data
priority: P2
status: Not Started
estimated_effort: 3 days
depends_on: [veb-011]
unblocks: [veb-016]
skills: [mde-supabase, shadcn, mastra]
description: venue_availability table + calendar UI — suggest better dates, block double-booking holds.
---

# VEB-013-advanced — Venue availability calendar

## At a glance

| | |
|---|---|
| **Linear** | [EVT-045 — Venue availability calendar](https://linear.app/sanjiovani/issue/SAN-504/evt-045-venue-availability-calendar) · [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) |
| **For** | Carlos (venue partner), Roberto, Patricia |
| **Surface** | Admin venue edit + proposal modal date picker |
| **Phase** | Phase 2+ |

## What we're building

`venue_availability` blocks (blackout dates, holds) so AI can say "Saturday is full — try Friday?" without inventing.

## Schema (sketch)

```text
venue_availability
  venue_id
  date
  slot_start / slot_end
  status: open | hold | blocked
  hold_request_id (FK optional)
```

## AI feature

| Feature | Behavior |
|---------|----------|
| Availability assistant | Suggest next open date from calendar |
| Conflict check | Warn before INSERT if date blocked |

## Acceptance criteria

- [ ] Patricia can block dates per venue
- [ ] Proposal modal shows unavailable dates disabled
- [ ] No auto-confirm — holds still need venue WhatsApp confirm
- [ ] RLS: venue admin vs public read rules documented

## Related

- [`venues-booking.md`](../../docs/venues-booking.md) Phase 4
- Draft EXCLUDE gist: `tasks/venues/drafts/venues/venue-workflows.md`
