task_id: ven-039
mvp_step: 039
id: VEN-039
title: Map pins + results column for coffee tours
status: Open
priority: P1
phase: CTI-A
effort: 2h
owner: claude
depends_on: [VEN-038, MAP-030, MAP-031, F50, F50b]
blocks: [VEN-040]
skill: [mde-maps, copilotkit-develop, testing]
mcp: [google-maps-code-assist]
---

# VEN-039 — Tour map pins

## In plain English

Put **tour locations on the chat map** so Tourists see where farms are — using `meta.listingType: "coffee_tour"` so pins are not confused with café pins.

## User story

**As a Tourist on `/chat`,** I want tour results on the map and in the results strip, **so that** I can pick a neighborhood before I book.

## Real-world example

*“List coffee tours in Medellín”* → three ☕ pins in La Sierra, Envigado, and Belén; clicking a card pans the map; MAP-031 strip shows “3 tours on map” (not `results-empty`).

## Goals

1. Pins: `category: grounded` (interim) with **`meta.listingType: "coffee_tour"`** required on every tour pin — do not rely on category alone. Add MAP-030 `tour` glyph when that task extends categories.
2. `chat-results-column.tsx`: tour-aware copy (reuse MAP-031 logic).
3. `panToPin` on card click (MAP-015 / F50).

## Wiring plan

| Layer | File | Action |
|-------|------|--------|
| Map | `mdeapp/src/components/maps/ChatMap.tsx` | Verify cluster path |
| Results | `mdeapp/src/components/chat/chat-results-column.tsx` | Minor copy/testid |
| Marker | `CategoryMapMarker` | Optional ☕/tour glyph |

## Success criteria

1. `list coffee tours in medellin` → ≥3 pins on map.
2. Every tour pin has `meta.listingType: "coffee_tour"`.
3. No `results-empty` when pins exist (MAP-031).
4. `AdvancedMarker` parent has `mapId`.
5. Card click triggers `panToPin` (F50).

## Tests

```bash
cd mdeapp && npm test -- chat-results-column
```
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-039](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-039-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending (optional track) |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | See VEN-VERIFY-MATRIX § VEN-039 |
| **MCP** | Supabase / mastra / maps per task |
| **Chrome DevTools** | Tour UI routes when implemented |
| **Playwright** | Tour specs when implemented |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optional coffee-tour track — verify after implementation

