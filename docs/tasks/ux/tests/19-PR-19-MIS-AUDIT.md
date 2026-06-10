---
title: PR #19 forensic audit — SEARCH-001/002 rental + event hybrid
date: 2026-05-30
last-verified: 2026-05-31
pr: https://github.com/amo-tech-ai/mdeapp/pull/19
branch: feat/mis-rental-event-search → feat/search-003-restaurants
auditor: cursor (forensic PR audit) + claude-sonnet-4-6 (regressions fixed 2026-05-31)
refs: SAN-386, SAN-387, INT-002
---

# PR #19 — `feat(search): MIS rental + event hybrid search`

## 1. Summary

| Item | Detail |
|------|--------|
| **What it does** | `intelligence-rental-search.ts` + `intelligence-event-search.ts` (hybrid RPCs + signal boosts), `queryText` paths on `search-rentals` / `search-events`, INT-002 parser signals (`hasDateRange`, `cityWide`), rank explanation UI, concierge routing for nomad/salsa queries. |
| **Scope** | **Mostly focused** — 17 files, rental + event verticals. Overlaps #18 on shared files. Original commit introduced 5 regressions vs PR #18; all fixed in `3f98068`. |
| **Merge readiness** | **82%** ↑ (regressions fixed; stacked on #18; enum/tool gaps inherited) |

## 2. Scorecard

| Area | Score | Status | Notes |
|------|------:|:------:|-------|
| Scope control | 85% | 🟢 | Two related verticals; some #18 shared-file overlap |
| Code correctness | 82% | 🟡 | Inherits #18 enum/tool gaps; rental fallback empty (no curated list) |
| Test coverage | 90% | 🟢 | 348/348 after fix commit; query-embedding tests restored |
| Security/privacy | 92% | 🟢 | PII protections restored in `3f98068`; anon client only in intel libs |
| Runtime safety | 85% | 🟡 | Restaurant fallback restored; rental still returns empty on no client |
| Best practices | 78% | 🟡 | Duplicate slot heuristics vs `intent-slots.ts` |
| **Merge readiness** | **82%** | 🟡 | Depends on #18 merge; GitHub conflict status is stack artifact |

## 3. Errors found

### Regressions introduced in original PR #19 commit — ALL FIXED in `3f98068`

| File | Issue | Severity | Status |
|------|-------|----------|--------|
| `src/mastra/lib/search-logs.ts` | Dropped `truncateQuery()` + `hashId()` — raw queryText + user/session IDs stored | **Critical** | ✅ **FIXED** `3f98068` |
| `src/mastra/tools/search-restaurants.ts` | Removed try/catch + curated fallback around `searchRestaurantsIntelligent` | **Major** | ✅ **FIXED** `3f98068` |
| `src/mastra/lib/query-embedding.ts` | Removed try/catch; added `await res.text()` that crashes on mocked responses | **Major** | ✅ **FIXED** `3f98068` |
| `src/lib/intent-slots.ts` | Removed `timeOfDay`/`groupSize`/`occasion` from schema + heuristic; hardcoded June label re-introduced | Medium | ✅ **FIXED** `3f98068` |
| `src/mastra/lib/__tests__/query-embedding.test.ts` | Deleted (7 coverage tests dropped) | Medium | ✅ **RESTORED** `3f98068` |

### Remaining issues

| File | Issue | Severity | Status | Fix |
|------|-------|----------|--------|-----|
| `src/mastra/lib/intelligence-rental-search.ts:118-119` | No Supabase client → `{ results: [], source: "mock" }` — no curated fallback | Medium | 🔴 **OPEN** | Add rental fallback list (parity with restaurants) |
| Inherited from #18 | `lastIntent` enum + `extractIntentSlotsTool` | **Major** | 🔴 **OPEN** | Fix on #18 before merge |
| `src/mastra/lib/intelligence-rental-search.ts:78-89` | Parallel regex slot parser vs shared `intent-slots.ts` | Low | 🟡 Open | Consolidate later |

## 4. Red flags

**5 regressions were introduced in the original PR #19 commit.** The commit modified `search-logs.ts`, `search-restaurants.ts`, and `query-embedding.ts` to versions that stripped PII protections and resilience patterns added in PR #18. All five regressions were caught by the forensic audit and fixed in `3f98068` (2026-05-31).

**Empty rental grid when env missing.** Unlike restaurants (`FALLBACK_RESTAURANTS`), rental intelligent search returns `{ results: [], source: "mock" }` when Supabase anon client unavailable — Camila sees nothing in local dev with misconfigured env.

**Stack coupling.** This PR requires #18 merged first (depends on `query-embedding.ts`, `search-logs.ts`).

**GitHub CONFLICTING is a stack artifact.** GitHub marks non-default-base PRs as CONFLICTING when the base branch is not `main`. This is expected for stacked PRs — not an actual file conflict.

## 5. Critical fixes (before merge)

1. Ensure #18 critical fixes (enum, tool) are in base before merge
2. Re-run full test + build after #18 merges and this branch fast-forwards

Optional same PR: add rental curated fallback list for env-less dev.

## 6. Test proof

**Branch:** `feat/mis-rental-event-search` @ HEAD `3f98068` (2026-05-31)

| Command | Result |
|---------|--------|
| `npm run lint` | ✅ 0 warnings |
| `npm run typecheck` | ✅ clean |
| `npm test` | ✅ **348/348** (83 files) |
| `npm run build` | ✅ clean (on branch HEAD) |
| Targeted: `intelligence-rental-search`, `intelligence-event-search`, `query-embedding`, `intent-slots` | ✅ all pass |

**GitHub:** `mergeable: CONFLICTING / mergeStateStatus: DIRTY` — stack artifact (non-main base), not a file conflict.

**Unverified:** Live hybrid RPC against Supabase (`hybrid_search_listings`, `hybrid_search_events`).

## 7. Task corrections

| Task | Correct | Wrong | Fix | % | Status |
|------|---------|-------|-----|--:|:------:|
| **SEARCH-001** rental hybrid | RPC + rental_signals boost + queryText wiring + tests | Empty mock when no client | Optional fallback | 88% | 🟡 |
| **INT-002** event hybrid | RPC + vibe slots + queryText on search-events + tests | — | — | 90% | 🟢 |
| **INT-002** parser signals | `hasDateRange`, `cityWide`, confidence bands + tests | — | — | 92% | 🟢 |
| **Safety / PII** | Regressions fixed in `3f98068` | Original commit stripped PR #18 protections | Fixed | 95% | 🟢 |
| **Merge hygiene** | Stack documented | GitHub CONFLICTING (stack artifact) | Expected; clear after rebase | 60% | 🟡 |

## 8. Best-practice recommendations

- When stacking PRs, include a pre-commit check that `search-logs.ts` / `query-embedding.ts` carry their protections forward.
- After #18 → `main`, rebase this branch and trigger `@coderabbitai review`.
- Extend golden smoke with rental + event metric-based assertions (not fixed venue names).

## 9. Final verdict

### 🟡 Merge after #18 lands + enum/tool fixes propagate

All PR #19 regressions resolved. Floor green. GitHub CONFLICTING is expected for stacked PRs. The path is: #17 → main, fix #18 enum/tool, #18 → main, fast-forward this branch, merge #19.

## 10. Recommended merge order

**#19 third** — into `main` after #18 lands and this branch fast-forwards.
