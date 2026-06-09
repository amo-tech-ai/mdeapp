---
date: 2026-05-28
branch: feat/c012-cafe-places-detail
commit: 991db97 (pre-commit; blocker fixes unstaged)
base: e8d2a60 (main)
verdict: GO
reviewer: Cursor pre-merge audit — blocker fix pass
---

# C-012 pre-merge verification — GO

## Summary

| Question | Answer |
|----------|--------|
| Feature works (desktop + mobile detail)? | **Yes** |
| Merge blockers fixed? | **Yes** — mobile sheet + maps-grounding spec + stable waits |
| Hydration block merge? | **No** — Cursor tooling only; Chrome clean |
| **Merge C-012** | **GO** (after commit + push) |
| Start C-013? | **No** — merge C-012 first |

---

## What changed (blocker fix pass)

| File | Change |
|------|--------|
| `src/components/chat/cafe-detail-mobile-sheet.tsx` | **New** — bottom sheet with `data-testid="cafe-detail-mobile-sheet"`; reuses `CafeDetailPanel` on `<lg` |
| `src/components/chat/chat-canvas.tsx` | Mount `CafeDetailMobileSheet` |
| `e2e/maps-grounding.spec.ts` | Assert in-card attribution + café cards + pins; footer attribution count **0** |
| `e2e/helpers/maps-layout.ts` | `waitForCafeGroundedCards()` with natural-language retry nudge |
| `e2e/screens/SCREEN-021-cafe-listings.spec.ts` | Use `waitForCafeGroundedCards`; bar-lounge asserts `.last()` assistant message |

**Not touched:** events, rentals, `chat-nav-rail.tsx`.

---

## Hydration (not a blocker)

| Context | Result |
|---------|--------|
| Cursor embedded browser | `data-cursor-ref` instrumentation — ignore |
| Normal Chrome | **Clean** (user confirmed) |
| Playwright | **Clean** |

No code change for hydration.

---

## Commands run (after fixes)

```bash
cd /home/sk/mdeai/mdeapp
git checkout feat/c012-cafe-places-detail

PW_SKIP_WEBSERVER=1 npx playwright test \
  e2e/screens/SCREEN-021-cafe-listings.spec.ts \
  e2e/maps-grounding.spec.ts \
  --project=chromium --workers=1

npm run floor
```

---

## PASS / FAIL table

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | `npm run floor` | **PASS** | lint, typecheck, build, 311 vitest, audit (moderate only) |
| 2 | SCREEN-021 — desktop main | **PASS** | 9.6s |
| 3 | SCREEN-021 — ask prompt | **PASS** | 16.8s |
| 4 | SCREEN-021 — mobile sheet | **PASS** | 9.0s — `cafe-detail-mobile-sheet` visible |
| 5 | SCREEN-021 — bar-lounge | **PASS** | 9.3s |
| 6 | maps-grounding | **PASS** | 7.7s — in-card attribution + pins |
| 7 | Hydration | **PASS** | Not a blocker |
| 8 | Manual café smoke (prior run) | **PASS** | See prior evidence screenshots |

### SCREEN-021: **4/4**

### maps-grounding: **1/1**

### Playwright combined: **5/5** in ~53s

---

## Screenshots

| File | Description |
|------|-------------|
| [`screenshots/c012-mobile-detail-sheet.png`](./screenshots/c012-mobile-detail-sheet.png) | Mobile — sheet open after Details |
| [`screenshots/c012-manual-cafe-cards.png`](./screenshots/c012-manual-cafe-cards.png) | Desktop — café cards |
| [`screenshots/c012-manual-detail-panel.png`](./screenshots/c012-manual-detail-panel.png) | Desktop — detail panel |
| [`screenshots/c012-manual-map-restored.png`](./screenshots/c012-manual-map-restored.png) | Desktop — map after close |

---

## Remaining risks

1. **Agent flake** — `waitForCafeGroundedCards` retry nudge may run on slow Gemini; monitor CI.
2. **Prod/preview smoke** — not run in this session; run after deploy per C-012 spec.
3. **Uncommitted blocker fixes** — commit on branch before PR.
4. **LLM content** — bar-lounge test uses `.last()` assistant message to avoid strict-mode + greeting noise.

---

## GO / NO-GO

| Gate | Verdict |
|------|---------|
| SCREEN-021 4/4 | **GO** |
| maps-grounding | **GO** |
| `npm run floor` | **GO** |
| Hydration | **GO** (no fix) |
| **Merge C-012** | **GO** — commit blocker-fix slice, open PR |
| **Start C-013** | **NO-GO** until C-012 on `main` |

---

## PR-ready / merge-ready

| | |
|--|--|
| **PR-ready** | **Yes** — after one commit for mobile sheet + e2e alignment |
| **Merge-ready** | **Yes** — gates green; push + draft PR |

Suggested commit message:

```text
fix(chat): mobile café detail sheet + align grounding e2e (C-012)

- CafeDetailMobileSheet for lg:hidden when café detail opens
- maps-grounding: in-card attribution, not footer
- waitForCafeGroundedCards stabilizes SCREEN-021
```

---

## Related

- Task: [`tasks/commit/may-27/tasks/C-012-cafe-places-detail.md`](../../commit/may-27/tasks/C-012-cafe-places-detail.md)
