---
task_id: RE-017
title: Rental parser intelligence (dates, city, confidence)
layer: APP
priority: P0
phase: core
status: Not Started
persona: Camila
depends_on: []
unblocks: [RE-018, RE-019]
skills: [mastra, gemini, mde-task-lifecycle, testing]
commit_ledger: C-013
evidence:
  - ../../testing/evidence/2026-05-28/03-rental-agent-audit.md
  - ../../testing/prompts/real-estate/03-rental-agent.md
paths:
  - mdeapp/src/lib/rental-query-parser.ts
  - mdeapp/src/lib/__tests__/rental-query-parser.test.ts
  - mdeapp/src/lib/types.ts
description: Fix regex router — extract monthly/date/city signals; stop false generic clarify.
---

# RE-017 — Rental parser intelligence (P0)

> ⚠️ **Collides with UX-003 (shares the parser + test file).** [UX-003](../../ux/UX-003-deploy-price-wording-parser-fix.md) edits the same `rental-query-parser.ts:78` budget guard and **creates** `src/lib/__tests__/rental-query-parser.test.ts`. UX-003 is the cheap single-regex subset; **it should land first**. RE-017 then **extends** that existing test file with date/city/confidence cases — do not re-create it from scratch. If RE-017 lands first instead, fold the UX-003 `$500 a night` / `$500 nightly` nightly-wording cases into RE-017's test table so the price-wording fix is not lost. Either way: one `rental-query-parser.test.ts`, sequenced — not two parallel creates.

## Problem

`list rentals in june 1 to 30 $1000 medellin` parses **budget** (`$1000` → monthly ~$33/night) but `confidence: 0.5` → `shouldInstantRentalClarify()` → canned message asking for budget/dates already given.

## Goal

Parser **extracts structure**; does not block search when user gave budget + (dates OR monthly OR city-wide Medellín).

## Implementation

1. **`scoreRentalQuery` additions**
   - `hasDateRange` — `june`, `\d{1,2}\s*(?:to|-)\s*\d{1,2}`, month names + year optional
   - `hasMonthlyStay` — `one month`, `2 months`, `monthly rental`, `long-term`
   - `cityWide` — `medellin` / `medellín` (no barrio filter)
2. **Confidence rules** (see [`agent-plan.md`](../intelligence/agent-plan.md) § Confidence routing)
   - `hasBudget && (hasDateRange || hasMonthlyStay || cityWide)` → **≥ 0.85** → fast-path or search_now
   - Partial signals → **0.50–0.84** → Gemini clarify (not instant canned)
   - `isGenericRentalQuery` → false when `budgetType === 'monthly'` or `hasDateRange`
   - Remove reliance on single `0.6` gate + `shouldInstantRentalClarify` for partial-signal queries
3. **`buildRentalSearchParams`**
   - City-wide: omit `neighborhood` when only Medellín named
   - Persist `budgetType`, optional `checkIn`/`checkOut` strings in `lastRentalQuery` (types only — filtering in RE-019)
4. **Tests** (new `rental-query-parser.test.ts`)

| Prompt | Expected |
|--------|----------|
| `list rentals in june 1 to 30 $1000 medellin` | NOT instant clarify; params with maxPrice ~33/mo |
| `rentals in june for one month around $1000` | same |
| `studio in laureles for july` | fast-path Laureles |
| `2 month furnished apartment in poblado` | search or vibe clarify (not generic budget/dates) |
| `cheap monthly rental medellin` | city-wide search |

## Acceptance criteria

- [ ] All parser unit tests pass
- [ ] `shouldInstantRentalClarify` false for hero query (empty memory)
- [ ] `canFastPathRentalSearch` true OR `buildRentalSearchParams` non-null for hero query
- [ ] `npm run typecheck` + `npm run test` green on touched files
- [ ] No change to pin/API behavior (RE-004 / PR #12 scope)

## Do not do

- Do not remove fast-path entirely
- Do not add Gemini calls in this task (RE-018)
- Do not add Supabase date filters (RE-019)

## Verify

```bash
cd mdeapp && npm run test -- src/lib/__tests__/rental-query-parser.test.ts
```
