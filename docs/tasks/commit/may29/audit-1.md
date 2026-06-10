# Forensic Audit — PR #14 Split Plan (`tasks/commit/may29/`)

**Auditor:** Senior software specialist / forensic audit pass
**Date:** 2026-05-30
**Scope:** The 6 planning docs in `tasks/commit/may29/` that direct the split of GitHub PR **#14** (`amo-tech-ai/mdeapp`) into **PR A** (CopilotKit runtime fix) + **PR B** (café detail flow C-012).
**Method:** Every factual claim in the docs was re-derived from ground truth (git history, file tree, GitHub API, live floor) — **15 independent tests**. Nothing below is taken on the docs' word.

---

## 1. Executive verdict

| Question | Answer |
|---|---|
| Is the split decision correct? | **Yes.** PR #14 is `mergeable: CONFLICTING` + 0 test-gating CI + mixed scope. Do-not-merge-as-is is the right call. |
| Is the split plan executable as written? | **Yes**, with the 6 corrections in §5. The central PR-A operation was **proven** (worktree dry-run). |
| Is the code under the plan green? | **Yes** — floor passes: `tsc` 0, `lint` 0, **vitest 313/313**. |
| Any blocker the plan misses? | **One P0: there is still no CI.** The split fixes scope + conflict, but `.github/workflows/` does not exist. Merging A or B gates nothing. |
| Overall plan correctness | **92% — 🟢** |

**Dot legend:** 🟢 ≥90% (execute as-is) · 🟡 70–89% (execute with listed corrections) · 🔴 <70% (fix before executing).
**Percent-correct** per doc = mean of four axes: Accuracy · Completeness · Executability · Safety/Hygiene.

---

## 2. Tests run (the "verify 100%" pass)

| # | Test | Result | Verdict |
|---|------|--------|---------|
| T1 | All 12 cherry-pick SHAs exist in history | 12/12 resolve | 🟢 |
| T2 | `8fa5f10` file manifest = PR-A's claimed 8 files | exact match incl. `route.ts → [[...path]]/route.ts` rename | 🟢 |
| T3 | PR-B cherry-pick order vs branch topology | **exact** match minus the 3 skips | 🟢 |
| T4 | `b8d9f92` "duplicate of #13" skip claim | `9956277 …(#13)` **is the merge-base** → skip correct | 🟢 |
| T5 | `991db97` "superseded" skip claim | `76abde1` msg+diff **removes** `test:prod-gate` → skip correct | 🟢 |
| T6 | **PR-A cherry-pick dry-run** onto clean `origin/main` (isolated worktree) | 7 files auto-apply; **lone conflict = `search-tool-renders.tsx`**, exactly as runbook predicts | 🟢 |
| T7 | Floor — `tsc --noEmit` | exit 0 | 🟢 |
| T8 | Floor — `eslint . --max-warnings 0` | exit 0 | 🟢 |
| T9 | Floor — `vitest run` | **313/313** (77 files) | 🟢 |
| T10 | Catch-all route source exports | `GET` + `POST` → `handleCopilotKit`, `endpoint:"/api/copilotkit"` | 🟢 |
| T11 | Live runtime probe `:3001` | `GET /` 200; `POST /api/copilotkit {info}` **404** → **resolved**: fresh server mounts route (400, not 404) | ✅ stale server confirmed + fixed (§4, pass 2) |
| T12 | PR #14 mergeable (GitHub API) | `CONFLICTING` / `DIRTY`, 33 files, base `main` | 🟢 confirms B-01 |
| T13 | CI present? | `.github/workflows/` **absent**; checks = Vercel+Supabase+CodeRabbit only | 🔴 confirms B-02 |
| T14 | Café code claims (booking honesty, S5, B1) | all present in source (§3) | 🟢 |
| T15 | `restore-wip-c012.sh` "hardcoded path" claim | **refuted** — dynamic `ROOT=$(cd …/.. && pwd)` | 🟡 see §5-C1 |

---

## 3. Ground-truth confirmations (what the docs got right)

