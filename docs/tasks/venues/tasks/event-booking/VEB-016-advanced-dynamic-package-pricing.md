---
legacy_id: EVT-048
linear: SAN-507
linear_url: https://linear.app/sanjiovani/issue/SAN-507/evt-048-dynamic-package-pricing
task_id: veb-016-advanced
tier: advanced
title: Dynamic package pricing (weekend vs weekday)
layer: mastra
priority: P3
status: Not Started
estimated_effort: 2 days
depends_on: [veb-004, veb-013]
unblocks: []
skills: [mastra, gemini, mde-supabase]
description: Package price rules by day-of-week — tool returns adjusted price, UI shows breakdown.
---

# VEB-016-advanced — Dynamic package pricing

> **Linear:** [EVT-048 — Dynamic package pricing (weekend vs weekday)](https://linear.app/sanjiovani/issue/SAN-507/evt-048-dynamic-package-pricing) · **Project:** [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues)

## Phase 2+

## What we're building

`venue_event_packages` rules: weekend surcharge, holiday minimum — **computed in tool**, displayed in offerings panel.

## Example

| Package | Weekday | Fri–Sat |
|---------|---------|---------|
| Birthday dinner | $25/person | $32/person |
| Min spend | $500 | $800 |

## Acceptance criteria

- [ ] Price shown in UI matches tool calculation for selected date
- [ ] Agent cites rule name in match panel ("Weekend minimum applies")
- [ ] No LLM-invented prices

## Related

- [`venues-booking.md`](../../docs/venues-booking.md) §6 Advanced AI
