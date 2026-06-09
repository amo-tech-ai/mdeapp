---
id: PAGE-M05
route: /admin/bookings
status: Spec-only
linear: SAN-502
persona: patricia
related: VEN-007
updated: 2026-06-08
---

# PAGE-M05 — Admin event booking queue

## Purpose

Approve venue proposals (Mamacita etc.) for private events.

## Layout

Queue table: host, venue, date, status · row → detail · Approve/Reject HITL.

## Data

`event_venue_bookings` schema (EVT-033 / SAN-492) — not migrated

## Acceptance

- [ ] Shares patterns with VEN-007
- [ ] Patricia-only RLS
