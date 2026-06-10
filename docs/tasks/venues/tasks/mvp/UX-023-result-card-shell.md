---
id: UX-023
title: Extract ResultCardShell and card primitives from CafeResultCard
status: In Progress
priority: P1
phase: Card unification M0
effort: 6-10h
owner: claude
depends_on: [UX-020]
blocks: [UX-024, UX-028, UX-029]
risk: 🟡 Medium
complexity: L
skill: [mde-task-lifecycle, shadcn, testing]
related:
  - UX-010-CARD-UNIFICATION-STRATEGY.md
  - ../tests/22-card-audit.md
description: Extract layout/a11y/map hooks into ResultCardShell + media/header/badges/footer primitives. Refactor CafeResultCard first; rental/event consume shell without visual regression.
---

# UX-023 — ResultCardShell + primitives (M0)

> **Does not block UX-022 or UX-025.** Ship wiring + rich `RestaurantCard` first; extract shell after proof on `main`.

## Purpose

One layout engine for selection ring, hover→pin, aria, footer border-t, overflow — domain cards supply content slots only.

## Affected files

| Create | Modify |
|--------|--------|
| `components/cards/base-result-card.tsx` | `cafe-result-card.tsx` |
| `result-card-media.tsx` | `rental-card.tsx` (behavior-preserving) |
| `result-card-header.tsx` | `event-card.tsx` |
| `result-card-badges.tsx` | |
| `result-card-footer.tsx` | |
| `result-card-actions.tsx` | |

## Rules

- **CafeResultCard snapshot must match** before/after (pixel-equivalent classes).
- **RentalCard snapshot must match** — no redesign.
- Shell owns: `cn()` selected, `data-pin-id`, `data-result-kind`, `data-selected`, hover/focus→`onSelect`, keyboard on body.

## Tests

- Vitest: shell renders slots; missing photo → placeholder.
- Vitest: `onSelect` called on mouseEnter.
- Existing cafe/rental/event card tests stay green.

## Acceptance

- [x] CafeResultCard uses shell; visual parity verified (screenshot or test).
- [x] RentalCard uses shell; visual parity verified.
- [x] EventCard uses shell; `cn()` not template literals.
- [ ] `npm run floor` green (blocked: unrelated `restaurants/page.tsx` lint).

## Flow diagram

```mermaid
flowchart TD
  CRC[CafeResultCard gold] --> Shell[ResultCardShell extract]
  Shell --> RC[RentalCard parity]
  Shell --> EC[EventCard parity]
  Shell --> CC[CafeResultCard refactor]
```

## Verification (2026-06-01)

| Claim | Result |
|-------|--------|
| `blocks` | Updated — **does not block** UX-025/026 (shipped on branch without shell) |
| Shell exists | ✅ `result-card-shell.tsx` + vitest |
| Rental snapshot parity | ✅ rental-card-copy tests green |
