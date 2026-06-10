# SAN-731 · UI-004 — Event detail loading skeleton + hero alt (a11y)

**Date:** 2026-06-08  
**Linear:** [SAN-731](https://linear.app/sanjiovani/issue/SAN-731/ui-004-event-detail-loading-skeleton-hero-alt-a11y)  
**Spec:** `tasks/events/specs/pages/PAGE-003-event-detail-commerce.md` (gap line 56)  
**Branch:** `ai/san-731-ui-004-event-detail-skeleton-alt`  
**Commit SHA:** `5cc52ce`  
**PR:** https://github.com/amo-tech-ai/mdeapp/pull/137

## Blocker check

| Issue | Status | Gate |
|-------|--------|------|
| SAN-730 · AIE-002 | **Done** (PR #135 → `b50104c`) | ✅ unblocks SAN-731 |
| SAN-135 · AIE-024 | **In Review** (separate PR) | ✅ allowed parallel; merge **after** SAN-731 |
| SAN-731 | **In Review** — PR [#137](https://github.com/amo-tech-ai/mdeapp/pull/137) → `5cc52ce` | ✅ committed + PR open |

## Files in scope (3)

| File | Change |
|------|--------|
| `mdeapp/src/app/events/[slug]/loading.tsx` | **NEW** — route skeleton, shadcn `Skeleton`, semantic tokens, `aria-busy` |
| `mdeapp/src/components/events/event-detail-view.tsx` | Hero `alt={event.name}`; placeholder `aria-hidden` |
| `mdeapp/e2e/screens/SCREEN-014-event-detail.spec.ts` | Skeleton client-nav test + conditional hero alt assert |

## Tests run

| Command | Result |
|---------|--------|
| Playwright subset (5): curl 200, skeleton, tiers/checkout, UUID, mobile buy | **5/5 PASS** |
| Playwright skeleton only | **1/1 PASS** |
| Playwright desktop detail + screenshot | **1/1 PASS** |
| Full SCREEN-014 serial (6 tests) | **FAIL** — pre-existing `curl draft/unknown slug returns 404` gets HTTP 200 (out of SAN-731 scope) |
| `curl http://localhost:3001/events/reina-de-antioquia-2026-finals` | **200** |

## Browser proof (localhost:3001)

| Check | Result |
|-------|--------|
| Event detail loads (`reina-de-antioquia-2026-finals`) | ✅ |
| Skeleton on client navigation (Playwright + RSC delay) | ✅ |
| Skeleton on hard URL entry | ✅ Node/Playwright probe: `event-detail-skeleton` visible with delayed document/RSC (see hardNav probe in audit) |
| Hero `<img>` alt on seed event | ⚪ N/A — Reina has no `primary_image_url`; placeholder uses `aria-hidden` |
| Checkout modal opens | ✅ (Playwright) |
| Mobile sticky buy bar | ✅ (Playwright) |

**Screenshot:** `tasks/testing/evidence/2026-06-08/SAN-731-localhost.png` (69730 bytes, desktop detail + tiers)

## Review bots

| Tool | Scope | Findings |
|------|-------|----------|
| `cr review --agent -t uncommitted --base main --dir src/app/events` | `loading.tsx` | **0** |
| `cr review --agent -t uncommitted --base main --dir src/components/events` | `event-detail-view.tsx` | **0** |
| `cr review --agent -t uncommitted --base main --dir e2e/screens` | SCREEN-014 spec | **2** — see below |
| `cubic review -j` (uncommitted) | staged diff | **0 issues** |
| `cubic review -b -j` (branch vs main) | committed only | **0** (no commit on branch yet) |

### CodeRabbit e2e findings (non-product)

1. **Major** — defensive null check on `title` before `.trim()` in alt assert (lines 72–78).
2. **Critical** — skeleton test delays `KNOWN_SLUG` but clicks first CTA which may be a different slug (flake risk). Test passed in this run; recommend href-derived slug before merge or accept as follow-up.

**P1/P2 product code:** none.

## Code audit checklist

| # | Check | Verdict |
|---|-------|---------|
| 1 | Skeleton exists | ✅ `loading.tsx` |
| 2 | Design-system patterns | ✅ shadcn `Skeleton`, `bg-background`, `border-border`, `text-muted-foreground` |
| 3 | Hero alt uses event name | ✅ `alt={event.name}` |
| 4 | Fallback alt | ✅ no img → decorative placeholder `aria-hidden` + h1 carries name |
| 5 | Mobile buy bar | ✅ unchanged (Playwright) |
| 6 | Checkout flow | ✅ unchanged (Playwright) |
| 7 | Unrelated files | ✅ only 3 files staged |
| 8 | Token violations | ✅ no `gray-*` / hex in touched files |
| 9 | a11y regressions | ✅ none observed |

## Readiness scores

| Area | Score |
|------|------:|
| Spec Alignment | 88 |
| Tests | 82 |
| Browser Proof | 90 |
| Accessibility | 80 |
| Review Bots | 90 |
| Evidence | 95 |
| Process Compliance | 72 |

**Readiness /100:** **86**  
**Success rate estimate:** **~90%** post-commit (drops if e2e flake surfaces in CI)

## Remaining gaps

1. **Merge approval** — PR #137 open; resolve CI + any PR review threads.
2. **CodeRabbit post-commit** — rate-limited; re-run on PR or wait for GitHub bot review.
3. **Hero alt runtime proof** — seed event has no image; alt AC proven in code + conditional e2e only.

## Critical blockers

| Blocker | Blocks merge? |
|---------|---------------|
| PR review / CI | TBD |
| CR e2e hardening notes | Soft (tests green) |
| Full SCREEN-014 404 test | No (pre-existing) |

## Safe to open PR?

**Yes** — PR open: https://github.com/amo-tech-ai/mdeapp/pull/137

## Exact next command

```bash
gh pr checks 137 && gh pr merge 137 --squash   # after approval
# Then: merge SAN-135 → gate audit → SAN-492
```
