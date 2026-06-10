---
title: PR #20 forensic audit — VEC embedding infra [DEFERRED]
date: 2026-05-30
last-verified: 2026-05-31
pr: https://github.com/amo-tech-ai/mdeapp/pull/20
branch: feat/vec-embedding-cache → feat/mis-rental-event-search
auditor: cursor (forensic PR audit) + claude-sonnet-4-6 (re-verify 2026-05-31)
refs: VEC-003, VEC-004, DATA-042, MIS-M2
---

# PR #20 — `feat(search): embedding registry + pre-embed worker [DEFERRED]`

## 1. Summary

| Item | Detail |
|------|--------|
| **What it does** | `embedding-registry.ts` (VEC-003 constants + cache key helpers), `embed-worker.ts` (CLI to drain `embedding_jobs`), `verify-card-grounding.ts` + CLI script, package scripts `embed:worker` + `verify:grounding-cards`. |
| **Scope** | **13 files** vs base (original audit said 7 — incorrect). Also modifies `search-logs.ts`, `search-restaurants.ts`, `intent-slots.ts`, `query-embedding.ts` — shared files that overlap with #18/#19 fixes. |
| **Merge readiness** | **40%** ↓ (needs rebase onto updated #19; `search-logs.ts` PII stripped again in this branch) |

## 2. Scorecard

| Area | Score | Status | Notes |
|------|------:|:------:|-------|
| Scope control | 78% | 🟡 | Core infra is focused; but modifies shared #18/#19 files (search-logs, intent-slots, query-embedding) |
| Code correctness | 65% | 🟡 | **No Supabase cache read/write** despite PR title; name mismatch |
| Test coverage | 85% | 🟢 | Registry + grounding unit tests pass on branch HEAD |
| Security/privacy | 55% | 🔴 | `search-logs.ts` **PII protection stripped again** (no `truncateQuery`/`hashId`) — regression vs both #18 and #19 fix |
| Runtime safety | 50% | 🔴 | Cache provides no benefit until DATA-042 + migration in repo |
| Best practices | 70% | 🟡 | `embed-worker.ts` has brittle env parsing; `verify:mis-phase1` path still broken |
| **Merge readiness** | **40%** | 🔴 | **Do not merge** — needs rebase + PII fix + MIS-M2 + DATA-042 |

## 3. Errors found

| File | Issue | Severity | Status | Exact fix |
|------|-------|----------|--------|-----------|
| `src/mastra/lib/search-logs.ts` | `truncateQuery()` + `hashId()` stripped — PII protection missing | **Critical** | 🔴 **OPEN** (regression vs #18 + #19 fix) | Rebase onto updated `feat/mis-rental-event-search` which restores both |
| PR description vs code | Claims "Supabase-backed cache for query embeddings" | **Major** | 🔴 **OPEN** | `embedding-registry.ts` is constants-only — no `query_embedding_cache` reads/writes |
| `supabase/migrations/` | No `query_embedding_cache` migration in repo | **Blocker** | 🔴 **OPEN** | Copy `vec004_query_embedding_cache` from remote into `supabase/migrations/` |
| DATA-042 gate | Corpus pre-embed not done | **Blocker** | 🔴 **OPEN** | Complete embed worker run + gate sign-off before enabling cache path |
| `scripts/intelligence/embed-worker.ts:17-26` | Brittle manual `.env.local` parser (same pattern removed from golden-queries in #18) | Low | 🔴 **OPEN** | Use `npx tsx --env-file=.env.local` (already established pattern) |
| `package.json` | `verify:mis-phase1` → `../scripts/...` | Medium | 🔴 **OPEN** (re-introduced) | Fix path (same as #18 fix `97a0c0d`) |

> **Scope note (corrected):** Original audit counted 7 files. Actual diff vs base (`feat/mis-rental-event-search`) is **13 files**, including `src/lib/intent-slots.ts`, `src/lib/__tests__/intent-slots.test.ts`, `src/mastra/lib/search-logs.ts`, `src/mastra/tools/search-restaurants.ts`, `src/mastra/lib/__tests__/query-embedding.test.ts` — all shared with #18/#19.

## 4. Red flags

**PII regression (third time).** PR #18 added PII protection. PR #19's original commit stripped it (fixed in `3f98068`). PR #20 strips it again — `search-logs.ts` on this branch has neither `truncateQuery()` nor `hashId()`. Rebase onto the updated `feat/mis-rental-event-search` will surface this as a conflict that must be resolved in favor of the protective version.

**Misleading "cache" PR.** `embedding-registry.ts` normalizes text and defines model constants but performs **no DB read/write**. Merging early adds code paths and scripts with no latency win until the corpus is embedded and a real cache I/O layer exists.

**Missing migration = non-reproducible infra.** Remote Supabase has `query_embedding_cache` (per MCP audit). This PR ships zero `supabase/migrations/` changes for it. CI and fresh clones cannot verify VEC-004.

**Rebase will have conflicts.** Our `3f98068` commit on `feat/mis-rental-event-search` changed `search-logs.ts`, `query-embedding.ts`, `search-restaurants.ts`, and `intent-slots.ts`. PR #20 also modified those files. Rebase will require manual conflict resolution — always take the protective version.

## 5. Critical fixes (before merge — post deferral)

1. Rebase onto updated `feat/mis-rental-event-search` (`3f98068`); resolve conflicts in favor of PII-protective versions
2. Land `query_embedding_cache` migration in `supabase/migrations/`
3. Implement actual get/set cache in hot path (`query-embedding.ts` or sibling)
4. DATA-042 corpus pre-embed + MIS-M2 QA sign-off
5. Fix `embed-worker.ts` env loading to `tsx --env-file`
6. Align PR title/body with delivered scope

## 6. Test proof

**Branch:** `feat/vec-embedding-cache` @ local HEAD (2026-05-30) — **not re-run after #19 fix**

| Command | Result (pre-fix state) |
|---------|--------|
| `npm run lint` | ✅ 0 warnings |
| `npm run typecheck` | ✅ clean |
| `npm test` | ⚠️ **Unknown** — branch needs rebase after `3f98068`; pre-fix run showed 345/345 |
| Targeted: `embedding-registry`, `verify-card-grounding` | ✅ passed (pre-fix) |

**GitHub:** `mergeable: MERGEABLE / mergeStateStatus: CLEAN` — misleading; base branch `feat/mis-rental-event-search` has advanced since this was computed.

**Note:** Two earlier test failures (`query-embedding.test.ts` on wrong branch) were not a property of PR #20 HEAD — they were from a leaked untracked file during a branch switch.

## 7. Task corrections

| Task | Correct | Wrong | Fix | % | Status |
|------|---------|-------|-----|--:|:------:|
| **VEC-003** embedding contract | Model/dim/key normalization + tests | Named "registry" but no cache I/O | Implement cache or rename | 60% | 🔴 |
| **VEC-004** embed worker | CLI drains `embedding_jobs`, uses service role appropriately | No migration; DATA-042 open | Gate + migration | 70% | 🟡 |
| **AI-004** grounding verify | Pure `verifyCardGrounding` + CLI smoke | Not wired into CI | Optional gate later | 85% | 🟢 |
| **PII safety** | Should inherit #19 protections | PII stripped again | Rebase + take protective version | 0% | 🔴 |

## 8. Best-practice recommendations

- Keep PR open as tracking branch; apply GitHub label **do-not-merge** immediately.
- When un-deferring, split: (A) rebase + migration + cache I/O, (B) worker ops runbook.
- Use `tsx --env-file` (established by #18 `97a0c0d`) instead of custom env parsers.
- Always carry forward `truncateQuery`/`hashId` when touching `search-logs.ts`.

## 9. Final verdict

### 🔴 Do not merge

Matches PR author's DEFERRED intent. Code is partially test-green but: (1) PII protections are stripped, (2) does not deliver advertised cache behavior, (3) lacks DB reproducibility, (4) needs rebase after #19 fix commit.

## 10. Recommended merge order

**#20 last** — only after #17 → #18 → #19 on `main`, then rebase, DATA-042, MIS-M2 sign-off, and cache migration lands.
