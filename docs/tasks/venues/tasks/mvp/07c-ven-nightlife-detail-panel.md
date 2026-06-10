---
task_id: ven-013
mvp_step: 013
title: NightlifeDetailPanel + mobile sheet
layer: UI
priority: P0
status: Done
estimated_effort: 1 day
depends_on: [ven-012]
unblocks: [VEN-031]
skills: [copilotkit-develop, shadcn, mde-maps]
description: Nightclub/bar detail panel — SCREEN-007; ticketed events stay on EventVenueDetail.
grade: B+/87
evidence: tasks/venues/tasks/evidence/VEN-013-verify-2026-06-02.md
---

# VEN-13 — Nightlife detail panel


## At a glance

| | |
|---|---|
| **For** | Tourist |
| **Surface** | `/chat` right column SCREEN-022 |
| **Layer** | UI |

## What we're building

Nightlife detail panel — vibe, hours, dress code placeholder, safety copy, book CTA.

## Features

- NightlifeDetailPanel component
- Distinct from CafeDetailPanel
- Safety copy once per thread

## Agents & tools

None

## Workflows

None

## User journey

1. Tourist picks a Provenza club.
2. Panel shows nightlife-specific fields.
3. Book routes to shared VenueBookingSheet.

## Goals

1. `NightlifeVenueDetail` + `openNightlifeDetail` in context.
2. `NightlifeDetailPanel` — hours, cover, music genre, dress code placeholders (honest if unknown).
3. Distinguish from `search-events` ticket cards — no checkout step here.
4. Mobile sheet parity with café column.

## Acceptance

- [x] Reggaeton / rooftop bar query → nightlife panel (routing + SCREEN-022)
- [x] Event ticket card still uses `EventVenueDetail` (unchanged)
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-013](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-013-verify-YYYY-MM-DD.md` |
| Grade | B+ / 87 |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Nightlife card → NightlifeDetailPanel |
| **MCP** | — |
| **Chrome DevTools** | Mirror restaurant panel testids |
| **Playwright** | SCREEN-022 |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Mirror VEN-010 file set
- Mobile sheet

