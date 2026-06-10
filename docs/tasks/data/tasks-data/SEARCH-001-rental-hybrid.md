---
task_id: SEARCH-001
title: Hybrid search rentals + rental_signals
layer: APP
phase: intel-1b
priority: P0
status: Not Started
estimated_effort: 4h
depends_on: [DATA-043, DATA-047, SEARCH-003]
unblocks: [DATA-046]
pr_train: separate
stable_beta: do not mix with soak
linear_issue: SAN-386
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
blocks: []
skills: [mastra, mde-supabase, testing]
related:
  - ../../intelligence/intelligence-plan.md
  - ../../vector/VEC-001-pgvector-inventory-and-duplicate-index-plan.md
description: RPC hybrid_search_listings live on prod; app wiring only — mirror SEARCH-003 / restaurant path.
---

# SEARCH-001 — Hybrid rental search

## At a glance

| | |
|---|---|
| **For** | Camila (nomad / monthly stays) |
| **Why now** | Phase 1b — nomad rental queries need signal boost, not keyword-only |
| **Prerequisite** | MIS-M1 closed; VEC-004 worker live; INT-002 parser bands |

## What we're building

1. `intelligence-rental-search.ts` (new) — slots: nomad, quiet, nightlife, monthly, neighborhood
2. Extend `search-rentals.ts` — `queryText` → hybrid path when present
3. Join `rental_signals` (digital_nomad_score, quiet_score, wifi_score, …)
4. `writeSearchLog` with `hybrid_used`, rank_explanation
5. Fast-path API `/api/rentals/search` — optional hybrid when queryText passed

## Golden queries

| Prompt | Expected signal |
|--------|-----------------|
| Quiet digital nomad rental Laureles | digital_nomad + quiet boost |
| Monthly stay Poblado under $1500 | monthly + neighborhood |
| Near nightlife but not too noisy | nightlife_score balanced with quiet |

## Done gate

| Check | Evidence |
|-------|----------|
| RPC called | logs show hybrid_used |
| Signals joined | rank_explanation cites rental_signals |
| Fast-path preserved | `1BR Laureles $80/night` still API 200 without agent |
| Tests | vitest hybrid + parser regression |

## Out of scope

- LLM ranking
- Cross-domain itinerary workflow
- save-to-trip

## Verify

```bash
cd mdeapp && npm run test -- search-rentals && npm run smoke:golden-queries  # after DATA-046 row added
```
