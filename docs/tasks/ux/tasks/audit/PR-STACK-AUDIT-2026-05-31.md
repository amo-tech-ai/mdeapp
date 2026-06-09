---
title: amo-tech-ai/mdeapp — open PR stack forensic audit
date: 2026-05-31
last_verified: 2026-05-31T21:20Z
main_sha: 971ab1bc9d9ad61b85492074eeea61eaa8cf276a
auditor: claude (senior software specialist / forensic auditor)
method: gh CLI per-PR (view/checks/diff/commits/reviews) + Supabase MCP security advisors + CLAUDE.md hard rules + local floor re-probe
skills_used: task-verifier, mde-supabase (RLS), copilotkit-integrations (Mastra disabled-action render), mastra, mde-maps, gemini
mcp_used: Supabase get_advisors(security) on project zkwcbyxiwklihegjhuql; CopilotKit search-docs (v1 useCopilotAction render)
repo_default_branch: main
prs_audited: 21,22,23,24,25,26,27,19,20,18(merged ref),17(closed ref)
revision: 2 — post-merge #21+#22; typecheck fixes on #25/#26; peer review corrections applied
---

# mdeai open-PR stack — forensic audit (2026-05-31)

> Each PR audited in isolation against disk + live DB. Findings are **not** mixed between PRs.
> Verified facts are marked ✅; anything I could not confirm is marked ⚠️ UNVERIFIED.

## Stack topology (verified via baseRefName/headRefName + commit SHAs)

```text
main @ 971ab1b (#21+#22 merged)
 ├─ ✅ #21  feat/ux-g1-error-bridge     MERGED @ 65d1cef (2026-05-31T21:07Z)
 ├─ ✅ #22  feat/ux-audit-b-fixes       MERGED @ 971ab1b (2026-05-31T21:17Z)
 │    ├─ #24  feat/ux-g2-event-memory    (base #22 → rebase onto main pending)
 │    ├─ #25  feat/ux-g2-venue-anchors   (rebased onto main + typecheck fix f780b06)
 │    └─ #26  feat/ux-g2-writer-custom   (rebased onto main + typecheck fix 3ce7942)
 │         └─ #27 feat/ux-g2-live-audit   (base #26) — dup #24+#25 commits; rebase last
 ├─ #23  feat/supabase-track-migrations  (base main)  UNSTABLE — Supabase Preview FAIL
 └─ (merged) #18 feat/search-003-restaurants → main @16:41Z
       └─ #19  feat/mis-rental-event-search  CONFLICTING/DIRTY
            └─ #20 feat/vec-embedding-cache [DEFERRED]
 (closed) #17 kitchen-sink — split into #21/#22/#23
```

**Two structural problems still drive risk:** (1) #18 merged, orphaning #19 → #19 conflicts; (2) #27 duplicates #24+#25 as different-SHA commits on #26 — rebase/cherry-pick `9ebc34a` only after siblings land.

## Floor matrix (local re-probe 2026-05-31T21:20Z)

| PR | lint | typecheck | test | build | gh CI |
|----|------|-----------|------|-------|-------|
| #21 | ✅ | ✅ | ✅ | ✅ | ✅ merged |
| #22 | ✅ | ✅ | ✅ | ✅ | ✅ merged |
| #24 | ✅ | ✅ | ✅ | — | ⚠️ Vercel only (stacked base) |
| #25 | ✅ | ✅ (post f780b06) | ✅ | — | ⚠️ Vercel only |
| #26 | ✅ | ✅ (post 3ce7942) | ✅ | — | ⚠️ Vercel only |
| #27 | ✅ | ❌ (inherits pre-fix stack) | ✅ ux-stack | — | ⚠️ Vercel only |
| #23 | ✅ | ❌ Deno edge fns | ✅ | ✅ | ❌ Supabase Preview fail |

Per `index-skills.md` Done gate: require `npm run floor` locally when stacked PRs skip GitHub CI (`task-verifier` §2).

---

## PR #21 — G1: error bubble, thinking, UX-015 bridge, UX-027 copy

**1. Purpose.** Focused G1 slice extracted from closed kitchen-sink #17: UX-002 error notice, UX-005 thinking indicator + pending-send store, UX-015 v1 error bridge + UX-016 e2e, UX-027 rental copy-leak fix. Scope matches title — 19 files, no Supabase/G2/search work. ✅ scope clean.

