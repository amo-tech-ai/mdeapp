---
id: MAP-012A
title: Colombia coverage spike — Places Aggregate vs Insights
status: Not Started
priority: P2
phase: Post-MVP gate
effort: 2-4h
owner: claude
depends_on: [MAP-004]
blocks: [MAP-012]
skill: [mde-maps, mde-firecrawl]
checklist_ref: ./maps-checklist.md §6–7
prd_ref: ../../plan/maps/maps-prd.md
parent_task: MAP-012-neighborhood-intelligence.md
official_docs:
  - https://developers.google.com/maps/documentation/places-aggregate
  - https://developers.google.com/maps/documentation/places-insights
evidence_file: ../notes/MAP-012A-spike-evidence.md
---

# MAP-012A — Colombia Aggregate vs Insights spike

## At a glance

**Description:** **Evidence-only** spike — test whether **Places Aggregate** and/or **Places Insights** return usable data for Medellín neighborhoods **before** building MAP-012 rollups, migrations, or refresh jobs.

**Purpose:** Avoid wasting weeks on analytics APIs that are empty, US-skewed, or mispriced for Colombia. **Patricia** gets a written go/no-go; **MAP-012** implementation waits on this gate.

| SKU | Question |
|-----|----------|
| **Places Aggregate** | Can we get **category counts per hood polygon** (e.g. cafés in Laureles)? |
| **Places Insights** | Do we get **density / rating / foot-traffic-style** signals for hood comparison in CO? |

> **Not production code.** No `neighborhood_scores` migration in this task.

## Why important

**MAP-012** promises data-backed hood cards for **Camila** (“which area is better for remote work?”). Without this spike, we might:

- Build a weekly refresh job against an API that returns empty for Medellín
- Pick Insights when Aggregate suffices (cost)
- Pick Aggregate when Insights is required for the product story

## Spike matrix

Run **3–5 neighborhood bounding boxes** × **2 categories**:

| Neighborhood | Categories to probe |
|--------------|---------------------|
| Laureles | `cafe` / `coffee_shop`, `coworking_space` |
| El Poblado | same |
| Envigado | same |
| Belén or Centro | optional 4th hood |

**Per API:** save redacted request + response (counts, errors, latency, billing SKU if visible).

## Decision table (fill in evidence)

| Outcome | MAP-012 v1 path |
|---------|-----------------|
| **Aggregate sufficient in CO** | v1 = Aggregate rollups → `neighborhood_scores` |
| **Insights required + CO data exists** | v1 = Insights + cache; defer Aggregate |
| **Both weak in CO** | v1 = **MAP-006 Nearby cache** + curated `medellin.json` only; revisit Phase 3 |

## Workflows

1. Read official docs via mde-maps / Maps Code Assist MCP — confirm auth + field shapes.
2. Use server `GOOGLE_PLACES_API_KEY` or project-approved analytics key — **never** client bundle.
3. Execute probe calls (script in `tasks/notes/` or one-off curl — do not commit secrets).
4. Write [`MAP-012A-spike-evidence.md`](../notes/MAP-012A-spike-evidence.md):
   - Redacted JSON samples
   - Latency + error rates
   - **Recommendation row** from decision table
   - Cost estimate per weekly refresh (order of magnitude)
5. Update [**MAP-012**](./MAP-012-neighborhood-intelligence.md) header with chosen v1 path (one paragraph).

## Acceptance criteria

1. Evidence file complete with ≥3 hoods probed.
2. Written **recommendation** signed off in evidence (Patricia or owner comment).
3. MAP-012 `depends_on` satisfied — no MAP-012 migration until this Done.
4. No new Supabase tables or edge functions in this PR.

## Verification checklist

- [ ] Aggregate probe documented (success or explicit failure reason)
- [ ] Insights probe documented (success or explicit failure reason)
- [ ] Decision table row selected with rationale
- [ ] MAP-012 spec updated with v1 API choice

## Out of scope

- `neighborhood_scores` migration
- `NeighborhoodCard` UI
- Production cron / edge refresh
- Places Insights hex maps in admin UI

## Definition of Done

Evidence + recommendation + MAP-012 cross-update. Commit: `docs(maps): CO Aggregate vs Insights spike (MAP-012A)`.
