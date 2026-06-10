---
id: CAFE-001
title: Cafe booking requests schema + RLS
status: Not Started
priority: P1
phase: MVP Phase 1 (SCREEN-021 Phase C)
effort: 2-3h
depends_on:
  - VEC-002
unblocks:
  - SCREEN-021-phase-c
skill:
  - mde-task-lifecycle
  - mde-supabase
  - testing
verified_against: audit/37-screen-coffee.md
wireframes:
  - 005-wire-cafe-listings-map-booking.md
screens:
  - 005-scr-cafe-listings-map-booking.md
mutation: migration
---

# CAFE-001 — Cafe booking requests schema + RLS

## Purpose

Minimal Supabase table so SCREEN-021 Phase C can persist honest **request booking** rows (not instant confirmation).

> **2026-05-27:** Superseded by **[CAF-008](./tasks/CAF-008-data-venue-booking-requests-schema.md)** — unified `venue_booking_requests` with `venue_kind` (`cafe` | `restaurant` | `nightlife`).

## Goals

1. Create `cafe_booking_requests` with RLS enabled + ≥1 policy.
2. Columns: `user_id`, `place_id`, `cafe_name`, `requested_at`, `party_size`, `intent`, `notes`, `contact`, `status` (`pending` | `confirmed` | `needs_user` | `cancelled`), `metadata` jsonb.
3. Server-only insert via Mastra tool or edge fn — no service-role in client `mdeapp/src/**` except F13 carve-out paths.
4. Migration + typegen + Vitest smoke for RLS (anon cannot read others' rows).

## Definition of Done

- [ ] Migration applied; Supabase MCP confirms RLS + policies.
- [ ] `npm run floor` exit 0 after typegen.
- [ ] Evidence in `tasks/notes/CAFE-001-evidence.md`.

## Out of scope

- Patricia ops UI, OpenClaw message drafts, WhatsApp send — Phase 2+.
