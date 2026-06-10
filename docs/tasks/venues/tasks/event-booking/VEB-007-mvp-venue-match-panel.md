---
legacy_id: EVT-039
linear: SAN-498
linear_url: https://linear.app/sanjiovani/issue/SAN-498/evt-039-ai-venue-match-score-panel
task_id: veb-007-mvp
tier: mvp
title: AI venue match score panel
layer: copilot
priority: P1
status: Not Started
estimated_effort: 1 day
depends_on: [veb-006]
unblocks: [veb-008]
skills: [copilotkit-develop, shadcn, mde-wireframe]
wireframe: ./wireframes/VEB-W03-wire-venue-match-compare.md
description: Generative UI panel explaining why a venue fits — 92% fit for AI networking with cited tool reasons.
---

# VEB-007-mvp — AI venue match score panel

## Disk reality (2026-06-02)

**Not on disk.** **Blocked by:** VEB-006 agent/tools.

## At a glance

| | |
|---|---|
| **Linear** | [EVT-039 — AI venue match score panel](https://linear.app/sanjiovani/issue/SAN-498/evt-039-ai-venue-match-score-panel) · [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) |
| **For** | Roberto |
| **Surface** | `/chat` generative UI card after search |
| **Screen to design** | **W03** match panel |

## What we're building

After `searchEventVenues`, show a **match panel** per top result:

```text
Mamacita Medallo — 92% fit for AI networking
✓ Capacity 120 standing (need 80)
✓ Package: Coworking meetup from $15/person
✓ Provenza location
⚠ No dedicated stage (not ideal for fashion show)
[ View offerings ] [ Add to compare ] [ Request proposal ]
```

Score + bullets come from `scoreVenueFit` tool output — Gemini narrates, does not invent facts.

## User journey (Journey B)

1. Roberto: "I need a venue for 80 founders in Provenza."
2. Agent returns 3 venues with match panels.
3. Roberto taps **Add to compare** on two → VEB-008.

## CopilotKit

| Hook | Use |
|------|-----|
| `useCopilotAction` | Render match panel from tool result |
| `useCoAgent` | Sync shortlisted venues to map pins |

## Acceptance criteria

- [ ] Fit score 0–100 with ≥3 cited reasons from tool JSON
- [ ] Warning line when `not_ideal_for` matches user event type
- [ ] CTAs wire to VEB-004 / VEB-005 / VEB-008
- [ ] Map pin highlights on card focus
- [ ] Empty: "No venues match — try fewer guests or different neighborhood"

## Wireframe

[`VEB-W03`](./wireframes/VEB-W03-wire-venue-match-compare.md)
