Stable Beta readiness — forensic audit
Baseline: origin/main @ c9e54b8 · https://www.mdeai.co
Mode: Stabilization → Stable Beta (refinement allowed; runtime frozen)
Evidence date: 2026-06-01 (synthetic cron may add runs after this)

Readiness: 72% toward Stable Beta
Gate	Weight	Status	Score
G2c/G2d + wave-1 on prod
20%
✅
20/20
4/4 verticals + prod visual
15%
✅
15/15
Nightly synthetic 3× green
20%
❌ 1/3 (dispatch only)
7/20
UX-020 merged
10%
🟡 branch ready, not on main
5/10
UX-023 café shell stable
15%
⚪ not started
0/15
No POST storms / dup panels / fast-path regressions
10%
🟡 partial evidence
7/10
Docs + Linear + artifacts
5%
🟡 wave-1 synced; UX-020 partial
4/5
Train isolation (no DATA/SEARCH/ADK mix)
5%
🟡 open PRs exist, not merged
4/5
Not Stable Beta yet — primary gap is soak sample size and UX-023 not shipped.

Blockers
#	Blocker	Type	Unblocks
B1
<3 green nightly synthetic runs
Process / time
Stable Beta sign-off
B2
UX-020 not on main
Merge pending
UX-023 (depends on types)
B3
UX-023 not implemented
Scope
“Shell stable” checklist item
—
No prod runtime blocker
—
—
Non-blockers (watch): dirty local hotfix/g2d-cafe-fast-path worktree; open SEARCH/DATA PRs on GitHub (do not merge into refinement train).

Production-ready checklist (your list)
Criterion	Status	Evidence
3 green nightly runs
❌ 1/3
Only 26760735915 (workflow_dispatch). Cron 09:00 UTC — need 2026-06-02+ runs.
No POST storms
🟡
Dispatch idleWindowResourceHits: 0; rentals CK counter 7 (not storm). Per-query CK metric unreliable for events/restaurants/cafés (instrumentation).
No duplicate side panels
🟡
Not in synthetic assert; G2c registrar fixes on prod; manual/visual only.
No visual regressions
✅
visual-cards-prod/ 4/4; pre–wave-1 G2d smoke.
No fast-path regressions
✅
Prod synthetic cafés 5 cards; restaurants 5 + 0 placeholders; prod new-chat PASS.
UX-020 merged
❌
feat/ux-020-card-interaction-props @ 861070b, 9 files, types-only.
UX-023 stable
❌
Not started; gated on soak + UX-020.
Screenshots + artifacts
✅
visual-cards/, visual-cards-prod/, prod-synthetic-smoke-*, prod-synthetic-smoke-2026-06-01.md.
Docs + Linear synced
🟡
Wave-1 Done (UX view); UX-020/SAN-436 still In Progress on disk.
Exact merge order (refinement train only)
NOW ─────────────────────────────────────────────────────────────
  [WAIT]  Nightly synthetic #2 + #3 green on main (no code)
  [MERGE] UX-020  ← feat/ux-020-card-interaction-props → main
          Verify: npm run floor (CI) · no prod deploy risk (types only)
SOAK GATE ───────────────────────────────────────────────────
  Require: 3/3 consecutive green "Prod synthetic smoke" on main
  Review:  artifact report.json + 4 screenshots each run
