---
title: Progress Task Tracker — commits & worktrees
date: 2026-05-28
repo: /home/sk/mdeai/mdeapp
main_tip: e8d2a60
prod: https://www.mdeai.co/
ledger: ./COMMIT-LEDGER.md
Forensic: [`may-27/AUDIT-2026-05-28-remaining-commits.md`](./may-27/AUDIT-2026-05-28-remaining-commits.md) · Open tasks: [`may-27/tasks/INDEX.md`](./may-27/tasks/INDEX.md)
verification: ./may-27/verification-report-2026-05-28.md
skills: mde-worktree-pr-flow, task-verifier, testing
---

# Progress Task Tracker — commits & worktrees only

> Scope: **`mdeapp/` git commits**, **PR merge stack**, **worktrees/branches**, and **uncommitted WIP** from the May 27 breakup.  
> Not in scope: MVP persona gates (EVP-001), venues/docs bulk, Linear — see [`../MVP-REQUIRED.md`](../MVP-REQUIRED.md).

**Verified:** 2026-05-28 · `git rev-parse HEAD` = `e8d2a60` · `main` = `origin/main`

---

## Executive verdict

| Gate | Dot | % | Proof |
|------|:---:|:---:|-------|
| **May 27 ledger (C-000→C-006 + Input + PR #1)** | 🟢 | **100%** | SHAs on `main`; [`COMMIT-LEDGER.md`](./COMMIT-LEDGER.md) |
| **Post-ledger fixes (PR #2–#7)** | 🟢 | **100%** | Merged `a5c3e54`…`f37291d` |
| **May 28 breakup (C-008→C-010 + #11–#12)** | 🟢 | **100%** | PR #8–#12 on `main` @ `e8d2a60` |
| **Forensic file set on `main` (55 paths)** | 🟡 | **80%** | **44/55** paths exist; **11** missing (all C-012 + 1 test) |
| **Commit program (17 slices)** | 🟡 | **82%** | **14** shipped · **1** partial · **2** not started |
| **`npm run floor` on clean `main`** | 🟢 | **100%** | **298/298** tests, lint, build, audit (2026-05-28) |
| **`npm run floor` with untracked `e2e/prod/`** | 🟢 | **100%** | Lint fixed (`pinsBefore` removed); commit as C-010d |
| **Prod rental fast-path** | 🟢 | **100%** | `POST /api/rentals/search` → **200** @ www.mdeai.co |
| **Worktrees** | 🟢 | **100%** | **1** active worktree (no stray second tree) |
| **Andrés G1 evidence branch** | ⚪ | **0%** | `proof/andres-stripe-paid` exists; **behind** `main`; no merge |

**Bottom line:** All **planned code commits through PR #12 are on `main`.** Remaining = **(optional) C-010d** → **C-012** → **C-013** (strict order; **not parallel**). Floor **green** with prod e2e tracked (298 tests, 2026-05-28 v2).

**Audit v2:** [`may-27/AUDIT-2026-05-28-remaining-commits.md`](./may-27/AUDIT-2026-05-28-remaining-commits.md) — **94/100**

---

## Overall completion (commits only)

| Measure | Committed | Remaining | % complete |
|---------|----------:|----------:|-----------:|
| **Ledger rows C-000→C-006 + Input** | 10 / 10 | 0 | **100%** |
| **May 28 slices C-008…C-010c** | 5 / 5 | 0 | **100%** |
| **Pending slices C-010d, C-012, C-013** | 0 / 3 | 3 | **0%** (C-013 hooks on `main` ≈ **35%** of slice only) |
| **Weighted commit program** | 14.35 / 17 | 2.65 | **~84%** |
| **Forensic `mdeapp` paths (audit §1)** | 44 / 55 | 11 | **80%** |
| **WIP snapshot (`drafts/wip-pr4-off-src/`)** | 0 / 15 in git | 15 files | **0%** committed · **~83%** ready off-tree |

---

## Worktrees & branches

| Item | Dot | % | Status | Action |
|------|:---:|:---:|--------|--------|
| Primary worktree `mdeapp/` @ `main` | 🟢 | 100% | `e8d2a60` = `origin/main` | Default ship surface |
| Extra git worktrees | 🟢 | 100% | **None** (only one line in `git worktree list`) | — |
| `ship/may27-maps-events` | 🟢 | 100% | Merged (PR #1) | Safe to delete local |
| `fix/c008-*`, `fix/rich-card-*`, `fix/rentals-*` | 🟢 | 100% | Merged (PR #8–#12) | Safe to delete local |
| `proof/andres-stripe-paid` | ⚪ | 0% | **Behind `main`** (~40 files); no unique ship | Rebase or delete after G1 proof |
| `pr-3-audit` | ⚪ | — | Local only | Audit scratch — do not ship |
| Untracked `e2e/prod/pr12-pin-clear-prod-gate.spec.ts` | 🟡 | 95% | On disk, lint-clean, prod skip | Commit as **C-010d** (optional test PR) |

---

## Per-slice tracker (commit ledger + May 28 extension)

| ID | Dot | % | On `main`? | PR / SHA | Verification | Missing / attention |
|----|:---:|:---:|:----------:|----------|--------------|---------------------|
| **C-000** | 🟢 | 100 | Yes | `f993b81` | In merge #1 | — |
| **C-001** | 🟢 | 100 | Yes | `fec2a8f` | Maps pins/clustering on prod | — |
| **C-002** | 🟢 | 100 | Yes | `ef8c540` | Places + photo proxy | — |
| **C-003** | 🟢 | 100 | Yes | `7b5212b` | ADK grounding + router | — |
| **C-004** | 🟢 | 100 | Yes | `fa8be0c` | PR #4; stale citation fix `e10cec9` | — |
| **C-005** | 🟢 | 100 | Yes | `7f64f3e` | Event fast-path (pre-panel) | — |
| **C-005b** | 🟢 | 100 | Yes | `d7a57f7` | Checkout in chat sheet | — |
| **C-006** | 🟢 | 100 | Yes | `768ee3b` | Vercel maps deps | — |
| **Input fix** | 🟢 | 100 | Yes | `cf5df05` | No invalid CK `Input` import | — |
| **PR #2–#3** | 🟢 | 100 | Yes | `a5c3e54`, `2a83425` | Webpack dev + LibSQL | `MASTRA_DEV_LIBSQL=1` in `.env.local` |
| **PR #5–#7** | 🟢 | 100 | Yes | `4e50f67`…`f37291d` | Event clarify, dedupe, classifier | — |
| **C-008** | 🟢 | 100 | Yes | `85c4f1d` | PR #8 | `copilotkit-client-props.ts` present |
| **C-009** | 🟢 | 100 | Yes | `c44f766` | PR #9 | `rich-card-results.ts` + provider wired |
| **C-010** | 🟢 | 100 | Yes | `7b3d58e` | PR #10 | `POST /api/rentals/search` prod **200** |
| **C-010b** | 🟢 | 100 | Yes | `1be547f` | PR #11 | CodeRabbit C1–C6 (rentals) |
| **C-010c** | 🟢 | 100 | Yes | `e8d2a60` | PR #12 | Empty results clear rental pins |
| **C-010d** | 🟡 | 95 | **No** | — | Lint fixed; prod skip; optional | [task spec](./may-27/tasks/C-010d-prod-pin-clear-e2e.md) |
| **C-011** | 🟢 | 100 | Yes | (in #10) | Unit + SCREEN-005 | Bundled with C-010 |
| **C-012** | ⚪ | 0 | **No** | — | 11/11 café paths **missing** on `main` | Restore from WIP → **next product PR** |
| **C-013** | 🟡 | 35 | Partial | (hooks only) | **After C-012 merge + rebase** | No `event-fast-path-panel.tsx` on `main` |
| **Andrés G1 ops** | 🟡 | 80 | N/A | — | Smokes pass | Manual live `paid` row — **not a code commit** |

---

## PR merge stack (complete)

| PR | Dot | Slice | Merge SHA | Status |
|----|:---:|-------|-----------|--------|
| [#1](https://github.com/amo-tech-ai/mdeapp/pull/1) | 🟢 | C-000…C-006 | `7ee9431` | MERGED |
| [#2](https://github.com/amo-tech-ai/mdeapp/pull/2) | 🟢 | dev webpack | `a5c3e54` | MERGED |
| [#3](https://github.com/amo-tech-ai/mdeapp/pull/3) | 🟢 | Mastra LibSQL | `2a83425` | MERGED |
| [#4](https://github.com/amo-tech-ai/mdeapp/pull/4) | 🟢 | C-004 | `fa8be0c` | MERGED |
| [#5](https://github.com/amo-tech-ai/mdeapp/pull/5) | 🟢 | event clarify | `4e50f67` | MERGED |
| [#6](https://github.com/amo-tech-ai/mdeapp/pull/6) | 🟢 | event dedupe | `57a36ab` | MERGED |
| [#7](https://github.com/amo-tech-ai/mdeapp/pull/7) | 🟢 | classifier | `f37291d` | MERGED |
| [#8](https://github.com/amo-tech-ai/mdeapp/pull/8) | 🟢 | C-008 | `85c4f1d` | MERGED |
| [#9](https://github.com/amo-tech-ai/mdeapp/pull/9) | 🟢 | C-009 | `c44f766` | MERGED |
| [#10](https://github.com/amo-tech-ai/mdeapp/pull/10) | 🟢 | C-010 | `7b3d58e` | MERGED |
| [#11](https://github.com/amo-tech-ai/mdeapp/pull/11) | 🟢 | C-010b | `1be547f` | MERGED |
| [#12](https://github.com/amo-tech-ai/mdeapp/pull/12) | 🟢 | C-010c | `e8d2a60` | MERGED |
| **Open PRs** | ⚪ | C-010d (opt) → C-012 → C-013 | — | **Not opened** |

**Open commit-tracker PRs:** none.

---

## Validation proof (2026-05-28)

| Check | Command / signal | Result | Dot |
|-------|------------------|--------|:---:|
| HEAD sync | `git status -sb` | `## main...origin/main` clean | 🟢 |
| Floor (no `e2e/prod`) | `npm run floor` | PASS · **298** tests | 🟢 |
| Floor (with untracked prod spec) | `npm run floor` | **PASS** · **298** tests | 🟢 |
| Prod homepage | `curl -o /dev/null -w %{http_code} https://www.mdeai.co/` | **200** | 🟢 |
| Prod rentals API | `POST …/api/rentals/search` | **200** JSON | 🟢 |
| C-012 café API | `places/detail` on prod | **404** (route not deployed) | ⚪ |
| WIP integrity | `ls drafts/wip-pr4-off-src` | **15** files | 🟡 |

---

## Files still needing commit (by bucket)

### C-010d — optional (1 file)

| Path | State | Fix before commit |
|------|-------|-------------------|
| `e2e/prod/pr12-pin-clear-prod-gate.spec.ts` | untracked | Lint clean; skips unless `SMOKE_BASE_URL=https://www.mdeai.co` |

### C-012 — café / Places (11 paths missing on `main`; 15 in WIP)

| Path | On `main` | In WIP |
|------|:---------:|:------:|
| `src/app/api/places/detail/route.ts` | ⚪ | 🟢 |
| `src/components/cafe/cafe-detail-panel.tsx` | ⚪ | 🟢 |
| `src/components/copilot/cafe-result-card.tsx` | ⚪ | 🟢 |
| `src/components/copilot/__tests__/cafe-result-card.test.tsx` | ⚪ | 🟢 |
| `src/components/sheets/cafe-booking-sheet.tsx` | ⚪ | 🟢 |
| `src/hooks/use-place-details.ts` | ⚪ | 🟢 |
| `src/lib/cafe-ask-prompts.ts` | ⚪ | 🟢 |
| `src/lib/place-details.ts` | ⚪ | 🟢 |
| `src/lib/place-details.test.ts` | ⚪ | 🟢 |
| `e2e/screens/SCREEN-021-cafe-listings.spec.ts` | ⚪ | 🟢 |
| `src/mastra/tools/__tests__/search-grounded-places-quality.test.ts` | ⚪ | 🟢 |

Also in WIP (integrate via `git add -p` on shared files): `places/photo/route.ts`, Mastra tweaks — see [forensic § PR4](./may-27/forensic-pr-breakup-2026-05-27.md).

### C-013 — events inline panel (2 core files off-tree)

| Path | On `main` | In WIP |
|------|:---------:|:------:|
| `src/components/chat/event-fast-path-panel.tsx` | ⚪ | 🟢 |
| `src/components/chat/event-fast-path-context.tsx` | ⚪ | 🟢 |

---

## Breaking / failing items

| Item | Dot | Impact | Fix |
|------|:---:|--------|-----|
| Untracked `e2e/prod/*.spec.ts` | 🟡 | 90% | Lint clean; floor passes | Commit C-010d or add to `.eslintignore` if skipping |
| C-012 not on `main` | ⚪ | SCREEN-021 blocked in prod | **Next product PR** from WIP |
| C-013 panel missing | 🟡 | Map list only; no inline `event-card` | **After C-012** merged + rebase |
| `proof/andres-stripe-paid` stale | ⚪ | Confusing branch for G1 | Rebase on `e8d2a60` or delete |

---

## Recommended next actions (commits only)

```text
1. (Optional) C-010d — commit prod e2e when approved     [1 file]
2. C-012 — branch feat/c012-cafe-places → WIP → floor → next product PR
3. C-013 — after C-012 on main → rebase → event panel PR
4. Delete merged local branches; single worktree on main
5. Andrés G1: manual Stripe proof (ops — not C-###)
```

```bash
cd /home/sk/mdeai/mdeapp
git checkout main && git pull    # expect e8d2a60
# floor only if e2e/prod removed or fixed:
npm run floor
```

---

## Rollback

| Scope | Action |
|-------|--------|
| Last rental fix | Revert PR #12 merge on `main` |
| Full May 28 stack | Revert #12 → #8 in reverse (heavy) |
| May 27 stack | Revert PR #1 `7ee9431` (very heavy) |

Prefer forward-fix PRs.

---

*Last verified: 2026-05-28 · Auditor: disk + `git` + `npm run floor` + prod `curl`*
