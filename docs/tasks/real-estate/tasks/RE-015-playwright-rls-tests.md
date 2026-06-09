---
task_id: RE-015
title: Playwright + RLS tests
layer: QA
priority: P1
phase: ship
status: Not Started
persona: Lucía
depends_on: [RE-004, RE-006, RE-008, RE-010]
unblocks: [RE-016]
skills: [playwright-cli, webapp-testing, task-verifier]
testing_standard: ../../screens/SCREEN-TESTING-STANDARD.md
description: SCREEN-005/008 specs; two-user RLS note; floor gate.
---

# RE-015 — Playwright + RLS tests

## Specs

| File | Surface |
|------|---------|
| `e2e/screens/SCREEN-005-rental-cards.spec.ts` | Chat rental cards |
| `e2e/screens/SCREEN-008-schedule-viewing.spec.ts` | Viewing modal |
| Landlord inbox spec (new) | RE-008 route |

## RLS

- Document or automate: User A lead not visible to User B
- Landlord sees only assigned leads

## Acceptance criteria

- [ ] Desktop + mobile pass
- [ ] `npm run floor` exit 0
- [ ] Evidence files in `tasks/notes/` or `tasks/real-estate/evidence/`
