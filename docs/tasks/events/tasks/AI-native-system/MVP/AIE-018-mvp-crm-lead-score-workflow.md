---
id: AIE-018-mvp
title: crmLeadScoreWorkflow + /host/crm
status: Not Started
priority: P1
phase: mvp
persona: roberto
linear: —
percent: 0
blocked_by: [AIE-017]
blocks: []
depends_on: []
wireframe: ../../wireframes/events/017-sponsorship-crm.md
plan: ../../../plans/04-AI-native-system.md §9
---

# AIE-018-mvp — CRM lead scoring

## Objective

`/host/crm` pipeline with fit score, last touch, stale/hot flags.

## Schema

`crm_leads`, `crm_activities` — RLS organizer-scoped

## Acceptance criteria

- `crmLeadScoreWorkflow` updates lead health
- Kanban or table UI per wireframe 017
- Lead capture from sponsor pipeline + attendee inquiries