- **Commit graph is real and ordered.** Branch `feat/c012-cafe-places-detail` (**remote HEAD `8fa5f10`**; local may have unpushed merge `8c99ded`) carries, oldest→newest: `aec4801 d4dc9c3 33daaa9 8b312e6 b1817d0 72df10c 991db97 b8d9f92 895f459 72363c6 76abde1 8fa5f10` → merge `8c99ded`. PR-B-RUNBOOK's pick list reproduces this order **exactly**, dropping only `991db97`, `b8d9f92`, `8fa5f10`. Topologically sound.
- **`8fa5f10` is cleanly extractable** (T6). The runbook's "if conflict in `search-tool-renders.tsx`" is not hypothetical — it is the *only* conflict, and it is correctly scoped.
- **Skip rationales are provable**, not guesses: `b8d9f92` re-does the same-origin fix already shipped as #13 (`9956277`, the literal fork point); `991db97` adds a `test:prod-gate` script that `76abde1` then deletes as dead.
- **File classification holds.** 33 files total = 7 PR-A-only + 1 shared (`search-tool-renders.tsx`) + 25 PR-B (one of which, `restore-wip-c012.sh`, is correctly marked *exclude*). `search-tool-renders.tsx` shows **416** changed lines across the full PR vs **261** in `8fa5f10` alone — empirical proof it carries both runtime and café hunks, i.e. the "risky mixed" flag is real.
- **Café claims verified in source:**
  - Booking honesty — `cafe-booking-sheet.tsx:47` "Booking stub for Phase A", `:49` "No request is sent yet."
  - S5 — `cafe-detail-panel.tsx:455` renders directions only when `directionsUrl ?? mapsUrl` is set.
  - B1 filter — `search-grounded-places.ts` `normalizeCafeGroundingQuery` appends "Exclude bar lounges and nightlife venues."
- **Blockers B-01 / B-02 / B-07 reproduce** against live GitHub (T12, T13): CONFLICTING, no Actions, CodeRabbit "Review skipped."

---

## 4. The live-runtime 404 (T11) — root-caused, not a plan defect

`POST /api/copilotkit {"method":"info"}` returned **404** against the running `:3001` server, and `/api/places/detail` timed out. Investigated to ground:

- Server is `next-server v16.2.6`, pid `1507901`, cwd **correctly** `/home/sk/mdeai/mdeapp`, **uptime 37 min** (started 23:33:41).
- The route files are dated **23:40** — *after* the server booted — and the process survived this session's branch switches + worktree add/remove.
- Route **source is correct** (T10): `GET`+`POST` both exported on the catch-all.
- The unit floor compiles and passes (T7–T9).

**Conclusion:** stale dev-server route manifest (operational), **not** a code or plan defect. A clean `npm run dev` restart restores it — the *identical* code was verified green end-to-end earlier this session (agent reply + rental search → 5 cards + pins, console clean). **Honest residual:** I did not force a restart (avoiding the EADDRINUSE churn from earlier in the session), so there is no *fresh* green live probe in this pass — only the green floor + proven route source + prior in-session E2E. Treat "live green" as **pending a dev-server restart**.

> **✅ RESOLVED — pass 2 (2026-05-30, see [notes-pr-14.md](./notes-pr-14.md)):** the stale `:3001` was killed and a fresh `npm run dev:ui` booted. `GET /` → 200; `POST /api/copilotkit` now **mounts** (400 on empty `{info}` body — route present, *not* 404). Hypothesis confirmed: it was a stale manifest, not a defect. "Live green" is no longer pending.

---

## 5. Corrections — per finding (the "list corrections for each task")

**C1 — `restore-wip-c012.sh` "hardcoded path" is inaccurate (B-06 / PR-B-RUNBOOK).**
Evidence: the script uses `ROOT="$(cd "$(dirname "$0")/.." && pwd)"` and `WIP="${ROOT}/../drafts/wip-pr4-off-src"` — fully relative, no `/home/...`.
→ **The exclude-from-merge action is correct; the stated reason is wrong.** Fix the rationale to the *real* one: it is a one-shot dev scaffold that copies from an untracked `drafts/wip-pr4-off-src` dir that exists on no CI runner or teammate machine. Keep it out of both PRs.