**2. Risk score: ✅ 100% — MERGED.**

**3. Scorecard**

| Area | Score | Status | Notes |
|---|---:|---|---|
| Scope control | 95% | 🟢 | G1-only; correctly excludes B-fixes/G2/supabase |
| Code correctness | 92% | 🟢 | v1 `setInternalErrorHandler` via `useCopilotContext`; **no `/v2` imports** (✅ verified in diff) |
| Tests | 90% | 🟢 | vitest (error/pending/copy) + `e2e/concierge-run-error.spec.ts`; CI `lint·test·build` **PASS** |
| Security/privacy | 95% | 🟢 | no service-role, no secrets |
| Runtime safety | 85% | 🟡 | internal CopilotKit APIs version-locked at 1.55.2 — Phase-2 v2 migration note |
| Merge readiness | 100% | ✅ | **MERGED** `65d1cef` @ 2026-05-31T21:07:44Z |

**4. Errors / blockers.** None — shipped.

**7. Merge decision: ✅ MERGED** — `65d1cef5c6fb8fd640218bc5568e87b3a4bc133f`.

---

## PR #22 — live-audit B-fixes (B-01…B-10) + dev PORT pin

**1. Purpose.** Audit remediation from the 2026-05-31 live run: map billing/referer help (B-01), curated café/restaurant fallback when ADK down (B-02/B-10), coffee/dining classifier regex (B-04/B-09), `/rentals`→`/chat` redirect (B-05), event date filter excludes past events (B-06), rental empty-reply fix (B-07), Mastra `PORT=4111` pin. 12 files, no migrations/G1/G2. ✅ scope matches. **This branch is the base of #24/#25/#26.**

**2. Risk score: ✅ 100% — MERGED.**

**3. Scorecard**

| Area | Score | Status | Notes |
|---|---:|---|---|
| Scope control | 92% | 🟢 | search/classifier fixes only; correctly excludes supabase + G1 |
| Code correctness | 90% | 🟢 | B-06 past-event filter; B-09 dinner/rooftop regex (unit-tested) |
| Tests | 90% | 🟢 | vitest classifier + event-logic; CI `lint·test·build` **PASS** |
| Security/privacy | 95% | 🟢 | none |
| Runtime safety | 85% | 🟡 | `PORT=4111 mastra dev` — POSIX only |
| Merge readiness | 100% | ✅ | **MERGED** `971ab1b` @ 2026-05-31T21:17:49Z (merge commit) |

**4. Errors / blockers.** None — shipped. ⚠️ Browser golden queries still recommended on prod preview.

**7. Merge decision: ✅ MERGED** — `971ab1bc9d9ad61b85492074eeea61eaa8cf276a`.

---

## PR #23 — track Supabase migrations / seeds / edge fns (DATA-005)

**1. Purpose.** Commit 100 files of `supabase/` infra (88 migrations incl. 21k-line `remote_schema` baseline, seeds, edge functions, rollbacks) to version-control state already applied to the shared remote. No app/UX changes. Scope matches title, but the **size makes line-by-line review impossible** — this is "track what's on remote," not "introduce new behavior."

**2. Risk score: 🟡 74% — verification needed before merge.**

**3. Scorecard**

| Area | Score | Status | Notes |
|---|---:|---|---|
| Scope control | 80% | 🟡 | infra-only ✅, but 100 files / 21,423 additions — unreviewable as a unit |
| Code correctness | 70% | 🟡 | **Supabase Preview = FAIL** (not cancelled) → migrations **never validated by clean replay** on CI ⚠️ |
| Tests | 65% | 🟡 | CI `lint·test·build` PASS, but body admits Deno edge-fn typecheck caveat; no migration dry-run evidence |
| Security/privacy | 88% | 🟢 | ✅ every NEW DATA-0xx table has `ENABLE ROW LEVEL SECURITY` + ≥1 policy (venue_anchors, embedding_jobs, venue/event/rental_signals, neighborhood_profiles, evidence trio, search_logs/grounding_failures/signal_generation_logs, query_embedding_cache) — verified in diff. Edge fns use service-role but live under `supabase/functions/**` (allowed). |
| Runtime safety | 78% | 🟡 | future-dated migrations `20260601*` (tomorrow) — harmless for ordering but unusual; relies on remote already matching |
| Merge readiness | 70% | 🟡 | UNSTABLE — Supabase Preview **fail** |

