---
task_id: RE-003
title: Rental search indexes (price_daily)
layer: DATA
priority: P0
phase: core
status: Not Started
persona: Sofía
depends_on: [RE-001]
unblocks: [RE-004]
skills: [mde-supabase]
related:
  - ../../data/tasks-data/data-009-schema-migrations-m1-m3.md
description: Apply data-009 M3 — idx_apartments_price_daily_* for search-rentals.ts.
---

# RE-003 — Rental search indexes

## Why

`search-rentals.ts` filters/orders on `price_daily`; live index uses `price_monthly` composite only.

## Migration

See **data-009 M3** — apply via Supabase MCP migration, not hand-edited prod.

## Acceptance criteria

- [ ] `idx_apartments_price_daily_active` exists
- [ ] `idx_apartments_rental_search_daily` exists
- [ ] EXPLAIN on typical Camila query uses index
- [ ] Evidence in RE-001 appendix
