---
id: OCL-041-advanced
tier: advanced
title: Events — live ops ticker and role-specific event updates
status: Open
priority: P3
depends_on: [OCL-022-advanced, OCL-023-advanced, OCL-035-advanced, OCL-040-postmvp]
skill: [open-claw, mde-task-lifecycle]
sources_index: ../docs/sources.md
research:
  - ../docs/event-repos-skills-scorecard.md
references:
  - b0kelmann/liveticker-skill
---

# OCL-041-advanced — Live ops ticker

## Objective

Adapt live ticker patterns into an mdeai event-day ops room for staff, sponsors, and organizers.

## Why this is needed

Large events need role-specific updates: doors open, VIP line status, sponsor activation checks, livestream status, judge timing, vendor arrival, and incident notes. This should be an internal ops surface first, not a public fan-out system.

## Scope

| Role | Example update |
|---|---|
| Patricia | "Door scanner error rate above threshold." |
| Roberto | "Finalist rehearsal is 12 minutes behind." |
| Sponsor lead | "Sponsor banner placement photo ready for review." |
| Staff | "VIP check-in moves to side entrance." |

## Boundaries

- Internal dashboard first.
- WhatsApp sends only after OCL-035 approval and opt-in rules.
- No emergency/legal decisions by AI.
- No automated public announcements.

## Acceptance Criteria

- Ops ticker stores immutable event-day notes with actor, role, source, timestamp, and severity.
- AI may summarize status, but cannot create high-severity incident records without human confirmation.
- Role-specific delivery rules are configurable and testable.
- Failed channel delivery stays visible in ops dashboard.
- Replay test proves ticker state can be reconstructed from logs.
