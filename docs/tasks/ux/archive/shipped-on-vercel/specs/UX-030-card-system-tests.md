---
id: UX-030
title: Card system tests — pin parity and Playwright per domain
status: Done
note: card-unification.spec.ts 4/4 PASS 2026-06-01
priority: P1
phase: Card unification M5 lock-in
effort: 5-8h
owner: claude
depends_on: [UX-022, UX-021]
blocks: []
risk: 🟢 Low
complexity: M
skill: [mde-task-lifecycle, testing, playwright-cli, vitest]
related:
  - UX-010-CARD-UNIFICATION-STRATEGY.md
  - ../UX-010-unified-result-card-architecture.md
description: Lock 1:1 card↔pin invariant, suppression registry, per-domain Playwright — cards count = markers count = 0 side-panel dup rows.
---

# UX-030 — Card system test suite (M5)

## Purpose

Prevent regression of duplicate panels and broken map sync — the exact bugs UX-010/22-card-audit found.

## Test matrix

| Test | Type | Assert |
|------|------|--------|
| `shouldSuppressGenericMapResults` all categories | Vitest | true when registrar mounted |
| Pin parity builder | Vitest | `rows.length === pins.length` |
| Card `data-pin-id` | Vitest | matches pin id from ToolPinsSync input |
| aria-label present | Vitest | all card kinds |
| Rental domain e2e | Playwright | N cards, N markers, 0 pin-row dup |
| Café domain e2e | Playwright | same |
| Restaurant domain e2e | Playwright | same + rich card testid |
| Event domain e2e | Playwright | same |
| Hover highlight | Playwright | optional data attribute on pin |
| Fallback render | Vitest | sparse payload no throw |

## Files

- `mdeapp/src/platform/copilot/__tests__/rich-card-results.test.ts` (extend)
- `mdeapp/e2e/card-unification.spec.ts` (new)
- `tasks/testing/evidence/<date>/card-unification-*.png`

## Acceptance

- [ ] All new tests pass in CI.
- [ ] `npm run floor` green.
- [ ] Evidence folder populated for Done gate.

## Flow diagram

```mermaid
flowchart TD
  subgraph invariant [1:1 invariant per domain]
    C[cards.length]
    P[pins.length]
    M[markers.length]
  end
  C --> P
  P --> M
  E2E[e2e/rich-card-dedup.spec.ts] --> Cafe[café ✅]
  E2E --> Event[event ✅]
  E2E --> Rental[rental ✅]
  E2E -.-> Restaurant[restaurant ❌ add test]
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| rich-card-dedup.spec.ts | ✅ exists — extend for restaurant |
| golden-queries-smoke | 🔴 not on main |
| Pin parity unit tests | Partial in platform/copilot |
