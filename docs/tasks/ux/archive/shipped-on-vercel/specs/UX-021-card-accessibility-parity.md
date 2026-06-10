---
id: UX-021
title: WCAG aria-labels, testId defaults, data-result-kind on all cards
status: Done
priority: P0
phase: Card unification — accessibility
effort: 3-4h
owner: claude
depends_on: []
blocks: [UX-030]
risk: 🟢 Low
complexity: S
skill: [mde-task-lifecycle, shadcn, testing, web-design-guidelines]
related:
  - ../tests/22-card-audit.md
  - UX-010-CARD-UNIFICATION-STRATEGY.md
description: Apply CafeResultCard gold patterns — aria-label, optional testId with default, data-result-kind — to RentalCard, EventCard, PlaceResultCard. Fixes audit R-01, R-06, R-07.
---

# UX-021 — Card accessibility + test addressability (P0)

## Purpose

WCAG 4.1.2: interactive card regions need accessible names. Playwright needs stable selectors without text coupling.

## Affected files

| File | Change |
|------|--------|
| `rental-card.tsx` | `aria-label`, `data-result-kind="rental"`, `testId` prop default |
| `event-card.tsx` | same + `cn()` for selected state (R-03) |
| `place-result-card.tsx` | `aria-label`, `data-result-kind`, default `testId`, `overflow-hidden`, `cn()` |
| `grounded-place-card.tsx` | same if not deleted yet |
| `__tests__/*-card.test.tsx` | assert aria-label + data-result-kind |

## Pattern (from CafeResultCard)

```tsx
aria-label={`Open details for ${title}`}
data-result-kind="rental"
testId = "rental-card" // optional prop
```

## Tests

- Vitest per card: renders `aria-label` when interactive.
- Vitest: `data-result-kind` present.

## Acceptance

- [ ] All interactive cards have `aria-label`.
- [ ] All cards have `data-result-kind`.
- [ ] `testId` optional with sensible default on rental/event/place.
- [ ] `npm run floor` green.

## Flow diagram

```mermaid
stateDiagram-v2
    [*] --> Default
    Default --> Focused: focus / hover
    Focused --> Default: blur
    note right of Focused
        aria-label required
        data-result-kind set
    end note
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| CafeResultCard gold | ✅ has aria + data-result-kind |
| RentalCard | 🔴 missing aria, data-result-kind, hover |
| UX-027 copy | ✅ Done — separate from a11y |