**Live Supabase security advisors (MCP, project zkwcbyxiwklihegjhuql): 121 findings — 1 ERROR, 120 WARN.**
- 🔴 ERROR `rls_disabled_in_public` → **`public.spatial_ref_sys`**. This is the **PostGIS extension-owned** system table; it cannot take RLS by normal grants and is a well-known unavoidable Supabase advisor. **Not introduced by #23's app tables** — do not block #23 on it. (CLAUDE.md "new table" rule targets app tables, all of which are compliant.)
- 🟡 113× `*_security_definer_function_executable` (anon/authenticated) — large surface of SECURITY DEFINER RPCs executable by anon/auth roles. Mostly intentional RPCs (rate-limit, schedule-tour atomics, save-counts). Accumulated across the whole migration history, not #23-specific. Review the anon-executable ones for least-privilege as a **follow-up**.
- 🟡 2× `rls_policy_always_true` → `delivery_receipts`, `email_outbox` (service_role `USING(true)`) — service-only system tables; low concern.
- 🟡 `function_search_path_mutable` → `trigger_set_timestamps`; 3× `extension_in_public` (pg_trgm, postgis, vector). Common Supabase patterns; low concern. (#23 ships `data010_search_path_hardening.sql` addressing most others.)

**4. Errors / blockers.**
- file: `supabase/migrations/**` (all) · problem: never replayed clean (preview **fail**) · why it matters: DR rebuild could fail mid-stream · severity: **High** · fix: `supabase db reset` on shadow DB + green replay log before merge.

**5. Red flags (plain English).** This PR is a photograph of a database that already exists, checked into git. The danger isn't the running site (it's fine) — it's the *next* person who tries to rebuild the database from these files. If migration #45 quietly assumes a column that only migration #80 adds, replay explodes. Nobody has run that replay yet (the robot that does it was cancelled). Prove the rebuild works once, then it's safe forever.

**6. Tests to run.** `supabase db reset` on a shadow project (clean replay) · `supabase db lint` · spot-check RLS on venue_anchors/search_logs via `select` as anon · edge-fn deploy smoke (ticket-checkout, ticket-payment-webhook signature, chat-lead-capture) in staging · `npm run build`.

**7. Merge decision: 🟡 Merge after a clean migration-replay proof.** Independent track — can land in parallel with #21/#22 once replay is green.

---

## PR #24 — UX-019 Option B event fast-path memory guard

**1. Purpose.** Two-site fix in `event-search-fast-path.ts`: **L55** stop inheriting stale `category` from memory when the current message has none (`category: s.hasCategory ? s.category : undefined`); **L81** remove the bare-follow-up memory-replay block. 2 files, 29/-9. ✅ exactly matches the forensic re-scope in `UX-019-event-fastpath-classifier-b09.md` (L55 primary, L81 secondary).

**2. Risk score: 🟢 88% — merge ready (after CI run).**

**3. Scorecard**

| Area | Score | Status | Notes |
|---|---:|---|---|
| Scope control | 95% | 🟢 | classifier-only, tiny, single concern |
| Code correctness | 92% | 🟢 | ✅ L55 fix preserves the clarify-answer flow (`s.hasCategory` true when user answers a category); ✅ L81 removal routes signal-less follow-ups to the agent |
| Tests | 88% | 🟢 | 3 new cases: Option-A regression, L55 (`category` undefined), L81 (`null`) — `it.fails`→`it` flipped |
| Security/privacy | 95% | 🟢 | none |
| Runtime safety | 88% | 🟢 | pure function; no I/O |
| Merge readiness | 80% | 🟡 | base is `feat/ux-audit-b-fixes` (a feature branch) so the **main-targeting `lint·test·build` job did not run** — the vitest proving this fix was never executed by CI; CodeRabbit "review skipped" |

**4. Errors / blockers.** None functional. Process gap: CI did not run the test suite on this branch.

**5. Red flags (plain English).** The fix is right, but the automated grader never opened this homework — GitHub only runs the full test job for PRs aimed at `main`, and this one aims at a sibling branch. Run `npm test -- event-search-fast-path` yourself before trusting the green checkmark.

