---
legacy_id: EVT-047
linear: SAN-506
linear_url: https://linear.app/sanjiovani/issue/SAN-506/evt-047-venue-crm-for-patricia
task_id: veb-015-advanced
tier: advanced
title: Venue CRM for Patricia
layer: UI
priority: P2
status: Not Started
estimated_effort: 3 days
depends_on: [veb-011]
unblocks: []
skills: [mde-supabase, shadcn]
description: Partner CRM — venue notes, response time, booking history, verified flag — /admin/venues.
---

# VEB-015-advanced — Venue CRM (Patricia)

> **Linear:** [EVT-047 — Venue CRM for Patricia](https://linear.app/sanjiovani/issue/SAN-506/evt-047-venue-crm-for-patricia) · **Project:** [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues)

## Phase 2+ — ops scale for event partners.

## What we're building

`/admin/venues` CRM: track Mamacita-style partners, response SLAs, repeat organizers.

## CRM views

| View | Data |
|------|------|
| Partner list | `venues` where `accepts_event_bookings` |
| Venue detail | offerings, past requests, WA thread summary |
| Notes | Patricia-only `venue_notes` |
| Metrics | avg response time, confirm rate |

## Acceptance criteria

- [ ] CRUD offerings without SQL
- [ ] Toggle `is_verified` gates public card badge
- [ ] Export CSV of requests per venue (Patricia)
- [ ] RLS admin-only on notes

## Related

- [`venue-management-prd-v1.md`](../../drafts/venues/venue-management-prd-v1.md)
