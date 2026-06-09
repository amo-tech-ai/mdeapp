---
id: OCL-017-postmvp
tier: post-mvp
title: Events — directory / calendar import
status: Open
priority: P2
depends_on: [OCL-010-mvp]
skill: [open-claw, mde-supabase, mastra]
plan_ref: ../../../plan/openclaw/events-openclaw/events-openclaw-prd.md
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/tools/browser
github:
  - https://github.com/openclaw/openclaw
---

# OCL-017-postmvp — Event import

**Roberto / map:** crawl MDE Community + allowed public calendars → staging → `events` with `place_id` when verified.

## job_type

`event_directory_import`

## Acceptance

1. ≥10 events with `freshness_at`.
2. Mastra `event-discovery-workflow` can read imported rows.
3. No ticket or payment side effects.
