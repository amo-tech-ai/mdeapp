# F40 — Event prompt + trusted source registry — evidence

**Date:** 2026-05-20  
**Status:** Done

## Shipped

- `mdeapp/src/lib/events/trusted-event-sources.ts` — 24 sources, `sourcePriorityForCategory`
- `docs/events/trusted-sources.md` — human mirror
- `concierge.ts` + `event-agent.ts` — F40 critical rules block
- `search-events.ts` — `sourceUrl` on cards; `EventCard` source link when external URL
- Vitest: `trusted-event-sources.test.ts`

## MCP / docs

- CopilotKit unchanged; Mastra prompt-only per F40 scope (no scraping).

## Verification

| Check | Result |
|-------|--------|
| Vitest registry | 24 https URLs; nightlife → RA + Eventbrite |
| SCREEN-006 | **3/3** pass |
| `npm run floor` | exit **0** |

## Grade: A
