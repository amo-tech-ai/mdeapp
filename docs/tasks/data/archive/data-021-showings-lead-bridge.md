---
task_id: data-021
mvp_step: 21
title: showings lifecycle — lead → showing row bridge
layer: DATA
priority: P1
status: Done
estimated_effort: 4h
depends_on: ["data-020", "data-010b"]
unblocks: ["data-028"]
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
blocks_evidence_for:
  - ../../real-estate/real-estate-prd.md
description: Extend schedule-viewing edge path to insert showings + populate leads.apartment_id; match live status CHECK (scheduled not proposed).
verified: edge v17 + MCP SQL 2026-05-30 — 2 showings rows created; idempotent retry pass
evidence: ../evidence/data-021-showings-bridge.md
---

# DATA-021 — showings lead bridge

## Gap

`showings` table **exists** (RLS ✅, indexes ✅, **0 rows**). Schedule-viewing modal (**SCREEN-008 Done**) only inserts **`leads`** via `chat-lead-capture` — never creates `showings`. Edge writes `metadata.listing_id` but **not** `leads.apartment_id` / `preferred_showing_at` (DATA-020 cols).

PRD flow: Camila proposes slot → **`showings` row** (`scheduled`) → landlord confirms (`confirmed`) → DATA-028 may sync `trip_items` when `trip_id` present.

## Schema today (live)

```text
showings: id, lead_id, apartment_id, scheduled_at, status, host_notes, renter_notes, metadata, created_at, updated_at, trip_id
```

**Status CHECK (live — do not rename without migration):**

```text
scheduled | confirmed | cancelled | completed | no_show
```

**Already applied (no DDL needed for Done):**

- RLS: 5 policies + `service_role` ALL
- Indexes: `idx_showings_lead_id`, `idx_showings_apartment_id`, `idx_showings_scheduled_at`, `idx_showings_lead_scheduled`, `idx_showings_trip_id`
- `trip_id` FK → `trips` (DATA-029)

## Goals

1. Document status enum contract matching live CHECK: **`scheduled`** (initial insert), then `confirmed | cancelled | completed | no_show`.
2. **Extend `chat-lead-capture`** (preferred) or add thin sibling edge fn — service client, same anon rate limit:
   - On schedule-viewing payload with `preferred_at` + listing/apartment id:
   - Insert **`leads`** with `apartment_id`, `preferred_showing_at`, intent `rental` (not only metadata)
   - Insert **`showings`** with `status = 'scheduled'`, `lead_id`, `apartment_id`, `scheduled_at = preferred_at`, optional `trip_id`
3. Use edge + service_role (not anon RPC from browser). If adding RPC, `SECURITY DEFINER` + `SET search_path = ''` per DATA-010 / mde-supabase.
4. Pass through `trip_id` when client sends it (enables DATA-028 showings → `trip_items` path).

## Acceptance criteria

- [x] One schedule-viewing submit creates **both** `leads` + `showings` rows (edge v17)
- [x] `leads.apartment_id` populated (not only `metadata.listing_id`)
- [x] Initial showing `status = 'scheduled'` (matches CHECK)
- [x] `trip_id` passthrough when client sends it
- [x] Idempotent retry via `idempotency_key`
- [x] Evidence SQL in [`tasks/data/evidence/data-021-showings-bridge.md`](../evidence/data-021-showings-bridge.md)
- [ ] Landlord RLS smoke via authenticated test user — **app/QA follow-up**

## Out of scope

- New indexes / RLS policies (already live)
- Status CHECK migration (`proposed` rename)
- CopilotKit HITL UI (real-estate app task)
- WhatsApp reminders
- `trip_items` upsert (DATA-028)

## Real-world example

**Camila** picks Saturday 2pm on `/rentals` — edge creates `leads` row with `apartment_id` + `showings` row `status=scheduled`; Patricia's landlord query on `apartment_id` returns one upcoming row.