**C2 — Test-count drift "312/312" → actual 313/313** (PR-A tasks line 19, PR-A-RUNBOOK verify).
Hedged with "(or current floor count)", so not fatal, but update the literal to **313** to keep the checklist self-checking.

**C3 — Add the missing P0: CI (B-02 is not resolved by the split).**
Neither runbook adds `.github/workflows/`. The split fixes *conflict* and *scope* but still merges A and B with **zero automated floor gate**. → Add a minimal Actions workflow (`tsc` + `lint` + `vitest`) and land it **with or before PR A**; add "CI green" to both PRs' verification checklists.

**C4 — Make the ordering inversion explicit in PR-B-RUNBOOK.**
On the branch `76abde1` (café B1/S1–S5) precedes `8fa5f10`; the plan extracts `8fa5f10` to land *first* on main, then replays `76abde1` *after*. Both touch `search-tool-renders.tsx`, so the café cherry-picks must **add onto** the already-stabilized base. The runbook says this once ("ADD café on top of PR A stable base") — promote it to a numbered, can't-miss step so the resolver doesn't clobber the PR-A render stabilization.

**C5 — Clarify B-03 "preview 401."**
GitHub shows Vercel "pass / Deployment completed" — the 401 is **deployment-protection on access**, not a build break. PR-B already routes around it ("If 401: bypass secret or localhost"). Reword B-03 so a reader doesn't chase a phantom build failure.

**C6 — E2E remains unproven in this pass (B-04).**
I ran the unit floor (313) but **not** Playwright (`SCREEN-021-cafe-listings`, `maps-grounding`). PR-B's verification checklist lists them; keep them as hard gates and mark B-04 open until a chromium run is attached. (S5's guard is `directionsUrl ?? mapsUrl` — slightly broader than "only when `directionsUrl`"; cosmetic, note it so the e2e asserts the right testid `cafe-detail-directions-link`.)

> **✅ RESOLVED — pass 2 (2026-05-30):** against the fresh `:3001`, chromium ran **5/5 green** — `maps-grounding.spec.ts` 1/1 (2.3m) + `SCREEN-021-cafe-listings.spec.ts` 4/4 (2.9m), both exit 0, incl. "no JSON leak or bar-lounge cards." B-04 closed. The SKILLS-audit "5/5 chromium failed" was a **stale-server false negative** (`reuseExistingServer:true` reused the 404ing `:3001`) → see [notes-pr-14.md](./notes-pr-14.md) C9. **Keep the fresh-server step 0** so this can't recur.

---

## 6. Blocker ledger (verified status)

| ID | Sev | Blocker | Verified state | Resolved by plan? |
|----|-----|---------|----------------|-------------------|
| B-01 | P0 | PR #14 `CONFLICTING` | ✅ reproduced (T12) | ✅ PR-A clean-branch + cherry-pick sidesteps it (T6) |
| B-02 | P0 | No GitHub Actions CI | ✅ reproduced (T13) | ❌ **still open** → C3 |
| B-03 | P1 | Vercel preview 401 | ⚠️ deployment-protection, not build | ✅ localhost fallback documented |
| B-04 | P1 | E2E not proven | ✅ **proven pass 2** — 5/5 chromium green (fresh `:3001`) | ☑ closed → C6/C9; keep e2e hard-gated in CI |
| B-05 | P1 | Mixed runtime+café scope | ✅ (416 vs 261 lines) | ✅ split resolves |
| B-06 | P2 | `restore-wip` red flag | ⚠️ real flag, **wrong reason** | ✅ excluded → fix reason C1 |
| B-07 | P2 | CodeRabbit stale | ✅ "Review skipped" (T13) | ◻️ re-request on café-only diff |

---

## 7. Per-document grades (dots · percent-correct · corrections)

