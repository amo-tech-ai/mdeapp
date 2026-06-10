task_id: ven-040
mvp_step: 040
id: VEN-040
title: smoke:coffee-tours script
status: Open
priority: P1
phase: CTI-A
effort: 2h
owner: claude
depends_on: [VEN-038, VEN-039]
blocks: [VEN-042]
skill: [testing, webapp-testing, chrome-devtools-cli, mastra-smoke-test]
mcp: []
---

# VEN-040 — Coffee tours smoke

## In plain English

One command (**`npm run smoke:coffee-tours`**) proves the whole tour flow works on localhost — routing, cards, pins, scores — for Lucía/Sofía before anyone marks Phase A Done.

## User story

**As Lucía (QA),** I want an automated smoke script, **so that** we never mark CTI Done without proof that tour search beats restaurant search on a real dev server.

## Real-world example

```bash
cd mdeapp && npm run dev &
npm run smoke:coffee-tours
# exit 0 → ≥3 tour cards, ≥3 coffee_tour pins, no search-restaurants, no score<55 visible
```

## Goals

1. `mdeapp/scripts/smoke-coffee-tours.mjs`
2. `package.json` script `smoke:coffee-tours`
3. Env `SMOKE_COFFEE_TOUR_QUERY` default: `list best coffee farm tours in medellin`

## Assertions

- HTTP 200 on `/`
- POST `/api/copilotkit` completes
- **Blocking:** query routes to `searchCoffeeTours` (log or Vitest hook) — not `search-restaurants`
- ≥3 `[data-testid*="coffee-tour"]` or cards with `data-listing-type="coffee_tour"`
- ≥3 map markers with `meta.listingType=coffee_tour`
- No card with score &lt; 55 visible
- No `results-empty` when pins present
- 0 critical console errors (optional chrome-devtools)

## Wiring plan

| Layer | File | Action |
|-------|------|--------|
| Script | `mdeapp/scripts/smoke-coffee-tours.mjs` | Create |
| Package | `mdeapp/package.json` | Add script |

## Success criteria

1. `npm run smoke:coffee-tours` exit 0 with dev on :3001 + Mastra :4111.
2. Blocking: tour query uses `searchCoffeeTours`, not `search-restaurants`.
3. ≥3 tour cards and ≥3 map pins with `listingType=coffee_tour`.
4. No visible card with score &lt; 55; no critical console errors.
5. Output captured in VEN-042 evidence template.

## Tests

```bash
cd mdeapp && npm run dev &
npm run smoke:coffee-tours
```
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-040](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-040-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending (optional track) |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | See VEN-VERIFY-MATRIX § VEN-040 |
| **MCP** | Supabase / mastra / maps per task |
| **Chrome DevTools** | Tour UI routes when implemented |
| **Playwright** | Tour specs when implemented |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optional coffee-tour track — verify after implementation

