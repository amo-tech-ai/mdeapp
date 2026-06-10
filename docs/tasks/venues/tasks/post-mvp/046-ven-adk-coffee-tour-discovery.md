---
id: VEN-046
title: ADK discovery merge into coffee_tours staging
status: Open
priority: P2
phase: CTI-B
effort: 5h
owner: claude
depends_on: [VEN-032, VEN-036, MAP-002]
blocks: []
skill: [mastra, mde-maps, copilotkit-integrations]
mcp: [user-mastra, google-maps-code-assist]
---

# VEN-046 — ADK discovery merge

## In plain English

Let **ADK Grounding Lite** suggest new tour candidates from the web, merge them with Patricia’s seed data by `place_id`, and keep unapproved rows in staging — chat still shows SQL-ranked seeded tours first.

## User story

**As Patricia (admin),** I want discovery candidates in a staging table, **so that** new farms found online can be reviewed before Tourists see them in chat.

## Real-world example

ADK returns a finca near Jericó → staging row with `place_id`; duplicate of La Casa Grande merges away; Patricia approves → promoted to `coffee_tours`; chat still caps 5 cards with attribution footer.

## Goals

1. Optional path in `searchCoffeeTours`: ADK query suffix `"coffee farm tour Medellín"`.
2. Merge with seeded rows; no duplicate pins.
3. Unverified candidates → staging only, not chat until Patricia approves.

## Success criteria

1. Vitest: merge dedupes same `place_id`.
2. Attribution block when ADK used.
3. Quota: max 5 cards per turn.
4. Unverified staging rows never appear in chat until approved.

## MCP

ADK sidecar :8000 health before test.
