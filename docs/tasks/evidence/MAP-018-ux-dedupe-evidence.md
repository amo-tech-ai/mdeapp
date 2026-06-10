# MAP-018 UX dedupe — evidence (2026-05-20)

## Problem

After MAP-018F, Camila saw **four copies** of the same cafés: rich photo cards, agent prose list with "View on Google Maps", "Maps grounding" name bullets, and Map results panel rows.

## Shipped

| Change | File |
|--------|------|
| Agent: max 2 sentences, no place names / Maps links in prose after `search-grounded-places` | `mdeapp/src/mastra/agents/concierge.ts` |
| Rich cards: single footer "Places data from Google Maps" (no name list) | `mdeapp/src/components/copilot/search-tool-renders.tsx` |
| Hide grounded rows in Map results panel when rich cards on | `mdeapp/src/components/chat/chat-results-column.tsx` |
| E2E accepts `grounding-attribution-compact` | `e2e/helpers/maps-layout.ts`, `e2e/maps-grounding.spec.ts` |

## Verify

```bash
cd mdeapp && npm test -- src/mastra/agents/__tests__/concierge.test.ts
# New chat → "list cafes in medellin"
# Expect: photo cards + 1–2 sentence agent reply + compact attribution only
```

## Rollback

- Prose lists: revert concierge grounded formatting block
- Full attribution list: set `NEXT_PUBLIC_RICH_GROUNDED_CARDS=false`
