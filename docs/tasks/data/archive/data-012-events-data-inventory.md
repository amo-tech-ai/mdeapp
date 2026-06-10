---
task_id: data-012
mvp_step: 12
title: Events data inventory — live schema vs EVP roadmap
layer: DATA
priority: P0
status: Done
verified: 2026-05-29
evidence: ../evidence/data-012-events-inventory.md
estimated_effort: 3h
depends_on: ["data-001"]
unblocks: ["data-013", "data-016", "data-017"]
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
related:
  - ../audit-supabase.md
  - ../../events/docs/events-prd.md
  - ../../events/docs/events-roadmap.md
  - ../../events/tasks/INDEX.md
description: Read-only map of live event tables/columns/indexes/RLS to EVP tasks; confirm CORE commerce needs no new tables.
---

# DATA-012 — events data inventory

## At a glance

| | |
|---|---|
| **For** | sanjiovani |
| **Surface** | Supabase audit — no user UI |
| **Layer** | DATA |

## What we're building

Events-side counterpart to **data-001**: prove which EVP features reuse existing schema vs need **data-013+** migrations.

## Live baseline (MCP 2026-05-26)

| Table | Rows | EVP / PRD use |
|---|---:|---|
| `events` | 49 | CORE — detail, discovery, host publish |
| `event_venues` | 7 | EVP-016 venue binding |
| `event_tickets` | 4 | Andrés checkout |
| `event_orders` | 35 | Wallet, admin ops |
| `event_attendees` | 39 | QR wallet |
| `event_check_ins` | 3 | Staff scan audit |
| `event_embeddings` | 43 | Semantic search |
| `event_attendee_profiles` | 0 | Check-in fields today — **not** EVP-035 social |
| `event_sponsors` / `event_sponsor_placements` | 0 | EVP-029 advanced |
| `approval_requests` | 0 | HITL infra — host publish |

**Missing tables (need data tasks):** `event_qa`, `event_live_updates`, discovered-events pipeline (`event_sources`, `raw_events`, …).

**CORE commerce verdict:** ticketing stack **complete** — no schema for EVP-001/003/013/014/G3.

## Goals

1. Row counts + RLS policy count per event table (Supabase MCP).
2. Column gap matrix: EVP-033 (`ai_summary` exists; approval status?), EVP-034/046/035/020.
3. Index review: `events` publish queries, `event_orders` buyer/admin lists.
4. Evidence → `tasks/data/evidence/data-012-events-inventory.md`.

## Acceptance criteria

- [ ] Matrix links each **open** EVP task to **reuse / extend / new table**
- [ ] Explicit: CORE P0 needs **zero** new event tables
- [ ] Unblocks data-013, data-016, data-017 with gap list
- [ ] No schema mutations

## Real-world example

**Roberto** host publish — inventory confirms `events` + `event_tickets` + `approval_requests` exist; EVP-G3 proof is app/edge, not missing tables.
