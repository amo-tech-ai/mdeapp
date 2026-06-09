task_id: ven-038
mvp_step: 038
id: VEN-038
title: CoffeeTourCard + CopilotKit tool render
status: Open
priority: P0
phase: CTI-A
effort: 5h
owner: claude
depends_on: [VEN-036, VEN-035, VEN-034, MAP-018F, MAP-019]
blocks: [VEN-039, VEN-040, VEN-048]
skill: [copilotkit-develop, copilotkit-agui, mde-maps, shadcn, testing]
mcp: [copilotkit]
mcp_verify_before_code:
  - mcp__copilotkit__search-docs — useCopilotAction render pattern v1.55.2
---

# VEN-038 — CoffeeTourCard UI

## In plain English

Show **rich tour cards** in the Copilot sidebar — score, why we recommend it, who it’s best for, and Map / Website buttons — using the same generative-UI pattern as grounded restaurant cards.

## User story

**As a Tourist on `/chat`,** I want tour results as visual cards (not a wall of text), **so that** I can compare options and open the map in one tap.

## Real-world example

After *“best coffee farm tour Medellín”*, the sidebar shows three cards: **Tour Urbano La Sierra** (score 82, “Social impact · cupping”), **La Casa Grande** (76, limited badge), each with **Map** and **Website** — agent reply stays ≤2 sentences per MAP-018.

## Goals

1. `CoffeeTourCard`, `CoffeeTourScoreBadge`, `CoffeeTourSourceBadges`.
2. `search-tool-renders.tsx`: `coffeeTourRender` for `searchCoffeeTours`.
3. `useCopilotAction` disabled mirror with matching tool name.
4. `ToolPinsSync` compatible pin ids.

## Wiring plan

| Layer | File | Action |
|-------|------|--------|
| Card | `mdeapp/src/components/copilot/coffee-tour-card.tsx` | Create |
| Renders | `mdeapp/src/components/copilot/search-tool-renders.tsx` | Modify |
| Tests | `mdeapp/src/components/copilot/__tests__/coffee-tour-card.test.tsx` | Create |

## Card fields

name, rating, review count, neighborhood, tour type, why recommended, best_for, price/duration, confidence, Map / Website / WhatsApp (if verified).

## Success criteria

1. Vitest: renders score badge when `finalScore` set.
2. Maps CTA uses `mapsUrl` only — no synthesized URLs.
3. Matches Paisa tokens / shadcn patterns from MAP-018F.
4. Card hidden when `finalScore` &lt; 55 (enforced in tool + ranker tests).
5. "Limited verification" badge when score &lt; 70 or missing verified `place_id`.
6. `useCopilotAction` mirror registered with same tool name as Mastra tool.

## Tests

```bash
cd mdeapp && npm test -- coffee-tour-card
```
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-038](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-038-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending (optional track) |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | See VEN-VERIFY-MATRIX § VEN-038 |
| **MCP** | Supabase / mastra / maps per task |
| **Chrome DevTools** | Tour UI routes when implemented |
| **Playwright** | Tour specs when implemented |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optional coffee-tour track — verify after implementation