**6. Tests to run.** `npm test -- event-search-fast-path` · manual chat: salsa events → then "Provenza tonight" shows no music bleed; → then "ok" routes to agent.

**7. Merge decision: 🟢 Merge after #22 lands + local vitest green.** Rebase onto main once #22 is on main (see merge-order note).

---

## PR #25 — UX-013 venue_anchors café fallback

**1. Purpose.** New `search-venue-anchors.ts` reads `public.venue_anchors WHERE kind='cafe' AND is_active` (anon key + RLS); `search-grounded-places` tries anchors before the curated restaurant fallback when ADK is down + the query is coffee. 4 files, 371/-5. ✅ scope matches; this is the canonical fix the task audit demanded (`venue_anchors` had 0 src refs).

**2. Risk score: 🟢 78% — merge ready after env confirm + retarget base to main.**

**3. Scorecard**

| Area | Score | Status | Notes |
|---|---:|---|---|
| Scope control | 92% | 🟢 | café-fallback only |
| Code correctness | 88% | 🟢 | `isCoffee` gate → venue_anchors → restaurant fallback (tested) |
| Tests | 88% | 🟢 | cafe-fallback 3/3 + fallback 3/3 vitest |
| Typecheck | 90% | 🟢 | ✅ fixed `f780b06` — cast `venue_anchors` rows; ADK mock + `ValidationError` union in tests |
| Security/privacy | 95% | 🟢 | `SUPABASE_ANON_KEY` only (correct for `src/mastra/tools/**`) |
| Runtime safety | 80% | 🟡 | silent degrade if env vars missing |
| Merge readiness | 78% | 🟡 | rebased onto main; retarget PR base → `main`; env + browser café smoke still required |

**4. Errors / blockers (resolved 2026-05-31).**
- ~~`search-venue-anchors.ts:67` `never` type~~ → fixed via explicit `VenueAnchorRow[]` cast
- ~~fallback test `ValidationError` union~~ → fixed via `runGrounded()` helper + `adkUnavailableMock()`

**7. Merge decision: 🟢 Merge after retarget to main + env confirm + browser café smoke.**

---

## PR #26 — UX-014 drop writer.custom from search tools

**1. Purpose.** Remove `context?.writer?.custom()` from `search-restaurants/-rentals/-events/-attractions`; cards now render solely via CopilotKit `useCopilotAction({available:"disabled", render})`. 6 files, 91/-99. ✅ scope matches.

**2. Risk score: 🟡 75% — merge after live browser smoke + retarget base to main.**

**3. Scorecard**

| Area | Score | Status | Notes |
|---|---:|---|---|
| Scope control | 92% | 🟢 | tool-emit only |
| Code correctness | 88% | 🟢 | `useDisabledToolRender` mirrors all tool IDs (copilotkit-integrations pattern) |
| Tests | 85% | 🟢 | mastra-tool-action-names + fallback 7/7 vitest |
| Typecheck | 90% | 🟢 | ✅ fixed `3ce7942` — narrow `execute()` return in fallback test |
| Runtime safety | 78% | 🟡 | single-pipe render — needs live agent-path card smoke |
| Merge readiness | 75% | 🟡 | rebased onto main; browser smoke required |

**4. Errors / blockers (resolved 2026-05-31).**
- ~~`search-restaurants-tool-fallback.test.ts:47` ValidationError union~~ → fixed via cast

**7. Merge decision: 🟡 Merge after retarget to main + live browser smoke (restaurant + attraction cards).**

---

## PR #27 — UX-031 live-audit vertical matrix + test:e2e:ux

**1. Purpose.** Serial Playwright gate (rental → events → dinner-after-events → café-ADK-down) + `maps-layout` send-helper hardening + `package.json` e2e scripts. Body says base = #25 but actual base = `feat/ux-g2-writer-custom` (#26).

**2. Risk score: 🔴 62% — do not merge as-is; stack-integrity defect.**

**3. Scorecard**

