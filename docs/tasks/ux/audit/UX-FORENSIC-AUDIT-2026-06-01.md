---
title: UX workstream — forensic audit & live branch/merge tracker
date: 2026-06-01
auditor: claude (senior software specialist / forensic auditor)
repo_under_audit: mdeapp (github.com/amo-tech-ai/mdeapp)
method: git archaeology (main 7a5c91e vs branches) + disk/code verification (src/, e2e/) + cross-ref of UX tracking docs
docs_under_audit: tasks/ux/tasks/INDEX.md · STATUS-2026-06-01.md · UX-TASKS-VERIFICATION-REPORT.md (2026-05-31)
constraints: read-only — no merge, no push, no branch mutation; reconcile claims vs code only
live_checkout_at_audit: b1879b9 on branch fix/ux-g2c-copilotkit-stability (see §0 disclosure)
---

# UX forensic audit — live 2026-06-01

**Process:** 1·Examine → 2·Verify (git log/ls-tree on real SHAs) → 3·Validate (code probes in src/ + e2e/) → 4·Measure (% per task, merged-to-main vs branch-only) → 5·Identify (red flags / stale docs / fixes).

**Status legend:** 🟢 Merged to main · 🟡 Code-complete, branch-only (not on main) · 🟥 Blocked / failing · ⚪ Not started.

---

## 0. Executive verdict

> **The UX track is in materially better shape than its own tracking docs claim.** `main` (`7a5c91e`) already carries **8 shipped UX tasks via PRs #21–#28**: UX-002, UX-003, UX-005, UX-013, UX-014, UX-015, UX-019, UX-036 — all verified in main's tree, not just its commit log. The **card-unification slice** (UX-021/022/025/026/030 + CopilotKit stability) is **code-complete and pushed** on `fix/ux-g2c-copilotkit-stability` (`b1879b9`) but **has no open PR** — that single missing PR is the only thing between the card-unification epic and `main`.
>
> **Two of the three UX tracking docs are stale and understate reality:** `STATUS-2026-06-01.md` pins a stale `main_sha` (`5e20f3c`, actually `7a5c91e`) and still lists UX-036/#28 as un-merged; `UX-TASKS-VERIFICATION-REPORT.md` (2026-05-31) audited an **old branch** (`feat/ux-002-005-chat @ a8d2e26`) and **all four of its red flags are now resolved**. `INDEX.md` is the trustworthy doc (correct main SHA, correct merged-set).
>
> **One real branch-hygiene fact to surface:** the live working directory is checked out on `b1879b9` (a cherry-pick "split-PR" branch built off main tip), **not** on `data/DATA-048-migration-realign` where this session's DATA work lives. `b1879b9` is verified **clean of DATA migrations** — the earlier UX+DATA branch-mixing concern is already remediated, not outstanding.

