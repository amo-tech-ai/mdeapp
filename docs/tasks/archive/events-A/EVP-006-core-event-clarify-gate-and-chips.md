---
id: EVP-006-core
legacy_id: F39
title: Event clarify gate + category chips
status: Done
priority: P1
phase: W6 — Camila event discovery polish
effort: 4–6h
depends_on:
  - EVP-005-core
  - SCREEN-006
blocks:
  - EVP-007-core
source_notes: ./40-prompt-questions.md
skill:
  - mastra
  - copilotkit-integrations
  - mermaid-diagrams
target_files:
  - mdeapp/src/mastra/agents/concierge.ts
  - mdeapp/src/platform/copilot/chat-filter-chips.ts
  - mdeapp/src/components/chat/chat-filter-copilot-instructions.tsx
  - mdeapp/src/lib/types/concierge-memory.ts
  - mdeapp/e2e/screens/SCREEN-006-event-card.spec.ts
---

# EVP-006-core — Event clarify gate + category chips

## Purpose

When **Camila** says generic `"list events medellin"`, the concierge should **not** immediately dump Supabase cards. It should ask one short category question and show suggested chips — then call `search-events` only after she picks a category, date, neighborhood, or says `"show all"`.

**Source:** [`40-prompt-questions.md`](./docs/40-prompt-questions.md)

## Problem today

| User says | Current behavior | Desired |
|-----------|------------------|---------|
| `list events medellin` | `search-events` forced (concierge L147 + Events chip) | Clarify + chips |
| `nightlife this weekend` | search (OK) | search immediately |
| `show all events` | search (OK) | search immediately |

**Conflict to resolve:** `chat-filter-copilot-instructions.tsx` Events chip + concierge lines 140–148 force immediate `search-events`. EVP-006-core narrows that to **specific** queries only.

## User story

As **Camila**, when I ask vaguely for events, I want the agent to ask what kind (music, nightlife, sports…) so I don't get irrelevant cards.

## Build scope

### Agent prompt (`concierge.ts`)

Add **event clarification gate** (mirror rental gate pattern, lines 120–140):

```
When user asks for generic events WITHOUT category, date, or neighborhood:
- Ask ONE short question: "What kind of events are you looking for?"
- List 8–10 category options (Music, Nightlife, Sports, Food, Culture, Networking, Tech, Wellness, Family, Outdoor)
- Do NOT call search-events yet

Call search-events immediately when user provides ANY of:
- category (nightlife, music, sports…)
- time window (tonight, this weekend, this week)
- neighborhood (Poblado, Laureles…)
- explicit "show all" / "popular events" / "top events this weekend"
```

Remove or narrow: `"list events" → call search-events` for bare city-only queries.

### Working memory

Extend `ConciergeWorkingMemory`:

- `lastEventQuery?: { category?, neighborhood?, dateWindow?, genericAskPending?: boolean }`
- Set `genericAskPending: true` after clarify question; clear on next user reply + search

### UI chips

Add **event sub-chips** (second row or expandable under Events intent):

| Chip | Maps to search-events param |
|------|----------------------------|
| Music | category |
| Nightlife | category |
| Sports | category |
| Food | category |
| Culture | category |
| This Weekend | dateWindow |
| Tonight | dateWindow |
| Show all | broad search |

Wire chip click → `useCoAgent` state + optional `useCopilotAdditionalInstructions` nudge.

### CopilotKit

- Chip active → inject instructions with category/date params for next turn
- Do **not** break SCREEN-006 path: `"salsa events this weekend"` still searches immediately

## Acceptance criteria

- [x] `"list events medellin"` → prose clarify + categories; **no** `search-events` in same turn
- [x] `"nightlife events this weekend"` → `search-events` + event cards in same turn
- [x] `"show all events"` → `search-events` broadly
- [x] Event sub-chips visible when Events intent active (or always in filter bar — pick one in implement)
- [x] `"Found N events"` never without tool (existing rule preserved)
- [x] English-only copy

## Tests

- [x] Vitest: `isGenericEventQuery()` helper if extracted
- [x] Extend `SCREEN-006`: generic query → no cards; specific query → cards
- [x] `npm run floor` exit 0
- [x] Manual: Browser MCP on `/` with both query types

## Evidence

- [x] `tasks/notes/EVP-006-core-evidence.md` — curl 200, Playwright pass, screenshot clarify state

## Do not do

- No external web scraping (EVP-018-mvp pack)
- No new Supabase tables
- No OpenClaw

## Risks

| Risk | Mitigation |
|------|------------|
| Regress Events chip auto-search | E2e both paths |
| Over-clarify on specific queries | Unit tests for query classifier |
