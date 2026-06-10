---
id: GS-007
title: Restaurant opening / closure verification (Search)
status: Not Started
priority: P3
phase: Phase 2.1
effort: 2-3h
owner: claude
depends_on: [MAP-002D, MAP-006]
blocks: []
parent_track: grounding-search
maps_to_external: RESTAURANTS-SEARCH-001 (04-grounding.md)
persona: Tourist
playbook_ref:
  guide: ../docs/00-playbook-guide.md
  primary: ../docs/02-playbook.md
---

# GS-007 — Restaurant closure verify

> **Read first:** [00-playbook-guide.md](../docs/00-playbook-guide.md) · [05-grounding.md](../docs/05-grounding.md) restaurant row; Search only after Places hours check.

## At a glance

**Tourist:** “Is this café open late tonight?” — Places hours first; Search only for **announcements** / conflicts.

## Flow

Places `currentOpeningHours` → if user mentions “closed”, “moved”, “renovation” → `verifyVenueUpdateTool` (GS-005) or dedicated restaurant prompt.

## Out of scope

Replacing `search-restaurants` SQL path.

## Cookbook references

| Playbook | Use for GS-007 |
|----------|----------------|
| [02-playbook.md](../docs/02-playbook.md) | Freshness/citation pattern for closure announcements |
| [03-grounding-summary.md](../docs/03-grounding-summary.md) | §8 Restaurants vertical |

## Definition of Done

One Playwright path + evidence when MAP-006 exists.