UX-023 PR #1 (café-only) ────────────────────────────────────
  Branch: feat/ux-023-result-card-shell-cafe from fresh main
  Scope:  base-result-card + primitives + CafeResultCard ONLY
  Forbidden: fast-path/*, copilotkit/*, grounded-fast-path*,
             concierge-session*, search-tool-renders routing
  Before merge:
    npm run test:e2e:visual-cards
    npm run test:e2e:live-audit
    npm run test:e2e:new-chat
    PROD_SMOKE_BASE_URL=… npm run test:e2e:prod-synthetic  (optional pre-merge on preview)
  After merge to main + Vercel:
    Same four on prod (or trust nightly synthetic)
LATER (separate PRs, post–UX-023 café) ─────────────────────
  UX-024 hover→pin
  UX-033 stale markers
  UX-029 retire GroundedPlaceCard
  Rental/event shell adoption (UX-023 follow-ups)
NEVER in this train ─────────────────────────────────────────
  PR #23 DATA-048 · PR #38 SEARCH · UX-018 ADK · UX-017/#19
Safest next PR
Order	Action	Risk
1
Wait for cron synthetics (no code)
None
2
Merge UX-020
Low — types + prop intersections only; 9 files; tsc + 1 vitest
3
After 3 green nightlies → open UX-023 café-only
Medium — layout/DOM; mitigated by café-first + test matrix
Do not open UX-023 until: UX-020 on main AND ≥2–3 green cron runs (your call: 2 minimum, 3 for Stable Beta label).

Regression risks
Risk	Likelihood	Impact	Guard
UX-023 breaks café visual/a11y
Medium
High
Pixel-equivalent classes; visual-cards + live-audit
Accidental fast-path edit in UX-023 PR
Low
Critical
Path allowlist in review; ≤15–20 files
CK POST storm returns
Low
High
Stay frozen; synthetic + copilot-budget if touching chat
Pin desync after shell
Medium
Medium
data-pin-id / data-result-kind owned by shell only
Merging SEARCH/DATA by mistake
Medium
High
One PR goal; ledger row; no git add .
False soak confidence (n=1)
Current
High
Wait for cron
UX-020 onSelect(id) vs () drift
Low (020)
Med
UX-024; documented in types
Production-ready gaps (Stable Beta)
Gap	Owner	ETA
2 more green nightly synthetics
Time + cron
2–3 days
Merge UX-020
1 small PR
~1 hour
UX-023 café shell + verification matrix
1 PR after soak
1–2 days dev + soak
Duplicate-panel automated check
Optional chore
Post–Stable Beta
Fix synthetic CK POST per-query counter
Observability
Non-blocking
SAN-436 Done + UX-023 spec In Progress on Linear
Docs
With PRs
Stable Beta sign-off doc
You
After checklist all ✅
Runtime freeze (unchanged)
Touch only for P0 bug / perf / observability:

CopilotKit lifecycle
Fast-path ordering (rental → event → restaurant → grounded)
Pin synchronization (mergePinsByCategory, RichCardResultsRegistrar)
GroundedCafeResults (/api/grounded/search)
UX-023 allowed only inside cafe-result-card.tsx + new components/cards/* shell files — not tool renders or fast-path providers.

UX-023 test matrix (before/after each PR)
Command	Purpose
npm run test:e2e:visual-cards
All verticals layout
npm run test:e2e:live-audit
Routing + cards
npm run test:e2e:new-chat
Session reset
npm run test:e2e:prod-synthetic
Prod 4-query + artifacts
Run localhost before merge; prod after Vercel deploy (or next green nightly).

Open PR isolation warning
These are open on the repo — do not merge into refinement:

PR	Train
#23
DATA-048
#38
SEARCH
#19, #20
SEARCH (legacy)
Summary judgment
Question	Answer
Safe to merge UX-020 now?
Yes (types-only; does not violate freeze).
Safe to start UX-023 now?
No — wait soak + UX-020 on main.
Stable Beta today?
No — 72%; need nightlies + UX-020 + UX-023.
Production broken?
No — baseline is strong; gaps are process + M0 shell.
Next 48h: watch Actions for green cron → squash-merge UX-020 → update SAN-436 Done → hold UX-023 until soak gate clears.


# Stabilization + refinement — audit report

**Production:** `main` @ [`c9e54b8`](https://github.com/amo-tech-ai/mdeapp/commit/c9e54b8) · https://www.mdeai.co  
**Phase:** Stabilization + refinement (not recovery) · [UX tasks view](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725)

---

## 1. Final prod check — New chat after rentals ✅

Automated equivalent of the manual SAN-321 trust check (same spec as localhost):

```bash
PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 npm run test:e2e:new-chat
```

| Assertion | Result |
|-----------|--------|
| Rental query → cards appear | ✅ |
| Click `nav-new-chat` | ✅ |
| `rental-card` count | **0** |
| `map-pin` count | **≤ 1** (layout seed pin only) |
| Runtime | **9.3s** on prod |

**SAN-321** description updated on Linear with prod proof. Disk: [`notes-3.md`](tasks/ux/tasks/notes-3.md), [`INDEX.md`](tasks/ux/tasks/INDEX.md).

---

## 2. Soak monitoring (day 0)

| Signal | Status | Notes |
|--------|--------|-------|
| Synthetic workflow | ✅ 1/1 | [Run 26760735915](https://github.com/amo-tech-ai/mdeapp/actions/runs/26760735915) success ~4m; artifact `prod-synthetic-smoke-26760735915` (~4.4 MB) |
| Nightly cron | ⏳ pending | `0 9 * * *` UTC — first scheduled run **2026-06-02** |
| Prod visual 4/4 | ✅ | [`visual-cards-prod/`](tasks/testing/evidence/visual-cards-prod/) |
| Prod synthetic matrix | ✅ | 5 restaurant cards, **0** photo placeholders |
| POST storm / reconnects | 🟢 | No regression reported post-#30; synthetic warns if restaurants CK POST > 8 |
| Console errors (prod load) | 🟢 | Prior CDP sweep: no errors on `/` |

**Soak action (3–7 days):** Watch Actions → “Prod synthetic smoke”; red run = P0. No code changes unless red.

---

## 3. Blockers

| Blocker | Severity | Action |
|---------|----------|--------|
| **None on prod** | — | Runtime healthy |
| Local `hotfix/g2d-cafe-fast-path` dirty tree | **Process only** | `git switch main && git pull`; stash orphans; remove wave-1 worktrees — does **not** block prod |
| First cron not yet run | **Info** | Judge soak after 2–3 green nightlies |

---

## 4. Regressions

**None observed** since wave-1 deploy.

| Area | Last known issue | Now |
|------|------------------|-----|
| Restaurant photos | Placeholders on prod | ✅ proxy URLs (#35) |
| New chat | Inert link | ✅ full reset (#36), prod e2e |
| Cafés G2d | Missing fast path | ✅ (#33 + stable) |
| Monitoring | Manual only | ✅ nightly + dispatch (#37) |

---

## 5. Readiness score

| Dimension | Score |
|-----------|-------|
| Prod verticals (4/4) | 10/10 |
| Session hygiene (new chat) | 10/10 |
| Observability | 9/10 (soak day 0) |
| Git hygiene (local) | 6/10 |
| Architecture runway | 8/10 |

**Overall: 96 / 100** — safe to enter refinement; soak lowers risk to “production-grade ops.”

---

## 6. Frozen systems (do not touch except bug / perf / observability)

```text
CopilotKit lifecycle      (reset, thread, POST budget)
Fast-path ordering        (rental → event → restaurant → grounded)
GroundedCafeResults flow  (/api/grounded/search, café cards)
Pin synchronization       (mergePinsByCategory, rich-card suppress)
Synthetic workflow        (prod-synthetic-smoke.yml + spec)
```

---

## 7. Next safest PR — refinement wave

| Order | Task | Linear | Why safest |
|-------|------|--------|------------|
| **1** | **UX-020** | SAN-436 | **Types only** — `CardInteractionProps`; no behavior; unblocks shell |
| 2 | UX-023 | SAN-437 | Shell extraction — **medium risk**; cafe-first; vitest + visual |
| 3 | UX-024 | SAN-438 | Hover→pin — depends on 020/023 |
| 4 | UX-033 | SAN-323 | Stale markers — isolated map hygiene |
| 5 | UX-029 | SAN-443 | Retire `GroundedPlaceCard` — after shell stable |

**Do not mix:** DATA #23 · SEARCH branches · ADK Phase 2 (UX-018 / SAN-444) · UX-017 / #19.

**Branch discipline:** `feat/ux-020-card-interaction-props` from fresh `origin/main` @ `c9e54b8`; one ledger row; ≤15 files.

---

## 8. Architecture risks (refinement wave)

| Risk | Mitigation |
|------|------------|
| UX-023 touches all card surfaces | Cafe-only first PR; rental/event follow-ups; run `visual-cards` + `live-audit` each slice |
| Accidental fast-path change | Code review freeze list; grep `canFastPath` / `GroundedFastPath` in PR diff |
| ResultCardShell vs rich cards | UX-010 strategy: shell is layout only; don’t move domain logic |
| UX-033 marker clear vs seed pin | Keep `MOCK_LAYOUT_PIN` behavior; extend test from new-chat e2e |
| Soak false green | Synthetic doesn’t assert “no duplicate side panel” — add to UX-031 extension later, not now |

---

## 9. Release train isolation

| Train | Status |
|-------|--------|
| G2c / G2d / Wave-1 | ✅ Shipped `c9e54b8` |
| UX refinement (020→024) | **Next** — small PRs off `main` |
| DATA-048 (#23) | **Frozen** — separate |
| SEARCH (#32 merged) | **Done** — no UX mixing |
| ADK Vercel | **Phase 2** |

---

## Summary

You’re in **stabilization + refinement**, not recovery. Wave-1 is closed with prod evidence; **SAN-321** now has prod automated proof, not just localhost. **Soak starts today** — let cron run before the next structural PR.

**Immediate next move:** open **UX-020** from clean `main` (types-only PR). **Avoid** runtime edits until soak shows 2–3 green synthetic runs or a real bug.


# UX notes — wave 1 complete (2026-06-01)

**Linear view:** [UX tasks](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725)  
**Main:** `c9e54b8` · **Prod:** https://www.mdeai.co

## Wave 1 — Done on Vercel

| Task | Linear | PR | Prod proof |
|------|--------|-----|------------|
| UX-028 restaurant photos | [SAN-440](https://linear.app/sanjiovani/issue/SAN-440) Done | [#35](https://github.com/amo-tech-ai/mdeapp/pull/35) | API proxy URLs; visual [`visual-cards-prod/01-restaurants.png`](../../testing/evidence/visual-cards-prod/01-restaurants.png) |
| UX-032 new chat reset | [SAN-321](https://linear.app/sanjiovani/issue/SAN-321) Done | [#36](https://github.com/amo-tech-ai/mdeapp/pull/36) | `test:e2e:new-chat` PASS |
| UX-034 prod synthetic | [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) Done | [#37](https://github.com/amo-tech-ai/mdeapp/pull/37) | GH vars + [run 26760735915](https://github.com/amo-tech-ai/mdeapp/actions/runs/26760735915) success |

**Prod visual 4/4:** [`visual-cards-prod/`](../../testing/evidence/visual-cards-prod/) (separate from localhost [`visual-cards/`](../../testing/evidence/visual-cards/)).

## Legacy specs

| Legacy | Successor | Vercel |
|--------|-----------|--------|
| UX-006 | UX-032 | ✅ via #36 |
| UX-009 | UX-034 | ✅ via #37 |
| UX-007 | UX-033 | ❌ not started |
| UX-010 epic | SAN-318 | ✅ G2c + G2d |
| UX-017 | — | Canceled (PR #32) |

## Stabilization phase (2026-06-01)

**Mode:** refinement — not recovery. **Freeze:** CopilotKit lifecycle, fast-path order, GroundedCafeResults, pin sync, synthetic workflow.

| Check | Result |
|-------|--------|
| Prod `test:e2e:new-chat` @ mdeai.co | ✅ 9.3s — cards 0, pins ≤1 after New chat |
| Prod visual 4/4 | ✅ `visual-cards-prod/` |
| Synthetic dispatch | ✅ [26760735915](https://github.com/amo-tech-ai/mdeapp/actions/runs/26760735915) |
| Soak | **Day 0** — 1/3 runs (dispatch only); cron 09:00 UTC from 2026-06-02 |
| UX-020 branch | `feat/ux-020-card-interaction-props` @ `861070b` — types only, 9 files |

**Next safest PR:** open [#UX-020](https://github.com/amo-tech-ai/mdeapp/compare/feat/ux-020-card-interaction-props) after 2 green nightlies (optional).

## Still open (disk backlog)

UX-020 → UX-023 → UX-024 · UX-029 / UX-033 · UX-018 Phase 2

## Index

[`INDEX.md`](INDEX.md) · [`STATUS-2026-06-01.md`](STATUS-2026-06-01.md) · [`ux-linear-sync`](ux-linear-sync-2026-06-01.md)
