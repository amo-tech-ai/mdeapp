---
task_id: ven-031
mvp_step: 031
title: Playwright SCREEN-021/022/023
layer: TEST
priority: P1
status: In Progress
estimated_effort: 1 day
depends_on: [ven-010, ven-013, VEN-020, VEN-025, VEN-014, VEN-028, VEN-029, VEN-030]
unblocks: []
skills: [playwright-cli, copilotkit-debug, testing]
description: E2E venue discovery + booking on / — café, restaurant, nightlife screen specs.
---

# VEN-24 — Playwright venue screens


## At a glance

| | |
|---|---|
| **For** | Lucía |
| **Surface** | Playwright e2e |
| **Layer** | TEST |

## What we're building

End-to-end tests for SCREEN-021 café, 022 nightlife, 023 restaurant on `/chat`.

## Partial shipped (2026-06-03)

- [x] **`VEN-035-venue-release.spec.ts`** — unified SAN-314 gate (8 tests: 023 browse, 028/022 shells, 018 mobile, 021/022 chat, hygiene)
- [x] **`e2e/helpers/venue-release.ts`** — strict 90s waits, `EXPECT_CURATED_GROUNDING_FALLBACK`, no nudge retry
- [x] `npm run test:e2e:venue-release` + `verify:task -- VEN-031` registered in `scripts/verify-task.mjs`
- [x] `SCREEN-023-restaurant-listings.spec.ts` — legacy; covered by release suite
- [ ] Signed-in booking persist e2e (VEN-021 auth fixture)
- [ ] CI green on merged PR
- [ ] Legacy `SCREEN-021-cafe-listings.spec.ts` — superseded by release suite (optional delete)

## Features

- Three screen specs
- Console error sweep
- Unblocks CAF-018

## Agents & tools

Live concierge in dev

## Workflows

Booking smoke on 021

## User journey

1. CI runs Playwright against localhost.
2. Each kind: search → card → detail.
3. 021 adds booking pending assertion.

## Screens

| Screen | Spec | CKV deps |
|--------|------|----------|
| SCREEN-021 | Café booking | CKV-006 |
| SCREEN-022 | Nightlife | CKV-003, CKV-004 |
| SCREEN-023 | Restaurant | CKV-001, CKV-002 |

## Acceptance

- [ ] `npm run dev` boot + tests pass
- [ ] No console errors on tool render path
- [ ] Booking success, duplicate, failure, retry, and pending states covered
- [ ] RLS multi-user negative proof included or linked
- [ ] WhatsApp approval path uses stub Twilio and records audit evidence
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-031](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-031-verify-YYYY-MM-DD.md` |
| Grade | **A / 92** — release suite on `main` via PR #60; **not Done** |
| Production ready | No — booking auth e2e + SAN-368 |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Full venue Playwright suite |
| **MCP** | — |
| **Chrome DevTools** | Console sweep per screen |
| **Playwright** | 021 + 022 + 023 all green (023 ✅ 2/2) |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Add SCREEN-022
- Café booking auth in 021

