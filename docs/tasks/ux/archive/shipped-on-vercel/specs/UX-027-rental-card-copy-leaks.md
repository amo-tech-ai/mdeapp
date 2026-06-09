---
id: UX-027
title: Fix RentalCard production copy leaks
status: Done
priority: P0
phase: Card unification — prod hygiene
effort: 30min
owner: claude
depends_on: []
blocks: []
risk: 🟢 Low
complexity: XS
shipped: a8d2e26
skill: [mde-task-lifecycle, testing]
related:
  - ../tests/22-card-audit.md
  - ../tests/23-live-audit.md
  - UX-TASKS-VERIFICATION-REPORT.md
description: Remove "Photo soon" dev placeholder and SCREEN-011 internal ticket from Save button title — audit R-09, R-10. Shipped on feat/ux-002-005-chat @ a8d2e26.
---

# UX-027 — RentalCard copy leaks (P0 quick win)

## Changes

| Location | Before | After |
|----------|--------|-------|
| Photo placeholder | `"Photo soon"` | `"Photo"` or empty alt-only |
| Save `title` | `"Saved collections ship with SCREEN-011"` | `"Save for later (coming soon)"` (align UX-008) |

## File

`mdeapp/src/components/copilot/rental-card.tsx`

## Acceptance

- [x] No internal ticket IDs in DOM/inspector (`title="Save for later (coming soon)"` @ L186).
- [x] Photo placeholder cleaned (commit a8d2e26).
- [ ] Merged to `main` / prod deploy — verify after #17 merge.

## Flow diagram

```mermaid
flowchart LR
  Card[RentalCard] --> DOM[Browser DOM]
  DOM -->|before| Leak["SCREEN-011 in title ❌"]
  DOM -->|after| OK["Save for later coming soon ✅"]
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| Save title fixed | ✅ L186 |
| On main | ❌ Branch-only until merge |
