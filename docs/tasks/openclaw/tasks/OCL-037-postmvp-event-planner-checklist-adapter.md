---
id: OCL-037-postmvp
tier: post-mvp
title: Events — event planner checklist adapter
status: Open
priority: P1
depends_on: [OCL-036-postmvp, OCL-016-postmvp, OCL-033-postmvp]
skill: [open-claw, mde-task-lifecycle]
sources_index: ../docs/sources.md
research:
  - ../docs/event-repos-skills-scorecard.md
references:
  - chris-openclaw/event-planner-os
  - 1kalin/afrexai-event-management
---

# OCL-037-postmvp — Event planner checklist adapter

## Objective

Adapt the best event-planning patterns into an mdeai-owned checklist model for Roberto's host workflow.

## Why this is needed

Repos like `event-planner-os` are strong references for timelines, vendors, volunteers, budgets, and tasks, but mdeai must store truth in Supabase and surface actions through CopilotKit approval cards.

## Scope

| Area | Requirement |
|---|---|
| Checklist taxonomy | Define event milestones: venue, tickets, sponsors, vendors, staffing, rehearsal, content, launch, day-of ops, post-event report. |
| Data ownership | Store checklist state in Supabase event/task tables, not OpenClaw local JSON. |
| AI generation | Mastra can suggest checklist drafts from event type, size, venue, budget, and sponsor requirements. |
| CopilotKit UI | Show generated checklist as approval/edit cards before writing tasks. |
| OpenClaw role | Research public evidence or vendor info only after approval. |

## Acceptance Criteria

- Roberto can generate a draft event checklist for "Miss Medellin Beauty Contest Finals".
- Checklist tasks include owner, due date, source, priority, and approval status.
- AI-generated checklist writes only after human approval.
- OpenClaw does not create event truth directly.
- Unit or workflow test proves unapproved checklist drafts are not persisted.
