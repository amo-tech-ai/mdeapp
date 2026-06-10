---
legacy_id: EVT-040
linear: SAN-499
linear_url: https://linear.app/sanjiovani/issue/SAN-499/evt-040-compare-venues-side-by-side
task_id: veb-008-mvp
tier: mvp
title: Compare venues side-by-side UI
layer: UI
priority: P1
status: Not Started
estimated_effort: 1 day
depends_on: [veb-007]
unblocks: []
skills: [shadcn, copilotkit-develop, mde-wireframe]
wireframe: ./wireframes/VEB-W03-wire-venue-match-compare.md
description: Compare 2–3 event venues — capacity, price, vibe, map — then request proposal on winner.
---

# VEB-008-mvp — Compare venues UI

## Disk reality (2026-06-02)

**Not on disk.** **Blocked by:** VEB-007.

## At a glance

| | |
|---|---|
| **Linear** | [EVT-040 — Compare venues side-by-side UI](https://linear.app/sanjiovani/issue/SAN-499/evt-040-compare-venues-side-by-side) · [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) |
| **For** | Roberto |
| **Surface** | `/chat` drawer or right column compare mode |
| **Screen to design** | **W03** compare table |

## What we're building

Side-by-side comparison when user shortlists 2–3 venues from match panels.

## Compare columns

| Row | Venue A | Venue B | Venue C |
|-----|---------|---------|---------|
| Fit score | 92% | 85% | 78% |
| Capacity | 120 stand | 80 stand | 60 seat |
| Min spend | $500 | $800 | $300 |
| Packages | 2 | 1 | 3 |
| Neighborhood | Provenza | Laureles | Poblado |
| Map | pin | pin | pin |

## User journey

1. User adds venues to compare from match panels.
2. Compare drawer opens (max 3).
3. User picks winner → **Request proposal** pre-fills venue_id.

## Acceptance criteria

- [ ] Max 3 venues in compare tray
- [ ] Removing venue updates map pins
- [ ] Mobile: horizontal scroll compare cards
- [ ] **Request proposal** opens VEB-005 with venue locked
- [ ] Data from tools only — no hallucinated prices

## Wireframe

[`VEB-W03`](./wireframes/VEB-W03-wire-venue-match-compare.md) — compare section
