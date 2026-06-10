---
task_id: ven-009
mvp_step: 009
title: RestaurantResultCard + search-tool-renders
layer: UI
priority: P0
status: In Review
estimated_effort: 1 day
depends_on: [data-004]
unblocks: [ven-010]
skills: [copilotkit-develop, copilotkit-integrations, shadcn]
mcp: [project-0-mdeai-copilotkit]
aliases: [RST-001 partial]
description: Replace GenericResults/PlaceResultCard path with dedicated restaurant card wired to searchRestaurantsTool render.
---

# VEN-09 — Restaurant result card


## At a glance

| | |
|---|---|
| **For** | Carlos |
| **Surface** | `/chat` restaurant results |
| **Layer** | UI |

## What we're building

Dedicated restaurant result cards replacing GenericResults — photo, cuisine, rating, neighborhood.

## Features

- RestaurantResultCard component
- useCopilotAction disabled render
- Map pin sync category=restaurant

## Agents & tools

`conciergeAgent` → searchRestaurantsTool

## Workflows

None

## User journey

1. Carlos searches Italian El Poblado.
2. Polished cards appear in chat column.
3. Click opens RestaurantDetailPanel.

## Pattern (CopilotKit 1.55.2)

Mirror [`CafeResultCard`](../../../mdeapp/src/components/copilot/cafe-result-card.tsx):

```tsx
useCopilotAction({
  name: MASTRA_COPILOT_TOOL_ACTIONS.restaurants, // searchRestaurantsTool
  available: "disabled",
  render: restaurantRender,
}, []);
useCopilotAction({ name: MASTRA_TOOL_IDS.restaurants, available: "disabled", render: restaurantRender }, []);
```

MCP: search-docs `useCopilotAction available disabled`.

## Goals

1. `RestaurantResultCard` — photo, rating, cuisine, neighborhood, price tier.
2. Replace `GenericResults` in `search-tool-renders.tsx` restaurant branch.
3. `onOpenDetails` → `openRestaurantDetail` (CKV-002).
4. Pin sync via existing `ToolPinsSync category="restaurant"`.
5. Vitest snapshot tests.

## Acceptance

- [x] SCREEN-023 wire fields present on card (`RestaurantCard`, `data-testid="restaurant-card"`)
- [x] Both Mastra action names registered (`MASTRA_COPILOT_TOOL_ACTIONS.restaurants` + `MASTRA_TOOL_IDS.restaurants`)
- [x] `npm run dev` + restaurant query shows new cards on `/` (Playwright SCREEN-023 when agent responds)

**Disk:** `mdeapp/src/components/copilot/restaurant-card.tsx`, `domain-results.tsx`, `search-tool-renders.tsx`
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-009](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | [`SCREEN-023`](../../../testing/evidence/2026-06-02/SCREEN-023-RESULTS.md) · dedicated `VEN-009-verify` optional |
| Grade | **A- / 90** (via SCREEN-023) |
| Production ready | Staging — chat path only |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | `npm run dev` → `/` → restaurant search → `RestaurantCard` in results column |
| **MCP** | CopilotKit MCP — `useCopilotAction` disabled render |
| **Chrome DevTools** | Snapshot `results-column`, restaurant card testids; 0 critical console errors |
| **Playwright** | `npx playwright test e2e/screens/SCREEN-023-restaurant-listings.spec.ts` (2/2 ✅) |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Flip **Done** after dedicated `VEN-009-verify-YYYY-MM-DD.md` (optional — SCREEN-023 sufficient)
- Phase B: grounded `intent: restaurant` merge (not Phase A scope)
- `/restaurants` catalog grid still separate from chat cards (documented limitation)

