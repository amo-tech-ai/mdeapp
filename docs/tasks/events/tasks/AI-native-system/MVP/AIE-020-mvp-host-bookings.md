---
id: AIE-020-mvp
title: Host bookings /host/bookings
status: Not Started
priority: P1
phase: mvp
persona: roberto
linear: SAN-500
percent: 0
blocked_by: [AIE-012]
blocks: []
depends_on: []
wireframe: ../../wireframes/events/031-host-bookings.md
---

# AIE-020-mvp — Host bookings

## Objective

Manage venue bookings, reservations, inquiries from one host surface.

## Schema

`venue_bookings` — status pending/approved/declined, links to `venues` + `events`

## Acceptance criteria

- List + detail + status actions
- VEN-007 admin approve path documented
- Booking request from 030 creates row here