| Doc | Accuracy | Complete | Executable | Safety | **% correct** | Dot | Corrections |
|-----|:--:|:--:|:--:|:--:|:--:|:--:|---|
| `INDEX.md` | 98 | 92 | 96 | 98 | **96%** | 🟢 | Add `audit-1.md` to the doc table. |
| `PR-14-SPLIT-FORENSIC-AUDIT.md` | 94 | 95 | 90 | 90 | **92%** | 🟢 | C1 (B-06 reason), C3 (CI), C5 (B-03 wording). |
| `PR-A-copilotkit-runtime-tasks.md` | 95 | 92 | 95 | 92 | **94%** | 🟢 | C2 (313), C3 (add CI gate row). |
| `PR-A-RUNBOOK.md` | 97 | 94 | 96 | 93 | **95%** | 🟢 | None to executability (T6 proved it); add CI push step (C3). |
| `PR-B-cafe-detail-flow-tasks.md` | 93 | 92 | 92 | 90 | **92%** | 🟢 | C6 (keep e2e hard-gated), C5 (preview 401 wording). |
| `PR-B-RUNBOOK.md` | 93 | 93 | 90 | 88 | **91%** | 🟢 | C1 (restore-wip reason), C4 (promote inversion note). |

**Underlying objects (for context, not docs):**

| Object | % correct | Dot | Note |
|---|:--:|:--:|---|
| Split **plan** soundness | **92%** | 🟢 | Execute A→B→close #14. |
| `8fa5f10` runtime fix | **92%** | 🟢 | Compiles, tests pass, route correct; **live-green confirmed** on fresh server (§4 pass 2). |
| Café C-012 feature | **90%** | 🟢 | Unit-green + honesty/S5/B1 present; **e2e now 5/5 green** (pass 2, C6/C9). Only CI automation absent. |
| **PR #14 merge-as-is readiness** | **38%** | 🔴 | CONFLICTING + no CI + mixed scope — *this low score is precisely what the plan concludes.* |

---

## 8. Best-practice recommendations

1. **CI before merge (highest leverage).** A 20-line Actions workflow running the floor turns every future PR from "trust the author" into "trust the gate." Single biggest hardening here.
2. **One concern per PR — the split codifies it.** Keep `search-tool-renders.tsx` as the canonical example in review guidance: runtime-stability hunks and feature hunks in one file is what made #14 un-reviewable.
3. **Restart the dev server before any idle/runtime probe.** Long-lived `next dev` across branch surgery yields false 404/timeout (§4). Add "fresh boot" as step 0 of every runbook's Verify block so reviewers don't misread a stale manifest as a regression.
4. **Make skip-rationales falsifiable.** PR-B already cites *why* each skipped SHA is safe (merge-base, superseding commit). Keep that habit — it's what let this audit confirm them in seconds.
5. **Ship dev-only scaffolds outside the PR.** `restore-wip-c012.sh` / `drafts/wip-*` belong in a personal branch or `.gitignore`, never the merge.
6. **Attach the chromium e2e artifact to PR B.** Unit-green ≠ flow-green; SCREEN-021 + maps-grounding are the persona proof (Tourist sees café cards, no bar-lounge distractors).

---

## 9. Bottom line

The `may29` split plan is **accurate, internally consistent, and executable** — 🟢 **92%**. The git forensics (SHAs, order, skips, file matrix) survive independent re-derivation, and the plan's central operation was *proven* by dry-run, conflict and all. The only material gap the plan under-weights is **CI absence (B-02 P0)**, plus three cosmetic inaccuracies (restore-wip reason, 312→313, B-03 wording) and one residual verification gap (e2e + a fresh live probe). Apply C1–C6, land a floor-running workflow with PR A, then execute **A → B → close #14**.

> **Sequence:** add CI ▸ PR A (cherry-pick `8fa5f10`, resolve `search-tool-renders.tsx`, floor+restart probe) ▸ merge A ▸ PR B (rebase on main, café-only, e2e green) ▸ `gh pr close 14`.
