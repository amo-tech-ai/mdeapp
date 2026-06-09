---
task_id: data-019
mvp_step: 19
title: Rentals data inventory — live schema vs real-estate PRD
layer: DATA
priority: P0
status: Done
verified: 2026-05-29
evidence: ../evidence/data-019-rentals-inventory.md
estimated_effort: 3h
depends_on: ["data-001"]
unblocks: ["data-020", "data-021", "data-023"]
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
related:
  - ../audit-supabase.md
  - ../../real-estate/real-estate-prd.md
  - ../../real-estate/INDEX.md
description: Read-only map of rental tables/columns/RLS to PRD §15; confirm CORE search+lead needs no new tables.
---

# DATA-019 — rentals data inventory

## At a glance

| | |
|---|---|
| **For** | sanjiovani |
| **Surface** | Supabase audit |
| **Layer** | DATA |

## Live baseline (MCP 2026-05-26)

| Table | Rows | RLS policies | PRD use |
|---|---:|---:|---|
| `apartments` | 44 active | 3 | Camila search (`search-rentals.ts`) |
| `listing_embeddings` | 44 | 6 | Semantic / hybrid RPC |
| `neighborhoods` | 12 | 5 | Hood facts (text join today) |
| `leads` | 11 | 5 | Schedule viewing / CRM |
| `showings` | 0 | 5 | Viewing scheduler (unused) |
| `landlord_inbox` | 0 | 3 | Andrés notify |
| `rental_applications` | 0 | 5 | Post-MVP wizard |
| `bookings` / `payments` | 0 / 3 | 4 / 3 | RE-022 commerce gate |
| `rental_listing_images` | 0 | 3 | Optional normalize |
| `property_verifications` | — | 5 | Scam/freshness |

**PRD tables that do NOT exist (defer or replace):**

| PRD name | Live substitute |
|---|---|
| `places_cache` | `places_search_cache` + `place_details_cache` |
| `contacts` / `conversations` | `mastra_threads` + `leads` |
| `outreach_messages` | `wa_outbox` + `suppression_list` (Phase 2) |
| `scoring_logs` / `market_snapshots` | **data-025** (Hermes P2) |

## CORE verdict

**Rental search + lead capture need no new tables** for MVP — F17/F46/F47 + `chat-lead-capture` already wired. Gaps are **columns + indexes** (data-020, data-009 M3) and **showings workflow** (data-021).

## Goals

1. Full column + index dump for rental cluster tables.
2. Map each open real-estate screen task to reuse / extend / migrate.
3. RLS negative-test checklist for landlord vs renter vs anon.
4. Evidence → `tasks/data/evidence/data-019-rentals-inventory.md`.

## Acceptance criteria

- [x] PRD §15 table list marked exists / missing / renamed
- [x] Explicit CORE = zero new tables for MVP search+lead
- [x] Gap list drives data-020–025 — see evidence
- [x] No schema mutations in inventory task

## Real-world example

**Camila** schedule-viewing — `leads.apartment_id` and `trip_id` columns live (DATA-020/029); edge fn still writes `metadata.listing_id` only → update `chat-lead-capture`.
