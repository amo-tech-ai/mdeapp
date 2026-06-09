# Audit — PR #80 (SAN-575) & PR #81 (SAN-574)

**Date:** 2026-06-05 (updated post-fix)  
**Repos:** [mdeapp PR #80](https://github.com/amo-tech-ai/mdeapp/pull/80) · ~~[mdeapp PR #81](https://github.com/amo-tech-ai/mdeapp/pull/81)~~ **CLOSED**

---

## Executive summary

| PR | Verdict | Status |
|----|---------|--------|
| **#81** (SAN-574) | **Closed — duplicate** | Closed 2026-06-05. SAN-574 already on `main` @ `b639226` (PR #79). |
| **#80** (SAN-575) | **Ready to merge** | Fix `75a1f83` pushed; **Floor ✅** · Vercel ✅ |

---

## Actions taken (2026-06-05)

### PR #81
- **Closed** via `gh pr close 81` with duplicate/stale comment.
- Do not merge or reopen.

### PR #80 fixes (`75a1f83`)
| Fix | File |
|-----|------|
| `pinId` on cover-media Vitest case | `src/components/copilot/__tests__/restaurant-card.test.tsx` |
| Default `composition="legacy"`; browse still passes `nova` | `src/components/copilot/restaurant-card.tsx` |
| Explicit `composition="legacy"` for chat | `src/components/copilot/domain-results.tsx` |
| `bodyAriaLabel` when `bodyRole="button"` | `src/components/copilot/restaurant-card.tsx` |
| Vitest for body aria-label | `src/components/copilot/__tests__/restaurant-card.test.tsx` |
| PR body: `Refs SAN-575` (not Closes — nightlife/cafés remain) | GitHub PR #80 description |

---

## Verification results (local, post-fix)

| Command | Result | Notes |
|---------|--------|-------|
| `npm test -- restaurant-card domain-results venue-card-shell --run` | **PASS** (13 tests) | Affected Vitest |
| `npm test -- --run` | **PASS** (531 tests) | Full suite |
| `npm run build` | **PASS** | |
| `npx eslint` (3 changed files) | **PASS** | |
| `npx playwright test` SCREEN-023 + san-575 visual | **PASS** (5 tests) | |
| `npm run typecheck` | **OOM locally** | 8GB heap still OOM — CI is authoritative |
| `npm run floor` (full) | **FAIL locally** | Lint scans `github/` untracked junk (144k false positives) |

### Evidence paths
```
tasks/testing/evidence/2026-06-05/san-575/
├── 375-restaurants.png
├── 768-restaurants.png
├── 1280-restaurants.png
└── RESULTS.md
```
Screenshots refreshed after Playwright pass (2026-06-05 ~19:09).

### CI status (PR #80)
- **Before fix:** Floor ❌ (TS2741 missing `pinId`)
- **After push `75a1f83`:** **Floor ✅** (run 27046746655, ~2m9s) · **Vercel ✅** · CodeRabbit pending

---

## Remaining blockers

| Blocker | Severity | Owner |
|---------|----------|-------|
| ~~Floor CI green~~ | ~~Blocker~~ | **Resolved** — Floor pass on `75a1f83` |
| Prod smoke row | Medium | Post-merge Tier-1 on mdeai.co `/restaurants` |
| Nightlife/cafés SAN-575 slices | Scope | Separate commits; PR refs not closes |
| `toggle-group.tsx` untracked locally | Low | Delete or commit in nightlife slice |
| `github/` untracked locally | Low | Do not commit |

---

## Merge recommendation

**Merge PR #80 now** — Floor and Vercel green on `75a1f83`.

Then:
1. Mark SAN-575 **partial Done** (restaurants slice) or keep In Progress until nightlife/cafés.
2. Delete stale branch `ai/san-574-d-08-shared-browse-system`.
3. Next: SAN-586 (events API) ∥ SAN-575 slice 2 (`/nightlife`).

**Do not merge PR #81** — already closed.

---

## shadcn note (unchanged)

Filters use `Link` + `toggleVariants` instead of `ToggleGroupItem` + `Link` because Base UI exposed **button** role and broke SCREEN-023 `getByRole("link")`. Documented tradeoff.
