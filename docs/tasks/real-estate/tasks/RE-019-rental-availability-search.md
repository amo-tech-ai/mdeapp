---
task_id: RE-019
title: Rental search availability + date filters
layer: DATA+APP
priority: P1
phase: mvp
status: Not Started
persona: Camila
depends_on: [RE-017]
unblocks: [RE-020]
skills: [mde-supabase, mastra, mde-task-lifecycle, testing]
commit_ledger: C-015
paths:
  - mdeapp/src/mastra/tools/search-rentals.ts
  - mdeapp/src/app/api/rentals/search/route.ts
  - mdeapp/src/lib/types.ts
  - mdeapp/src/mastra/agents/concierge.ts
description: Filter apartments by available_from/to; API + tool + memory fields.
---

# RE-019 — Rental availability + date filters (P1)

## Problem

DB has `available_from` / `available_to` on `apartments`; `searchRentals` only filters `neighborhood`, `minBedrooms`, `maxPricePerNight`. June stay intent is ignored in SQL.

## Implementation

1. Extend `RentalQuery` + API Zod body:
   - `checkIn?: string` (ISO date)
   - `checkOut?: string`
   - `stayType?: 'monthly' | 'nightly'`
2. SQL overlap filter on availability columns
3. Parser → `buildRentalSearchParams` emits dates when RE-017 extracts them
4. `lastRentalQuery` working memory schema (concierge + `src/lib/types.ts`)
5. Rank boost: `minimum_stay_days >= 28` when `stayType === 'monthly'`

## Acceptance criteria

- [ ] API accepts date params; invalid dates → 400
- [ ] Listings outside June window excluded when checkIn/checkOut set
- [ ] Unit/integration test with fixture rows
- [ ] Prod: monthly query returns cards whose availability text overlaps window (manual spot-check)

## Depends on

- RE-017 date extraction
- data-009 indexes (RE-003) recommended before heavy date filters

## Do not do

- pgvector / embeddings (RE-020)
