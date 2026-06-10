---
title: G2c PR readiness — fix/ux-g2c-copilotkit-stability
date: 2026-06-01
branch: fix/ux-g2c-copilotkit-stability @ b1879b9
main: 7a5c91e
verdict: merge-ready (review + merge #29 then #30; do not merge yet per gate)
---

# G2c PR readiness report

## Correction vs prior audit

**PRs already exist** (orchestration blocker is *review/merge*, not *missing PR*):

| PR | Base → Head | URL |
|----|-------------|-----|
| **#29** | `main` → `feat/ux-g2c-cards` | https://github.com/amo-tech-ai/mdeapp/pull/29 |
| **#30** | `feat/ux-g2c-cards` → `fix/ux-g2c-copilotkit-stability` | https://github.com/amo-tech-ai/mdeapp/pull/30 |

**Single branch tip** `fix/ux-g2c-copilotkit-stability` contains all G2c work (5 commits, 0 behind `main`).

Alternative: close #29/#30 and open one PR `fix/ux-g2c-copilotkit-stability` → `main` (same diff as merging both).

## Commits (5 ahead of main)

| SHA | Subject | UX |
|-----|---------|-----|
| `47d8fdf` | DomainResults + RestaurantCard | UX-022, UX-025 |
| `167fa89` | AttractionCard on DomainResults | UX-026 |
| `7bf48a3` | Stable CopilotKit props + ConciergeCoAgent | CK-P0-07 |
| `333ba0d` | Card a11y + e2e specs | UX-021, UX-030, UX-031 |
| `b1879b9` | Harden card-unification + live-audit e2e | UX-030, UX-031 |

## UX tasks covered

| ID | In branch | On main |
|----|-----------|---------|
| UX-021 | ✅ | ⏳ |
| UX-022 | ✅ | ⏳ |
| UX-025 | ✅ | ⏳ |
| UX-026 | ✅ | ⏳ |
| UX-030 | ✅ | ⏳ |
| UX-031 | ✅ | ⏳ |
| CK POST fix | ✅ | ⏳ |

## Branch cleanliness

| Check | Result |
|-------|--------|
| DATA-048 migrations in diff | **None** |
| `supabase/migrations/*` changed | **None** |
| DATA commit in `main..HEAD` | **None** |
| Files changed | 32 (+4 e2e, +card/copilotkit src) |

## Runtime validation (2026-06-01, clean dev)

Prereq: `rm -rf .next && npm run dev` (both `[ui]` + `[agent]` ready).

| Suite | Result | Notes |
|-------|--------|-------|
| `test:e2e:p0-focused` | **3/3 PASS** | Idle POST budget ≤10 (POST-storm fix verified) |
| `test:e2e:card-unification` | **4/4 PASS** | rental, event, restaurant, café |
| `test:e2e:live-audit` | **4/4 PASS** | 4-query matrix incl. B-09 + café fallback |
| `npm test` (vitest) | **381 PASS** | 92 files |

**merge-ready ≠ production-proven** — G2d prod smoke still required after deploy.

## Runtime risks

| Risk | Mitigation |
|------|------------|
| Stale dev / ChunkLoadError | Clean `.next` + restart before e2e |
| Parallel Playwright suites | Run focused scripts **sequentially** |
| `npm run floor` typecheck | Local `supabase/` tree may fail typecheck; use lint + vitest + build for PR gate |
| Prod POST storm | Re-verify on mdeai.co after G2d deploy |
| Stacked PR #30 | Merge **#29 first**, then #30 (or squash single PR to main) |

## Deployment notes

- No env var changes in G2c slice.
- CopilotKit 1.55.2 only; no Mastra model changes in this diff.
- After merge: Vercel auto-deploy → run G2d 4-query prod smoke (UX-035).

## PR copy (if single PR to main)

**Title:** `feat(ux): G2c card unification + CopilotKit stability`

**Body bullets:**

- DomainResults + rich restaurant/attraction cards (UX-022/025/026)
- Card a11y parity (UX-021)
- CopilotKit stable client props + single CoAgent mount (POST-storm fix)
- e2e: `p0-focused`, `card-unification`, `live-audit` (11/11 PASS localhost 2026-06-01)
- Excludes DATA-048 migrations

## Merge readiness verdict

| Gate | Status |
|------|--------|
| Code complete | ✅ |
| No DATA contamination | ✅ |
| Localhost e2e | ✅ 11/11 |
| PR opened | ✅ #29 + #30 |
| Human review | ⏳ |
| Prod smoke (G2d) | ⏳ after deploy |
| **Merge now?** | **No** — review first; then merge #29 → #30 (or one combined PR) |
