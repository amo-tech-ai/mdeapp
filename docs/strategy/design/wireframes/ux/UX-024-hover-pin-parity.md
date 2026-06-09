---
id: UX-024
title: Hover and focus → pin highlight on RentalCard and EventCard
status: Not Started
priority: P1
phase: Card unification — interaction parity
effort: 2-3h
owner: claude
depends_on: [UX-020]
blocks: []
risk: 🟢 Low
complexity: S
skill: [mde-task-lifecycle, mde-maps, testing]
related:
  - ../tests/22-card-audit.md
description: CafeResultCard previews pin on hover/focus; rental/event require click. Add onMouseEnter/onFocus → onSelect; normalize onSelect signature to () => void.
---

# UX-024 — Hover→pin parity (R-02)

## Purpose

Map feels connected when hovering list cards — matches Google Maps / Airbnb list behavior.

## Affected files

- `rental-card.tsx` — add `onMouseEnter`/`onFocus`; normalize `onSelect?: () => void` (callers close over id)
- `event-card.tsx` — same
- `search-tool-renders.tsx` — update call sites if signature changes

## Tests

- Vitest: mock `onSelect`, fire `mouseEnter`, assert called once.
- Playwright (optional in UX-030): hover card → pin attribute changes.

## Acceptance

- [ ] Hover rental/event card calls `panToPin` without opening detail panel.
- [ ] Click still opens detail when configured.
- [ ] `npm run floor` green.

## Flow diagram

```mermaid
sequenceDiagram
    participant Card as RentalCard
    participant Map as MapContext
    Card->>Map: onMouseEnter → onSelect
    Map->>Map: panToPin(pinId)
    Note over Card,Map: CafeResultCard already does this
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| Cafe hover→pin | ✅ onMouseEnter |
| Rental hover→pin | 🔴 missing |
| onSelect signature | 🟡 rental uses id param |
