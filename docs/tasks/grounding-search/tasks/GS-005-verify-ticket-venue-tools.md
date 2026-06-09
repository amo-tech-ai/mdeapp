---
id: GS-005
title: Verify ticket source + venue update tools
status: Not Started
priority: P2
phase: Phase 2.1
effort: 3-4h
owner: claude
depends_on: [MAP-002D, GS-002]
blocks: []
parent_track: grounding-search
personas: [Andrés, Roberto]
playbook_ref:
  guide: ../docs/00-playbook-guide.md
  primary: ../docs/02-playbook.md
  secondary: ../docs/01-playbook.md
  sections: [url_context — Phase 2 optional]
---

# GS-005 — Verify ticket + venue tools

> **Read first:** [00-playbook-guide.md](../docs/00-playbook-guide.md) · Same `google_search` + citations contract as [02-playbook.md](../docs/02-playbook.md); stricter prompt: require official-domain chunks.

## At a glance

| Tool | Persona | Example |
|------|---------|---------|
| `verifyTicketSourceTool` | Andrés | Is this Eventbrite URL official? |
| `verifyVenueUpdateTool` | Roberto | Is this venue closed tonight? |

Same ADK SearchAgent backend; different prompts + stricter citation requirements.

## Acceptance criteria

1. Ticket URL query → ≥1 citation to official or platform page.
2. Venue query → candidate status only — no Supabase write.
3. Registered on `conciergeAgent` with F49 disabled mirror.

## Out of scope

Auto-save to `events` — see **EVT-D09**.

## Cookbook references

| Playbook | Use for GS-005 |
|----------|----------------|
| [02-playbook.md](../docs/02-playbook.md) | Citation list pattern for `verifyTicketSourceTool` render |
| [01-playbook.md](../docs/01-playbook.md) | Grep `url_context` — optional corroboration with user-supplied ticket URL |
| [03-grounding-summary.md](../docs/03-grounding-summary.md) | §10 proposed tools |

## Definition of Done

Evidence: `tasks/notes/GS-005-evidence.md`.
