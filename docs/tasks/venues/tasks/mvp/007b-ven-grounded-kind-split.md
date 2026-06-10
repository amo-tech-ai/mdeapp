---
task_id: ven-012
mvp_step: 012
title: Grounded render café vs nightlife kind split
layer: WIRE
priority: P0
priority_label: "🔥 CRITICAL BLOCKER — core routing infrastructure"
status: Done
estimated_effort: 1 day
depends_on: [ven-011]
unblocks: [ven-013]
skills: [copilotkit-develop, copilotkit-agui, mde-maps]
mcp: [project-0-mdeai-copilotkit]
description: Stop hardcoding kind=cafe in GroundedPlaceResults; branch on tool intent or primaryType for nightlife cards.
grade: B+/88
evidence: tasks/venues/tasks/evidence/VEN-012-verify-2026-06-02.md
---

# VEN-12 — Grounded café vs nightlife split


## At a glance

| | |
|---|---|
| **For** | Tourist + Sarah |
| **Surface** | `/chat` grounded results |
| **Layer** | WIRE |

## What we're building

Fix hardcoded cafe kind in grounded renders — branch café vs nightlife from tool intent.

## Features

- openNightlifeDetail vs openCafeDetail
- Pin category nightlife
- Unblocks CKV-004

## Agents & tools

`search-grounded-places` with intent

## Workflows

None

## User journey

1. Nightlife query returns rows.
2. Click opens NightlifeDetailPanel, not café tabs.
3. Café queries unchanged.

## Bug today (🔴 blocker — audit 2026-06-02)

`toCafeVenueDetail` in [`search-tool-renders.tsx`](../../../mdeapp/src/components/copilot/search-tool-renders.tsx) hardcodes `kind: "cafe"` (≈L67). All grounded rows render via `GroundedCafeResults` → **CafeDetailPanel**, including nightclub queries.

**Do not mark Done** until nightlife queries open `NightlifeDetailPanel` (VEN-013).

## Goals

1. Pass `intent` or infer kind from tool result metadata / `primaryType`.
2. `openCafeDetail` vs `openNightlifeDetail` (CKV-004).
3. Optional `NightlifeResultCard` variant or `kind` prop on shared card.
4. `RichCardResultsRegistrar` — category `nightlife` or sub-kind on `grounded`.
5. Update `normalize-tool-output` pin category (**CKV-021** partial).

## Acceptance

- [x] Reggaeton club query opens nightlife panel, not café tabs (code path + unit tests)
- [x] Café queries unchanged
- [x] Playwright fixture in **SCREEN-022**

## MCP verify

`search-code` — Mastra tool-rendering grounded places examples.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-012](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-012-verify-YYYY-MM-DD.md` |
| Grade | B+ / 88 |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Café vs nightclub render split in search-tool-renders |
| **MCP** | — |
| **Chrome DevTools** | Correct card component per grounded kind |
| **Playwright** | SCREEN-021 vs 022 routing |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Depends VEN-011
- Vitest kind filter tests