| Area | Score | Status | Notes |
|---|---:|---|---|
| Scope control | 55% | 🔴 | **carries duplicate copies of #24 and #25**: commits `c9398fb` (UX-019) and `44d8242` (UX-013) — different SHAs from #24's `cea83d8` and #25's `99c7170`. Only `9ebc34a` (e2e bundle) is unique. |
| Code correctness | 82% | 🟢 | the e2e spec is sound: serial mode, asserts `/api/events/search` NOT called after dinner, asserts café card + not "No places found", uses real `data-testid` selectors |
| Tests | 80% | 🟢 | this *is* the test PR; body flags UX-016 flaky when bundled first (run alone) |
| Security/privacy | 95% | 🟢 | none |
| Runtime safety | 70% | 🟡 | depends on #24+#25 logic; if #27 merges before/independently of them, two divergent copies of the same fix exist in history |
| Merge readiness | 45% | 🔴 | must be rebased onto main **after** #24/#25/#26 land, dropping the duplicate commits |

**4. Errors / blockers.**
- file: branch `feat/ux-g2-live-audit` · problem: duplicates UX-019 + UX-013 as new-SHA commits on top of #26 instead of stacking on the real #24/#25 · why it matters: independent merges create two histories of the same change; rebasing later risks conflicts on `search-grounded-places.ts`, `event-search-fast-path.ts`, search tools · severity: **High (process)** · fix: after #22/#24/#25/#26 land on main, `git rebase --onto main feat/ux-g2-writer-custom feat/ux-g2-live-audit`; identical patches drop via patch-id — if they don't, cherry-pick **only** `9ebc34a` onto a fresh branch off main and open a clean e2e PR.

**5. Red flags (plain English).** Imagine three siblings each hand in the same essay, but #27 also re-includes copies of two siblings' essays stapled to its own. When the teacher grades them separately, the same essay gets filed twice under different names. Untangle it by rebasing #27 *after* the others are accepted so git can recognize and discard the duplicates — then #27 contains only its own new work (the test file).

**6. Tests to run (after rebase).** `npm run test:e2e:ux` (or `concierge-run-error` alone if flaky) · `npm run test:ux-stack` · confirm `git log main..HEAD` shows **only** the e2e commit.

**7. Merge decision: 🔴 Do not merge now → 🟡 Merge last, after rebasing onto main.**

---

## PR #19 — MIS rental + event hybrid search (SEARCH-001, INT-002)

**1. Purpose.** Hybrid rental/event intelligence search: intent slots, rental query parser, `intelligence-event-search`/`intelligence-rental-search`, query-embedding, search-logs, restores `scripts/intelligence/golden-queries-smoke.ts`. 23 files, 1393/-142. Substantial, legitimately scoped feature.

**2. Risk score: 🔴 55% — blocked, needs full rebase.**

**3. Scorecard**

| Area | Score | Status | Notes |
|---|---:|---|---|
| Scope control | 78% | 🟡 | large but coherent (hybrid search). Restores the `golden-queries-smoke.ts` the task audit found missing on main ✅ |
| Code correctness | ⚠️ | 🟡 | UNVERIFIED — cannot read clean diff while CONFLICTING; body claims 348 tests / golden 8/8 (needs re-proof post-rebase) |
| Tests | ⚠️ | 🟡 | intent-slots, rental-query-parser, intelligence-event/rental, query-embedding tests present; CI `lint·test·build` job not shown for this base |
| Security/privacy | ⚠️ | 🟡 | not fully audited — re-run on rebased diff |
| Runtime safety | ⚠️ | 🟡 | overlaps `search-restaurants/-events/-rentals/-grounded`, `use-event-search-fast-path`, `concierge.ts` — every file the merged #18 + #22/#24/#25/#26 also touch |
| Merge readiness | 30% | 🔴 | **CONFLICTING/DIRTY** — base `feat/search-003-restaurants` was merged into main via #18 @16:41Z today, orphaning this branch |

