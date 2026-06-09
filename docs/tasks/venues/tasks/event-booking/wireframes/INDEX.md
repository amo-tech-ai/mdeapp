---
title: Event venue booking wireframes (VEB-W)
updated: 2026-06-04
linear_mapping: ../../../linear/veb-evt-mapping.json
parent: ../INDEX.md
skill: [mde-wireframe, mermaid-diagrams]
paired_build_tasks: VEB-003 … VEB-011
---

# Event venue booking — wireframes

Lo-fi specs for **event proposal** flows — distinct from café/restaurant **table request** wireframes in [`../mvp/wireframes/`](../mvp/wireframes/).

| ID | EVT | Linear | Screen | Persona | Build tasks |
|----|-----|--------|--------|---------|-------------|
| [W01](./VEB-W01-wire-event-offerings-panel.md) | EVT-051 | [SAN-510](https://linear.app/sanjiovani/issue/SAN-510/evt-051-wire-event-offerings-panel-event-venue-cta) | Event offerings panel + card CTA | Roberto, Tourist | VEB-003, VEB-004 |
| [W02](./VEB-W02-wire-request-proposal-modal.md) | EVT-052 | [SAN-511](https://linear.app/sanjiovani/issue/SAN-511/evt-052-wire-request-proposal-modal) | Request proposal modal | Roberto | VEB-005 |
| [W03](./VEB-W03-wire-venue-match-compare.md) | EVT-053 | [SAN-512](https://linear.app/sanjiovani/issue/SAN-512/evt-053-wire-venue-match-panel-compare) | Match score + compare drawer | Roberto | VEB-007, VEB-008 |
| [W04](./VEB-W04-wire-host-venue-step.md) | EVT-054 | [SAN-513](https://linear.app/sanjiovani/issue/SAN-513/evt-054-wire-host-wizard-venue-step) | Host wizard venue step | Roberto | VEB-009 |
| [W05](./VEB-W05-wire-admin-event-booking-queue.md) | EVT-055 | [SAN-514](https://linear.app/sanjiovani/issue/SAN-514/evt-055-wire-admin-event-booking-queue) | Admin event booking queue | Patricia | VEB-011 |

## Shell context

All chat surfaces use the **3-panel `/chat` shell** (CopilotKit sidebar + map column + detail column) unless noted. Host wizard uses **center chat + preview** ([events W04](../../../events/wireframes/004-wire-host-event-wizard.md)).

## States (every screen)

| State | Requirement |
|-------|-------------|
| Default | Happy path ASCII in each wire |
| Loading | Skeleton placeholders |
| Empty | Copy + fallback CTA |
| Error | Retry + support link |
| Success | Honest WhatsApp confirm messaging |

## Handoff checklist

- [ ] ASCII reviewed against [`venues-booking.md`](../../docs/venues-booking.md) §2 screens table
- [ ] `data-testid` list in each wire for Playwright (VEB pack E2E)
- [ ] Mobile breakpoint notes on W01, W02, W03
