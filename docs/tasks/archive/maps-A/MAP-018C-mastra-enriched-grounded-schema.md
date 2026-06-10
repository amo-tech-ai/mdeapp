---
id: MAP-018C
title: Mastra grounded tool + normalizer for enriched place pins
status: Done
priority: P0
phase: MVP — MAP-018 track
effort: 2-3h
owner: claude
depends_on: [MAP-018B]
blocks: [MAP-018F]
parent: MAP-018
skill: [mastra, copilotkit-integrations, mde-maps, testing]
---

# MAP-018C — Mastra enriched grounded schema

## At a glance

**Goal:** `search-grounded-places` and `normalizeToolOutput` pass enriched fields from ADK to CopilotKit without breaking thin-card fallback.

## Enriched pin shape (extends invoke contract)

| Field | Type | Source |
|-------|------|--------|
| `id`, `title`, `latitude`, `longitude`, `placeId`, `mapsUrl` | existing | MCP |
| `rating` | number? | Details |
| `userRatingCount` | number? | Details |
| `priceLevel` | string? | Details enum |
| `openNow` | boolean? | `currentOpeningHours.openNow` |
| `formattedAddress` | string? | Details |
| `primaryType` | string? | first of `types` |
| `summary` | string? | `editorialSummary.text` |
| `photoName` | string? | `photos[0].name` — for 018D proxy |

## Files to modify

| File | Change |
|------|--------|
| `mdeapp/src/mastra/lib/adk-grounding-types.ts` | Enriched pin + invoke types |
| `mdeapp/src/mastra/tools/search-grounded-places.ts` | outputSchema optional enriched fields |
| `mdeapp/src/mastra/lib/adk-grounding-client.ts` | Parse enriched pins |
| `mdeapp/src/platform/maps/normalize-tool-output.ts` | `subtitle` = address; pin metadata |
| `mdeapp/src/platform/maps/__tests__/normalize-tool-output.test.ts` | Enriched fixture |

## Env vars

| Var | Notes |
|-----|-------|
| `ADK_GROUNDING_URL` | unchanged |
| `ADK_INTERNAL_TOKEN` | unchanged |

## Security

- No new client-side keys.
- Zod: all enriched fields **optional** — MCP-only sidecar still validates.

## Tests

- Vitest: enriched ADK JSON → `MapPin` with `subtitle`, `rating` in meta.
- Vitest: MCP-only JSON → same as today (no regression).
- `concierge.test.ts`: grounded tool still registered.

## Success criteria

1. `npm run test` — normalize + tool tests green.
2. Tool execute with mocked enriched ADK returns extended schema.
3. `npm run floor` exit 0.

## Rollback

Revert Zod extensions; UI ignores unknown fields.

## Do not

- Call Places API from Mastra in this task (018B owns server enrichment).
- Replace CopilotKit runtime.
