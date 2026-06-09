---
title: PR #18 forensic audit — SEARCH-003 + INT-001 restaurants
date: 2026-05-30
last-verified: 2026-05-31
pr: https://github.com/amo-tech-ai/mdeapp/pull/18
branch: feat/search-003-restaurants → main
auditor: cursor (forensic PR audit) + claude-sonnet-4-6 (fixes + re-verify 2026-05-31)
refs: SAN-386 (restaurant slice), SEARCH-003
status: MERGE-READY
---

# PR #18 — `feat(search): hybrid restaurant search (SEARCH-003, INT-001)`

## 1. Summary

| Item | Detail |
|------|--------|
| **What it does** | Hybrid restaurant search via `hybrid_search_restaurants` RPC + Gemini embeddings (`query-embedding.ts`), intent slots (`intent-slots.ts`), search observability (`search-logs.ts`), rank explanation UI, golden-queries smoke. |
| **Scope** | **Focused** — 15 files, restaurant vertical + shared embed/logging primitives used by #19/#20. |
| **Merge readiness** | **✅ MERGE-READY** — all issues resolved @ `ee31f3c` (2026-05-31) |

## 2. Scorecard

| Area | Score | Status | Notes |
|------|------:|:------:|-------|
| Scope control | 92% | 🟢 | Single vertical + shared libs; appropriate stack base |
| Code correctness | 98% | 🟢 | All issues fixed @ `ee31f3c`; enum + tool registration resolved |
| Test coverage | 98% | 🟢 | 340/340; +2 regression guards: `extract-intent-slots` tool presence + `restaurant_search`/`cafe_search` enum |
| Security/privacy | 95% | 🟢 | `search-logs` truncates/hashes IDs ✅; neighborhood sanitized ✅ |
| Runtime safety | 90% | 🟢 | Embed try/catch ✅; curated fallback on empty intel ✅ |
| Best practices | 85% | 🟡 | Brittle golden venue names; slot heuristic duplication |
| **Merge readiness** | **✅ 98%** | 🟢 | All issues resolved — merge-ready |

## 3. Errors found

| File | Issue | Severity | Status | Exact fix |
|------|-------|----------|--------|-----------|
| `src/mastra/agents/concierge.ts:17-20` | `lastIntent` enum missing `restaurant_search`, `cafe_search` | **Major** | ✅ **FIXED** `ee31f3c` | Added both values to `z.enum([..., 'restaurant_search', 'cafe_search'])` |
| `src/mastra/agents/concierge.ts` tools | `extractIntentSlotsTool` not imported/registered | **Major** | ✅ **FIXED** `ee31f3c` | Imported + added to `tools: { ... }` block |
| `src/mastra/tools/search-restaurants.ts` | `queryText` path returned empty intel without curated fallback | Major | ✅ **FIXED** `97a0c0d` | try/catch + `FALLBACK_RESTAURANTS` when `intelFiltered.length === 0` |
| `src/mastra/tools/search-restaurants.ts` | `writeSearchLog` before `applyRestaurantFilters` | Medium | ✅ **FIXED** `97a0c0d` | Moved log after filters; passes final count |
| `src/mastra/tools/search-restaurants.ts` | Raw `neighborhood` in PostgREST `.or()` | Medium | ✅ **FIXED** `97a0c0d` | Regex strip `[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s\-]` before filter |
| `src/mastra/lib/query-embedding.ts` | No try/catch on fetch/json | Medium | ✅ **FIXED** `97a0c0d` | Wrapped in try/catch; return `null` on any failure |
| `src/mastra/lib/search-logs.ts` | Raw `queryText` + unhashed `userId`/`sessionId` | Medium | ✅ **FIXED** `97a0c0d` | `truncateQuery()` 256-char cap; SHA-256 16-hex prefix on IDs |
| `src/lib/intent-slots.ts` | Missing `timeOfDay`/`groupSize`/`occasion` slots; hardcoded June label | Medium | ✅ **FIXED** `97a0c0d` | Added to schema + heuristic extractor; label uses template literal |
| `package.json:32` | `verify:mis-phase1` → `../scripts/...` (outside git root) | Low | ✅ **FIXED** `97a0c0d` | In-repo path; `--env-file` added to `smoke:golden-queries` |

**All 9 CodeRabbit comments applied in commits `97a0c0d` + `645acdb`. Both major agent wiring issues fixed in `ee31f3c`.**

## 4. Red flags

**Working memory amnesia — RESOLVED ✅ `ee31f3c`.** `lastIntent` enum now includes `restaurant_search` and `cafe_search`. `src/lib/types.ts` `ConciergeWorkingMemory` synced to match.

**Intent tool dead code — RESOLVED ✅ `ee31f3c`.** `extractIntentSlotsTool` imported and registered in concierge tools block. INT-001 pre-routing now callable. Regression guard added in `concierge.test.ts`.

## 5. Critical fixes (before merge)

1. ✅ Add `cafe_search` + `restaurant_search` to `lastIntent` enum (`concierge.ts:17`) — fixed `ee31f3c`
2. ✅ Register `extractIntentSlotsTool` on concierge agent tools block — fixed `ee31f3c`

## 6. Test proof

**Branch:** `feat/search-003-restaurants` @ HEAD `ee31f3c` (2026-05-31)

| Command | Result |
|---------|--------|
| `npm run lint` | ✅ 0 warnings |
| `npm run typecheck` | ✅ clean |
| `npm test` | ✅ **340/340** (81 files) |
| `npm run build` | ✅ clean |
| `npm run smoke:golden-queries` | ✅ PASS (verified locally with `.env.local`) |
| Targeted: `intelligence-restaurant-search`, `intent-slots`, `query-embedding`, `search-restaurants-logic`, `concierge` | ✅ all pass |

**New regression guards (@ `ee31f3c`):**
- `concierge.test.ts` — `extract-intent-slots` present in `listTools()` ✅
- `concierge.test.ts` — `restaurant_search` + `cafe_search` accepted by working memory schema ✅
- `types.ts` `ConciergeWorkingMemory.lastIntent` synced to include all 6 values ✅

**GitHub:** `mergeable: MERGEABLE / mergeStateStatus: CLEAN` ✅

## 7. Task corrections

| Task | Correct | Wrong | Fix | % | Status |
|------|---------|-------|-----|--:|:------:|
| **SEARCH-003** hybrid restaurant | RPC + embed + rank explanation UI + tests + fallback | — | — | 95% | 🟢 |
| **INT-001** intent slots | Schema, heuristic parser, tool file, unit tests, tool registered, enum fixed | — | — | 100% | 🟢 |
| **Observability** search_logs | Truncate + hash IDs + filter-aware count | — | — | 95% | 🟢 |

## 8. Best-practice recommendations

- Fix enum + tool registration in the same PR commit before merge.
- Golden smoke: assert `rankScore > threshold` + `hybridUsed`, not fixed venue names.
- Deduplicate slot parsing: call shared `intent-slots.ts` from `intelligence-restaurant-search.ts` instead of parallel regex.

## 9. Final verdict

### 🟢 MERGE-READY @ `ee31f3c`

All CodeRabbit issues resolved. All agent wiring issues fixed. Floor green at 340/340. Regression guards added. `types.ts` synced. No open issues.

## 10. Recommended merge order

**#18 second** — after #17 → `main`. Becomes base for #19 stack.
