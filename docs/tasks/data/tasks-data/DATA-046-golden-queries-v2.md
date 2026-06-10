---
task_id: DATA-046
title: Golden queries v2 (signal-backed)
layer: DATA
phase: intel-1b
priority: P0
status: Not Started
estimated_effort: 4h
depends_on: [DATA-041, DATA-045, SEARCH-003]
unblocks: [VEC-005]
blocks: []
skills: [mde-supabase, testing, mde-task-lifecycle]
related:
  - data-006-golden-queries.md
  - SEARCH-003-restaurant-hybrid.md
description: Expand golden query table with signal-backed expected results for restaurants, rentals, events — CI smoke + human sign-off.
---

# DATA-046 — Golden queries v2

## At a glance

| | |
|---|---|
| **For** | Lucía · Sofia |
| **Why now** | Phase 1b regression gate after hybrid tools ship |
| **Rule** | SQL expected rows + app smoke must agree |

## Query table (MVP)

| ID | Prompt | Tool | Expected top entities | Signals |
|----|--------|------|----------------------|---------|
| GQ-S01 | quiet rooftop Provenza | search-restaurants | Relato, Sambombi | rooftop ≥0.7 |
| GQ-S02 | romantic cocktails Provenza | search-restaurants | signal-ranked | cocktail_score |
| GQ-S03 | local Colombian not touristy | search-restaurants | hidden_gem boost | |
| GQ-R01 | digital nomad Laureles quiet | search-rentals | hybrid | digital_nomad |
| GQ-E01 | salsa this weekend Provenza | search-events | hybrid | nightlife |
| GQ-C01 | café strong wifi Laureles | search-grounded-places | Places pins | ADK fallback |
| GQ-N01 | compare Poblado vs Laureles | neighborhood_profiles | prose + profiles | |

## Deliverables

1. `mdeapp/scripts/intelligence/golden-queries-smoke.ts` — extend beyond GQ-S01
2. `tasks/data/evidence/DATA-046-golden-v2.md` — pass/fail matrix
3. Optional Playwright spec `e2e/intelligence/golden-queries.spec.ts`

## Done gate

| Check | Evidence |
|-------|----------|
| ≥10 queries documented | this file + evidence |
| CI script | exit 0 on main |
| SQL + app agree | no Relato-in-SQL / Places-in-UI mismatch |

## Out of scope

- Gorse / external ranker eval
- Multilingual queries (Phase 2)

## Verify

```bash
cd mdeapp && npx tsx scripts/intelligence/golden-queries-smoke.ts  # expanded
```
