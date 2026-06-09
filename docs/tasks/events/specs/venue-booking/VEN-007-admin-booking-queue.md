---
id: VEN-007
linear: SAN-502, SAN-514
status: Spec-only
persona: patricia
related: PAGE-M05
updated: 2026-06-08
---

# VEN-007 — Admin event booking queue

## Purpose

Patricia approves/rejects venue proposals; notifies host.

## Layout

`/admin/bookings` table: status chips · row actions · detail drawer with timeline

## Columns

Host, venue, event date, guests, status, submitted_at

## Acceptance

- [ ] Admin auth
- [ ] Status: pending → approved → confirmed
- [ ] Wire SAN-514 ASCII matches implementation
