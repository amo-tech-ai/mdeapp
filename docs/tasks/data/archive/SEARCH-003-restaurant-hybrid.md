---
task_id: SEARCH-003
title: Hybrid search restaurants + venue_signals
layer: APP
phase: intel-1
priority: P0
status: Done
completed: 2026-06-03
evidence:
  - ../evidence/SEARCH-003-verify-2026-06-03.md
depends_on: [DATA-041, DATA-045, DATA-047, VEC-001]
unblocks: [DATA-046, INT-021]
blocks: []
skills: [mastra, mde-supabase, gemini, copilotkit-integrations, testing]
related:
  - ../../intelligence/intelligence-plan.md
  - ../../mastra/progress-mastra.md
  - ../../mastra/audit/MIS-MASTRA-AUDIT-2026-05-30.md
description: First MIS hybrid proof — search-restaurants with queryText calls hybrid_search_restaurants RPC, joins venue_signals + venue_source_evidence, writes search_logs.
---

# SEARCH-003 — Hybrid restaurant search

## At a glance

| | |
|---|---|
| **For** | Tourist · Camila (dinner discovery) |
| **Why now** | MIS-M1 gate — proves SQL/hybrid + signals before Phase 1b |
| **Rule** | Supabase source of truth; LLM explains only; no Places for curated restaurants |

## What we're building

1. `mdeapp/src/mastra/lib/intelligence-restaurant-search.ts` — slot parse, hybrid RPC, signal boost, evidence join
2. `mdeapp/src/mastra/lib/query-embedding.ts` — embed query via Gemini embedding API
3. `mdeapp/src/mastra/lib/search-logs.ts` — service_role insert
4. `search-restaurants.ts` — when `queryText` set → intelligent path + `writeSearchLog`
5. `concierge.ts` — route rooftop/quiet/neighborhood food → `search-restaurants` with `queryText`, not `search-grounded-places`
6. UI — `rank-explanation` + `venue-evidence` on `PlaceResultCard`

## RPC + tables

| Resource | Use |
|----------|-----|
| `hybrid_search_restaurants` | semantic + FTS fusion |
| `venue_signals` | rooftop_score, quiet_score, … |
| `venue_source_evidence` | card evidence text |
| `search_logs` | observability |

## Golden query

**Input:** `quiet rooftop Provenza`  
**Expected top 2:** Relato, Sambombi Bistró Local  
**Expected UI:** rank-explanation factors + 2 map pins  
**Expected log:** `hybrid_used=true`, `rank_explanation` JSON

## Done gate

| Check | Command / evidence |
|-------|-------------------|
| Unit tests | `npm run test -- search-restaurants intelligence-restaurant` |
| Golden smoke | `npm run smoke:golden-queries` exit 0 |
| MIS verify | `npm run verify:mis-phase1` 8/8 |
| Browser E2E | `:3001` → Relato/Sambombi cards |
| Committed | C-ledger row; not only working tree |
| Human QA signals | DATA-041 top 30 sign-off (parallel gate) |

## Real-world examples

| Prompt | Path |
|--------|------|
| Quiet rooftop Provenza | hybrid + rooftop_score |
| Romantic cocktails Provenza | hybrid + cocktail_score |
| Local Colombian not touristy | hybrid + hidden_gem / local_authenticity |

## Out of scope

- Places grounding as primary rank
- LLM-as-ranker
- Unified venues merge
- Semantic recall / user prefs

## Verify

```bash
cd mdeapp && npm run smoke:golden-queries && npm run verify:mis-phase1
```
