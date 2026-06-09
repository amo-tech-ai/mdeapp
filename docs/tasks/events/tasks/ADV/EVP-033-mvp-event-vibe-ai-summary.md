---
id: EVP-033-mvp
linear: SAN-136
tier: mvp
title: Event vibe tags and AI summary
status: Open
priority: P1
depends_on: [EVP-032-mvp, EVP-007-core]
skill: [mde-task-lifecycle]
surfaces:
  - /events/[slug]
  - chat event cards
  - /host/event/new
---

# EVP-033-mvp — Event vibe tags and AI summary

## Objective

Add structured vibe tags and an AI-generated "why this event matters" summary to event pages and cards.

## Real-world example

"Visionarios Night" shows tags like `startup-heavy`, `international`, `come solo`, `ambitious`, and an AI summary: "Best for founders, creators, and growth-minded professionals looking for high-quality networking in El Poblado."

## User story

As a guest, I want to know the feeling and audience of an event before buying a ticket.

## Workflow

1. Host enters event description in Roberto's wizard.
2. Mastra suggests vibe tags and a short summary.
3. Roberto approves or edits.
4. Supabase stores approved tags/summary.
5. Event cards and detail pages render them.

## Acceptance Criteria

- Event model supports approved `vibe_tags` and `ai_summary`.
- AI output is draft-only until host/admin approval.
- Event cards render up to 3 tags without layout shift.
- Detail page renders AI summary near the top.
- Tests prove unapproved AI summary is not public.
