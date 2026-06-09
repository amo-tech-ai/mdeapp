# Event cards panel fix — evidence (2026-05-24)

## Problem

User query `list events medellin` returned prose ("Found 5 events…") but no visible event cards. Root causes:

1. Gemini sometimes skipped `search-events` and answered from memory.
2. Generative UI cards only rendered inline in CopilotChat scroll (easy to miss).
3. Map results footer showed "No pins yet" while map had pins (separate sync path).

## Fix

| File | Change |
|------|--------|
| `src/components/chat/event-results-panel.tsx` | Persistent **Events (N)** strip below chat |
| `src/components/chat/event-search-results-context.tsx` | Tool render → panel sync |
| `src/components/chat/chat-filter-copilot-instructions.tsx` | Events chip → force `search-events` |
| `src/mastra/agents/concierge.ts` | Hard rule: no "Found N events" without tool |
| `src/lib/normalize-tool-envelope.ts` | Defensive JSON parse for tool output |

## Verification (localhost :3001, 2026-05-24)

| Check | Result |
|-------|--------|
| Browser: Events chip + `list events medellin` | ✅ 5 cards + Events (5) panel + map pin rows |
| Playwright SCREEN-006 desktop + mobile | ✅ 2/2 |
| Playwright layout desktop + mobile | ✅ 6/6 |
| `npm run floor` | ✅ exit 0 |

## Follow-up

- Deduplicate inline chat cards vs panel (optional UX polish).
- Seed ticket tiers for Sébastien Léger (0 tiers in DB today).
