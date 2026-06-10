---
task_id: AI-004
title: Grounding verification pipeline
layer: APP
phase: intel-1b
priority: P0
status: Not Started
estimated_effort: 4h
depends_on: [DATA-045, SEARCH-003]
unblocks: [DATA-046]
blocks: []
skills: [mastra, mde-maps, mde-supabase]
related:
  - ../../maps/MAP-005-places-proxy-cache.md
description: Verify every surfaced card has ≥1 citation — Supabase evidence, Places cache hit, or ADK grounding — before showing rank explanation as trusted.
---

# AI-004 — Grounding verification pipeline

## At a glance

| | |
|---|---|
| **For** | Lucía · Tourist trust |
| **Why now** | Phase 1b — hybrid results must show why (evidence), grounded POIs must not hallucinate |
| **Rule** | Verification gate, not primary retrieval |

## What we're building

1. Post-search verifier: each result must have `venue_source_evidence` OR `mapsUrl` from Places OR ADK attribution
2. Flag rows failing verification → downgrade or omit from top-N
3. Log failures to `grounding_failures` (DATA-047 family)
4. UI: only show evidence chip when verification passes

## Paths

| Vertical | Primary | Fallback |
|----------|---------|----------|
| Restaurants | Supabase + signals + evidence | — |
| Cafés / POIs | search-grounded-places | ADK/Places |
| Events | Supabase | web-grounded-events |

## Done gate

| Check | Evidence |
|-------|----------|
| Restaurant cards | evidence row or ai_summary source |
| Grounded cards | Places field mask + attribution |
| No unverified top-3 | automated test |
| Failures logged | grounding_failures table |

## Out of scope

- Replacing hybrid search with ADK
- Auto-booking

## Verify

```bash
cd mdeapp && npm run verify:grounding && npm run smoke:grounding-attribution
```
