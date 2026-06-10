---
task_id: data-018
mvp_step: 18
title: Event admin ops SQL — exception queue views
layer: DATA
priority: P1
status: Not Started
estimated_effort: 3h
depends_on: ["data-012"]
blocks_evidence_for:
  - ../../events/docs/events-prd.md
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
description: SQL views/RPC for Patricia admin exception queue — failed payments, pending approvals, stale drafts; no new tables if views suffice.
---

# DATA-018 — event admin ops views

## At a glance

| | |
|---|---|
| **For** | Patricia |
| **Surface** | `/admin/events` (app task separate) |
| **Layer** | DATA |

## What we're building

Events PRD P1: **admin exception queue**. Prefer **views + SECURITY DEFINER RPC** over new tables.

## Candidate views

| View / RPC | Source tables | Shows |
|---|---|---|
| `v_event_orders_exceptions` | `event_orders`, `events` | `status IN ('failed','expired','pending')` > N minutes |
| `v_event_publish_pending` | `events`, `approval_requests` | draft/unpublished awaiting approval |
| `v_event_checkin_gaps` | `event_orders`, `event_attendees` | paid orders missing attendees |
| `v_event_webhook_idempotency_failures` | `idempotency_keys` | ticket webhook errors (if logged) |

## Goals

1. Document SQL in `tasks/data/evidence/data-018-admin-ops-views.sql`
2. Optional migration creating views with `security_invoker = true` or admin-only RPC
3. RLS: admin role only (`user_roles` or `profiles.role`)
4. Link to future `/admin/events` UI task (events track, not data)

## Acceptance criteria

- [ ] Patricia persona query returns failed/pending rows from live DB
- [ ] No new mutable tables required (views only unless evidence proves need)
- [ ] Pin `search_path` on any SECURITY DEFINER RPC (coordinate data-010)

## Real-world example

Roberto's event shows 3 paid orders but webhook retry stuck — Patricia's queue surfaces the row without SQL console access.