**4. Errors / blockers.**
- problem: base branch merged out from under it → ~8 overlapping files with main · why it matters: cannot merge until rebased; conflicts on the exact hot files the whole UX stack edits · severity: **Blocker** · fix: `git fetch origin && git checkout feat/mis-rental-event-search && git rebase origin/main` **after** the entire UX stack (#21/#22/#24/#25/#26/#27) lands; resolve preferring main's merged search + UX fixes, keep #19's intelligence modules; retarget PR base → `main`; re-run `npm test` + `npm run test:e2e e2e/rich-card-dedup.spec.ts`.

**5. Red flags (plain English).** This PR was built on a branch that has since been folded into main, so git now sees the same restaurant-search edits as both "already in main" and "proposed again here" — that's the conflict. It's not broken code, it's stale plumbing. Rebase it onto today's main, settle the overlaps once, and it's reviewable again. Do this **last** so it absorbs all the UX changes in one rebase instead of several.

**6. Tests to run (post-rebase).** `npm run lint && npm run typecheck && npm test` (≥ main baseline) · `npm run test:e2e e2e/rich-card-dedup.spec.ts` · `node scripts/intelligence/golden-queries-smoke.ts` if restored · `npm run build` · security re-audit on clean diff.

**7. Merge decision: 🔴 Do not merge → rebase onto main after the UX stack, then re-audit.**

---

## PR #20 — embedding registry + pre-embed worker + grounding verify [DEFERRED]

**1. Purpose.** `embedding-registry.ts`, `scripts/intelligence/embed-worker.ts`, `verify-card-grounding.ts` + tests. 7 files, 456/-0 (pure additions). Title self-marks **[DEFERRED]**. Stacks on #19.

**2. Risk score: 🟡 70% — clean code, correctly deferred.**

**3. Scorecard**

| Area | Score | Status | Notes |
|---|---:|---|---|
| Scope control | 85% | 🟢 | additive, isolated; deferred per body |
| Code correctness | 78% | 🟡 | additions only, has tests; not exercised in prod path yet |
| Tests | 78% | 🟡 | `embedding-registry.test.ts`, `verify-card-grounding.test.ts` |
| Security/privacy | 85% | 🟢 | `embed-worker.ts` uses `SUPABASE_SERVICE_ROLE_KEY` but lives under `scripts/` (**outside `src/**`** → allowed; standalone Node worker, never bundled to client). ✅ Gemini key `GOOGLE_GENERATIVE_AI_API_KEY` (correct per CLAUDE.md). |
| Runtime safety | 75% | 🟡 | depends on #19; embedding tables from #23 (data040_embedding_jobs, vec004 cache) |
| Merge readiness | 60% | 🟡 | CLEAN vs its base, but base is #19 (conflicting) → can't land until #19 does |

**4. Errors / blockers.** Non-mergeable until #19 lands (transitive base conflict). No code blocker.

**5. Red flags (plain English).** Nothing alarming — it's clearly labelled "not yet." Just remember it sits on top of #19, so it inherits #19's rebase problem; it can't move until #19 does.

**6. Tests to run.** `npm test -- embedding-registry verify-card-grounding` · dry-run `node scripts/intelligence/embed-worker.ts` against staging (service-role, off-prod).

**7. Merge decision: 🟡 Keep deferred; rebase onto main after #19; merge when Phase-2 search is activated.**

---

## PR #18 — SEARCH-003 hybrid restaurant search (MERGED, reference only)

**Status: ✅ MERGED to main @ 2026-05-31T16:41:37Z.** Nothing to action. Its merge is the proximate cause of #19's conflict (it carried `feat/search-003-restaurants` into main). Referenced here only to explain stack state. #17 is CLOSED (kitchen-sink, split into #21/#22/#23) — reference only.

---

## Combined summary table

| PR | Title | Base | State | Score | Decision |
|---|---|---|---|---:|---|
| #21 | G1 error/thinking/bridge/copy | main | **MERGED** | ✅ 100% | Done `65d1cef` |
| #22 | live-audit B-fixes | main | **MERGED** | ✅ 100% | Done `971ab1b` |
| #23 | track supabase infra | main | UNSTABLE | 🟡 72% | Merge after clean replay proof |
| #24 | UX-019 event memory guard | #22→main | CLEAN | 🟢 82% | Rebase onto main; merge |
| #25 | UX-013 venue_anchors café | main* | CLEAN | 🟢 78% | Retarget PR; env + browser smoke |
| #26 | UX-014 drop writer.custom | main* | CLEAN | 🟡 75% | Retarget PR; browser smoke |
| #27 | UX-031 live-audit e2e | #26 | CLEAN* | 🔴 58% | Rebase last; dup commits |
| #19 | MIS rental/event hybrid | #18(merged) | CONFLICTING | 🔴 55% | Rebase after UX stack |
| #20 | embedding registry [DEFERRED] | #19 | CLEAN | 🟡 70% | Keep deferred |
| #18 | SEARCH-003 restaurant | main | MERGED | ✅ | Done |

\*#25/#26 rebased onto `main` locally; **retarget GitHub PR base to `main`** before merge.

*#27 mergeable vs its base but carries duplicate #24/#25 commits.

## Safest merge order (validated + corrected)

```text
✅ 1. #21  MERGED (65d1cef)
✅ 2. #22  MERGED (971ab1b) — merge-commit preserved audit SHAs
3. rebase #24 onto main; retarget PR base → main
4. #25/#26 — rebased + typecheck fixed (f780b06, 3ce7942); retarget PR bases → main
   merge order: #24 → #25 → #26 (any order OK after rebase)
   gates: #25 env + browser café · #26 live agent-path card smoke
5. #27 — rebase onto main AFTER #24–#26; cherry-pick only e2e commit if dup patches persist
6. #23 — parallel track; gate on `supabase db reset` replay (Preview **fail**)
7. #19 — rebase onto main after UX stack
8. #20 — deferred after #19
```

Your proposed order was directionally right. Two corrections: (a) #24/#25/#26 require an explicit `rebase --onto main` once #22 squash-merges (their `feat/ux-audit-b-fixes` base vanishes); (b) **#27 must be rebased, not fast-merged on #26**, or it double-applies #24/#25.

## Top blockers (severity-ordered, rev 2)

1. 🔴 **#27 duplicate-commit stack defect** — rebase/cherry-pick e2e only after #24–#26 land.
2. 🔴 **#19 CONFLICTING** — rebase onto main after UX stack.
3. 🟡 **#23 migrations never replayed** — Supabase Preview **fail**; prove `supabase db reset` green.
4. 🟡 **#26 live agent-path card smoke** — writer.custom removed; browser proof still required.
5. 🟡 **#25 env + browser café smoke** — silent degrade without `SUPABASE_URL`/`SUPABASE_ANON_KEY`.
6. 🟡 **Retarget #24/#25/#26 PR bases to `main`** — branches rebased locally; GitHub still shows stacked bases.
7. 🟡 **Stacked PRs skip GitHub floor CI** — run local `npm run floor` per task-verifier.
8. 🟡 **#23 Deno typecheck** — exclude `supabase/functions/**` from Next tsc or add Deno CI job.
9. 🟡 **CodeRabbit skipped** on #24–#27 — manual review pass.
10. 🟢 **#21 internal CopilotKit APIs** — not in public docs; version-locked 1.55.2.

**Resolved since rev 1:** #21/#22 merged; #25/#26 typecheck blockers fixed (`f780b06`, `3ce7942`).

## Next 3 actions

1. **Retarget #24/#25/#26 to base `main`** on GitHub; rebase #24 onto `origin/main`; merge G2 slices in order.
2. **Browser proofs:** café query (#25) + agent-path restaurant cards (#26) on Vercel preview.
3. **Rebase #27** onto main after G2 merges; gate #23 on migration replay.

---

### Method note / skills + MCP provenance
- **Supabase MCP** `get_advisors(security)` on `zkwcbyxiwklihegjhuql` → 121 findings classified (1 ERROR PostGIS-owned, 113 SECURITY DEFINER, etc.). RLS-on-new-tables verified directly from migration diffs (mde-supabase rules).
- **copilotkit-integrations / mastra**: verified the disabled-action render contract for #26 (`useDisabledToolRender` for all tool names under `MASTRA_COPILOT_TOOL_ACTIONS.*`/`MASTRA_TOOL_IDS.*`) — the canonical CK 1.55.2 + Mastra pattern; #21 v1-only confirmed against `@copilotkit/react-core` (no `/v2`).
- **CLAUDE.md hard rules** applied throughout: service-role only outside `src/**` (#20 scripts OK, #25 anon-key OK), Gemini-only env name (#20 ✅), 1.55.2 v1-only (#21 ✅), RLS+policy per new table (#23 ✅).
- ⚠️ UNVERIFIED: #19 clean diff (conflict); #23 migration replay (preview fail); #27 e2e bundle (not re-run post-fix).
- **Rev 2 changelog:** #21+#22 merged; #23 preview status corrected FAIL; #25/#26 typecheck fixes shipped; floor matrix added; scores adjusted.
