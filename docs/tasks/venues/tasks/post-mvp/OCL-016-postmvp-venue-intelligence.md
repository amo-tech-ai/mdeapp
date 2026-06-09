---
id: OCL-016-postmvp
tier: post-mvp
title: Events — venue intelligence browser enrich
status: Open
priority: P2
depends_on: [OCL-010-mvp, OCL-017-postmvp, OCL-030-postmvp]
skill: [open-claw, mde-maps, mastra]
plan_ref: ../../../plan/openclaw/events-openclaw/
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/tools/browser
  - https://docs.apify.com/platform/integrations/openclaw
github:
  - https://github.com/openclaw/openclaw
---

# OCL-016-postmvp — Venue enrich

**Roberto** `/host/event/new`: enrich `venue_intelligence` from public venue pages + Places link.

## job_type

`venue_intelligence_enrich`

## Enrichment targets

- public venue website
- public Instagram/Facebook page metadata
- Google Maps/Places link already stored by MAP tasks
- public event calendars showing prior events
- capacity, vibe, hours, contact channel, neighborhood, accessibility signals

## Acceptance

1. Host wizard shows enriched capacity/hours when `place_id` set.
2. Roberto review before publish.
3. No venue is marked booked/held/confirmed by OpenClaw.
4. All social signals are labeled directional and source-linked.
