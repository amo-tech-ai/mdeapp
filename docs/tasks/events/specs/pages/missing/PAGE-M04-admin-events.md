---
id: PAGE-M04
route: /admin/events
status: Spec-only
linear: SAN-515
persona: patricia
updated: 2026-06-08
---

# PAGE-M04 — Admin event moderation

## Purpose

Patricia reviews flagged/pending events — approve, reject, request edits.

## Layout

Admin shell · filters (status, date) · `Table` with actions · detail drawer.

## Data

Service-role or admin RLS; `events` + moderation flags (schema TBD).

## States

Empty queue · bulk actions · audit log link

## Acceptance

- [ ] Admin role gate
- [ ] No service role in client
- [ ] Evidence screenshot for Done