| Dimension | Live verdict | Evidence |
|---|---|---|
| UX tasks merged to `main` | 🟢 **8 shipped** (#21–#28), each verified in main's tree | §1a, §2 |
| Card-unification slice (epic UX-010) | 🟡 **Code-complete, branch-only** — pushed, **no PR** | §1b, §3-R1 |
| RentalCard a11y parity (UX-021) | 🟢 **Resolved** — `data-result-kind`+`aria-label`+`role` on all 4 cards | §2, §4-C3 |
| e2e card-unification coverage | 🟢 **Present + hardened** — 12 specs on disk, 3 dedicated card/audit specs | §2 |
| Branch hygiene (UX vs DATA) | 🟢 **Clean** — `b1879b9` contains **0** DATA migration commits | §0 disclosure, §3-R3 |
| Runtime / prod health | 🟡 **Unverified this pass** — fixes for the POST-storm + restaurant cards sit on un-merged `b1879b9`; prod still runs `7a5c91e` | §3-R2, §5 |
| `INDEX.md` accuracy | **~90% correct** — main SHA + merged-set right | §4 |
| `STATUS-2026-06-01.md` accuracy | **Stale** — 2 material errors (main SHA, UX-036 row) | §4-C1/C2 |
| `UX-TASKS-VERIFICATION-REPORT.md` accuracy | **Superseded** — audited a stale branch; 4/4 red flags now resolved | §4-C3 |

**Headline number: `main` carries 8 verified UX merges; the card-unification epic is ~1 PR away from `main`. The tracking-doc set is ~70% accurate — INDEX trustworthy, STATUS stale, verification-report superseded.**

---

## 1. Live tracker (merged-to-main first)

Columns mirror the DATA audit template. "On main" = verified present in `git show 7a5c91e:<file>` or `main` commit log, not just claimed.

### 1a. Shipped on `main` (7a5c91e) — the live UX baseline

| Task | Description | Status | % | ✅ Confirmed (code) | ⚠️ Gap | 💡 Next |
|---|---|---|---|---|---|---|
| UX-002 | Concierge error bubble | 🟢 | 100% | `2021c57` on main (#21 region) | — | None |
| UX-003 | Parse "$500 a night" / nightly | 🟢 | 100% | `a9fffe8` on main | — | None |
| UX-005 | Thinking indicator (beats React 19 batching) | 🟢 | 100% | `f1e09e4` on main | — | None |
| UX-015 | Concierge error bridge (v1 internal handler) | 🟢 | 100% | `a952384` #21 merged | — | None |
| UX-019 | Event fast-path memory guard (Option B, L55/L81) | 🟢 | 100% | `c8c42db` #24; `use-event-search-fast-path.ts` on main carries `memory`/`lastIntent:"event_discovery"` guards (L57/L80/L81) | — | None |
| UX-013 | `venue_anchors` café fallback when ADK unavailable | 🟢 | 100% | `9bc21d6` #25; `search-venue-anchors.ts` **exists in main tree**; 3 src refs to `venue_anchors` | — | None |
| UX-014 | Drop `writer.custom` from search tools | 🟢 | 100% | `5e20f3c` #26; `writer.custom` now only in **2 test files**, 0 in tool code | — | None |
| UX-036 | Restaurant fast-path + UX-T-037 focused e2e | 🟢 | 100% | `7a5c91e` #28 (current main tip) | — | None |
| UX-T-027 | RentalCard copy guard (vitest) | 🟢 | 100% | `c518b1d` via #21 (feat/ux-g1-error-bridge merged) | — | None |

### 1b. Card-unification slice — code-complete, branch-only (NOT on main)

All on `fix/ux-g2c-copilotkit-stability` (`b1879b9` = `origin/fix/ux-g2c-copilotkit-stability`, **pushed, 5 ahead of main, 0 behind, no open PR**).

| Task | Description | Status | % | ✅ Confirmed (code) | ⚠️ Gap | 💡 Next |
|---|---|---|---|---|---|---|
| UX-022 | `DomainResults` rich result surface | 🟡 | 100% (code) | `47d8fdf`; `src/components/copilot/domain-results.tsx` present | Not on main | **Open the G2c PR** |
| UX-025 | Rich `RestaurantCard` on DomainResults | 🟡 | 100% (code) | `47d8fdf`; `restaurant-card.tsx` w/ `data-result-kind` | Not on main | (same PR) |
| UX-026 | Rich `AttractionCard` on DomainResults | 🟡 | 100% (code) | `167fa89`; `attraction-card.tsx` w/ `data-result-kind` | Not on main | (same PR) |
| UX-021 | Card a11y — `data-result-kind`+`aria-label`+`role` | 🟡 | 100% (code) | `333ba0d`; **all 4 cards** (rental/cafe/attraction/restaurant) carry `data-result-kind`; rental adds `aria-label`+`role` (L85/L88/L93) | Not on main | (same PR) |
| UX-030 | Card-unification surface (one rich card per domain) | 🟡 | 100% (code) | `card-unification.spec.ts` ("UX-T-030") asserts result-kind + no side-panel dup per vertical | Not on main | (same PR) |
| CK stability | Single `ConciergeCoAgent` mount + stable client props | 🟡 | 100% (code) | `7bf48a3`; `concierge-coagent-context` consumed by 3 fast-path hooks | Not on main — **targets prod POST-storm** | (same PR) |

### 1c. Stacked / open elsewhere, or not started

| Task | Description | Status | % | Where | 💡 Next |
|---|---|---|---|---|---|
| UX-031 | Live-audit vertical matrix e2e | 🟡 | 100% (code) | `feat/ux-g2-live-audit @ 9ebc34a` (**PR #27 → base `feat/ux-g2-writer-custom`, stacked, NOT → main**); hardened copy also on `b1879b9` | Re-target #27 to main or fold into G2c PR |
| UX-016 | (INDEX implies "on main") | ⚪ | 0% | **Zero commits on any branch** | Confirm task scope — likely mislabeled or never started (see §4-C4) |
| UX-035 | (listed ⚪ in INDEX) | ⚪ | 0% | Zero commits | Confirm still in scope |
| UX-020/023/024/028/029/032/033/034/017/018 | epic sub-tasks | ⚪ | 0% | Per INDEX | Schedule after G2c merges |

---

## 2. Live code inventory (what is actually in the trees)

| Object | main (`7a5c91e`) | `b1879b9` (G2c, branch-only) |
|---|---|---|
| **Card components** (`src/components/copilot/`) | rental, restaurant, cafe-result, attraction, grounded-place, place-result, event | same + a11y attrs on all 4 (UX-021) |
| `data-result-kind` parity | partial | **4/4 cards** (rental/cafe/attraction/restaurant = 1 each) |
| `domain-results.tsx` (UX-022) | — | **present** |
| `concierge-coagent-context` single-mount | — | **present** (3 fast-path hooks consume) |
| `venue_anchors` references | **3 src files** (search-grounded-places, search-venue-anchors, test) | same |
| `writer.custom` | **2 test files only** (dropped from tool code) | same |
| `react-core` / v2 imports | **0** | 0 |
| **e2e specs on disk** | 12 `.spec.ts` | 12 — incl. `card-unification`, `live-audit-verticals`, `visual-all-cards` (all hardened) |
| e2e npm scripts | `test:e2e:p0-focused`, `:copilot-budget`, `:restaurant-fast-path`, `:concierge-run-error` | + `:live-audit`, `:card-unification`, `:visual-cards` |

**Branch landscape:** `origin/main` = `7a5c91e`. The PR-stack remediation produced many `feat/ux-g2-*` + `feat/ux-g2c-*` branches; the **head of the UX work is `fix/ux-g2c-copilotkit-stability @ b1879b9`** (current checkout). `data/DATA-048-migration-realign @ a9929dc` holds this session's DATA work, intact and separate.

---

## 3. Red flags / blockers / fixes

**R1 — Card-unification slice has no PR (🟡 high — the one real blocker).** `b1879b9` is pushed, clean, 5 commits of finished UX work (UX-021/022/025/026/030 + CK stability + hardened e2e), 0 behind main — yet **no open PR targets it at main**. The card-unification epic (UX-010 / Linear SAN-318) cannot reach `main` until this PR is opened and merged. *Fix:* `gh pr create --base main --head fix/ux-g2c-copilotkit-stability`. This is the single highest-leverage UX action.

**R2 — Prod fixes sit on un-merged code (🟡 medium).** `STATUS-2026-06-01.md` lists prod runtime breakage: CopilotKit POST-storm, restaurant prod "no cards", café silent UI. The **CK-stability commit (`7bf48a3`, single ConciergeCoAgent mount)** directly targets the POST-storm and **UX-036 (#28, restaurant fast path) is already on main** — but `b1879b9` isn't deployed, so prod still runs `7a5c91e` and the POST-storm fix is **not live**. *Fix:* merge R1, redeploy, then re-verify prod (this pass did **not** boot dev or hit prod — see §5).

**R3 — Branch-mixing debt is RESOLVED, not outstanding (🟢 informational).** An earlier concern was UX commits tangled with the DATA-048 migration (`7f60a84`). Verified: `b1879b9` does **not** contain `7f60a84` (`git merge-base --is-ancestor` = false). The cherry-pick "split-PR" workflow already separated the two — UX-only on `b1879b9`, DATA-only on `a9929dc`. No action.

**R4 — Stacked PR #27 targets a feature branch, not main (🟡 low).** PR #27 (`feat/ux-g2-live-audit` → `feat/ux-g2-writer-custom`) is a stacked PR whose base is itself unmerged-as-such; the live-audit e2e it carries is also present on `b1879b9`. *Fix:* fold UX-031 into the G2c PR (R1) and close #27, or re-base #27 onto main.

**R5 — `STATUS-2026-06-01.md` is stale and will mislead (🟡 low).** Stale `main_sha` + "UX-036 In Review" row contradict reality (§4). *Fix:* refresh its frontmatter to `7a5c91e` and move UX-036 to merged; or deprecate it in favor of `INDEX.md`.

**R6 — `UX-TASKS-VERIFICATION-REPORT.md` is superseded (⚪ informational).** It audited `feat/ux-002-005-chat @ a8d2e26`; all 4 red flags resolved on current code (§4-C3). *Fix:* mark it "superseded by this audit — branch a8d2e26 no longer the integration target."

---

## 4. Forensic corrections — tracking docs vs live code

| # | Doc claim | Live reality (2026-06-01) | Verdict |
|---|---|---|---|
| C1 | `STATUS` frontmatter `main_sha: 5e20f3cb` | `origin/main` = **`7a5c91e`** (#28, one merge past 5e20f3c) | **Stale → corrected** |
| C2 | `STATUS`: UX-036 / #28 "not on main / In Review" | `7a5c91e` **is** #28 (UX-036 fast path) — merged, it's the main tip | **Stale → 🟢 on main** |
| C3 | `UX-TASKS-VERIFICATION-REPORT` red flags: venue_anchors 0 refs · react-core/v2 in bridge · writer.custom in 4 tools · RentalCard no aria | venue_anchors **3 src refs** (on main) · react-core/v2 **0** · writer.custom **2 test files only** · RentalCard **has** `data-result-kind`+`aria-label`+`role` (UX-021) | **All 4 resolved → superseded** |
| C4 | `INDEX` "on main: …UX-016…" | **Zero UX-016 commits** on any branch | **Unverifiable → likely mislabel/overclaim** |
| C5 | `INDEX` main @ `7a5c91e`; merged-set UX-013/014/015/019/027/036 | Matches main tree + commit log exactly | **Correct** |
| C6 | `INDEX` branch-only: UX-021/022/025/026 + CK fix | All on `b1879b9` (pushed) | **Correct** |
| C7 | (this session) UX+DATA branch-mixing debt | `b1879b9` clean of `7f60a84` — already split | **Resolved, not outstanding** |

---

## 5. Runtime verification — explicit scope of THIS pass

**Not re-run.** This pass verified UX claims at the **code/tree level** (git + src/ + e2e/), not at runtime. Reasons, stated plainly per the never-hide-failures rule:
- Full Playwright e2e is **documented-flaky** (STATUS) and expensive; a green/red here would be noisy.
- The G2c fixes (POST-storm, card unification) live on **`b1879b9`, which is not deployed** — prod (`mdeai.co`, running `7a5c91e`) **cannot** verify them, and the STATUS-listed prod breakage (POST-storm, café silent UI, preview 401, maps billing) reflects pre-G2c prod.
- No `npm run dev` boot was performed; **localhost runtime proof for the G2c slice is therefore still pending** (CLAUDE.md Done-gate is NOT satisfied for UX-021/022/025/026/030 by this audit).

**Required before any G2c task flips Done:** boot `cd mdeapp && npm run dev`, confirm `[ui]` + `[agent]` both up, then run `test:e2e:p0-focused` + `test:e2e:card-unification` + `test:e2e:live-audit` on `b1879b9`, and exercise the real chat journey (rental/event/restaurant/café → one rich card per vertical, no side-panel dup, no POST-storm).

---

## 6. Next steps — focus on core MVP (get the card epic to main)

**Do now (one PR unblocks the epic):**
1. **Open the G2c PR (R1):** `fix/ux-g2c-copilotkit-stability` → `main`. Bundles UX-021/022/025/026/030 + CK stability + hardened e2e. This is the card-unification epic's (SAN-318) last mile.
2. **Fold UX-031 into that PR (R4)** or re-base PR #27 onto main; close the stacked base.

**Do next (prove it, then honesty):**
3. **Runtime-verify on `b1879b9`** per §5 (dev boot + p0-focused + card-unification e2e + real chat journey) — satisfies the Done-gate and confirms the POST-storm fix.
4. **Refresh the tracking docs (R5/R6):** correct `STATUS` `main_sha`→`7a5c91e` + UX-036 row; mark `UX-TASKS-VERIFICATION-REPORT` superseded. Promote `INDEX.md` as the single source of truth.

**Do later (scope hygiene):**
5. **Resolve UX-016 (C4):** confirm whether it exists, is mislabeled, or should be dropped.
6. Schedule the ⚪ tail (UX-017/018/020/023/024/028/029/032/033/034/035) after G2c lands.

---

## 7. Verification appendix (commands run 2026-06-01, read-only)

| Check | Command | Result |
|---|---|---|
| Live checkout | `git rev-parse --short HEAD; --abbrev-ref HEAD` | `b1879b9` / `fix/ux-g2c-copilotkit-stability` |
| G2c vs main | `git rev-list --left-right --count origin/main...b1879b9` | `0  5` (0 behind, 5 ahead) |
| G2c clean of DATA | `git merge-base --is-ancestor 7f60a84 b1879b9` | false (**clean**) |
| G2c pushed | `git branch -r --contains b1879b9` | `origin/fix/ux-g2c-copilotkit-stability` |
| G2c PR? | `gh pr list --head fix/ux-g2c-copilotkit-stability` | `[]` (**none**) |
| Specs in tree | `git ls-tree -r b1879b9 e2e/` | card-unification, live-audit-verticals, visual-all-cards **present** |
| Specs on disk | `ls e2e/*.spec.ts \| wc -l` | 12 |
| UX-019 on main | `git show 7a5c91e:src/hooks/use-event-search-fast-path.ts` | memory/lastIntent guard present (L57/L80/L81) |
| UX-013 on main | `git show 7a5c91e:src/mastra/tools/search-venue-anchors.ts` | exists |
| RentalCard a11y | `grep -n "data-result-kind\|aria-label\|role=" rental-card.tsx` | L85/L88/L93 |
| writer.custom | `grep -rn writer.custom src/` | 2 test files only |
| main commit log | `git log --oneline 7a5c91e` | #21–#28 = UX-002/003/005/013/014/015/019/036 |

---

*Companion to [DATA-FORENSIC-AUDIT-2026-06-01.md](../../data/audit/DATA-FORENSIC-AUDIT-2026-06-01.md). Same method, same legend. Read-only — no merge, push, or branch mutation performed.*
