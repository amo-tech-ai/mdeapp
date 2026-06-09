---
task_id: ven-015
mvp_step: 015
title: venue_booking_requests migration + RLS
layer: DATA
priority: P0
status: In Review
estimated_effort: 4h
depends_on: [data-004, data-009]
unblocks: [VEN-016, VEN-021, VEN-025]
verified_at: 2026-06-02
evidence: ./evidence/VEN-015-verify-2026-06-02.md
skills: [mde-task-lifecycle, mde-supabase, testing]
mutation: migration
replaces: [CAFE-001, VEN-001]
description: Unified booking table — venue_kind cafe | restaurant | nightlife.
---

# VEN-14 — Booking requests schema


## At a glance

| | |
|---|---|
| **For** | Sarah, Carlos, Tourist + Patricia |
| **Surface** | Supabase + booking sheet |
| **Layer** | DATA |

## What we're building

One booking table for all venue kinds with honest status workflow — request, not instant confirm.

## Features

- `venue_booking_requests` + `venue_kind` enum
- RLS: users see own rows; Patricia admin policies
- Columns for WA draft + approval id

## Agents & tools

Enables MSV-002 `requestVenueBooking`

## Workflows

Feeds MSV-007 venue booking workflow

## User journey

1. User submits booking sheet on a café/restaurant/club.
2. Row inserted as `pending`.
3. Patricia later sees queue (CAF-017) after WA draft (CAF-016).

## Summary

| Field | Value |
|-------|-------|
| Layer | DATA |
| Personas | Sarah (café), Carlos (restaurant), Tourist (nightclub), Patricia |
| Design | [`../docs/02-booking-whatsapp.md`](../docs/02-booking-whatsapp.md) |

## Description

Single request table for **all three kinds** via `venue_kind` enum. Status workflow: `pending` → `sent` → `confirmed` | `needs_user` | `cancelled`. Never use `cafe_booking_requests` or Phase 1 inserts into `public.bookings`.

## Goals

1. Migration + RLS (`select_own`, `insert_own`, admin policies).
2. Columns include `google_place_id`, `venue_kind`, `whatsapp_draft`, `approval_request_id`.
3. RLS smoke documented.

## Acceptance criteria

- [ ] Migration applies; all three kinds insertable in SQL test
- [ ] RLS enabled on `venue_booking_requests` with role-scoped policies for SELECT, INSERT, UPDATE, and admin access
- [ ] User ownership uses `(select auth.uid())` and cannot rely on user-editable metadata
- [ ] Negative smoke proves User A cannot read or update User B booking rows
- [ ] Anon behavior is explicit: denied directly unless routed through a vetted edge path
- [x] CAFE-001 archived under `tasks/venues/archive/`

## Real-world examples

- **Sarah** — café seating request, `venue_kind=cafe`
- **Tourist** — bottle service request, `venue_kind=nightlife`
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-015](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-015-verify-YYYY-MM-DD.md` |
| Grade | **B+ / 85** |
| Production ready | Staging — INSERT-only path |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | — |
| **MCP** | Supabase `execute_sql` — table, RLS, policies ([evidence](VEN-015-verify-2026-06-02.md)) |
| **Chrome DevTools** | — |
| **Playwright** | — |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- User UPDATE policy
- Patricia admin policies (VEN-024)
- Cross-user tests (VEN-025)

