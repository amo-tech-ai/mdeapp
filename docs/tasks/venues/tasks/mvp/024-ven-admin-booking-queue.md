---
task_id: ven-024
mvp_step: 024
title: Admin booking queue (/admin/bookings)
layer: UI
priority: P1
status: Not Started
depends_on: [VEN-023]
skills: [shadcn, mde-supabase]
doc: ../docs/02-booking-whatsapp.md
replaces: [VEN-007]
description: Patricia queue — pending requests, draft preview, approve/reject.
---

# VEN-23 — Admin booking queue


## At a glance

| | |
|---|---|
| **For** | Patricia (admin) |
| **Surface** | `/admin/bookings` |
| **Layer** | UI |

## What we're building

Queue of pending venue booking requests with approve/edit/reject for WA drafts.

## Features

- Filter by venue_kind and status
- Preview whatsapp_draft
- Link to place detail

## Agents & tools

None

## Workflows

Patricia approval → CAF-016

## User journey

1. Patricia opens admin bookings.
2. Reviews Tourist's club request + draft message.
3. Approves → triggers outbox (CAF-016).

## Goals

1. `/admin/bookings` — RLS admin role only.
2. List `venue_booking_requests` filter pending/sent/needs_user.
3. Approve triggers CAF-016 outbox path.
4. Edit WA draft before send.

## Acceptance

- [ ] Non-admin 403
- [ ] Approve updates status + outbox enqueue
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-024](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-024-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | /admin/bookings list + update |
| **MCP** | Admin RLS policies |
| **Chrome DevTools** | Patricia role on /admin/bookings |
| **Playwright** | Admin fixture |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- UPDATE policies for venue_booking_requests

