---
id: INT-010
title: Working memory schema update
phase: MVP
priority: P1
status: In Progress
owner_system: [Mastra, CopilotKit]
personas: [Camila, Roberto]
depends_on: [INT-001]
unblocks: [INT-011, INT-013]
linear_title: "INT-010 — Working memory schema update"
linear_labels: [intelligence, mvp, p1, mastra, memory]
implements: []
related_re: []
related_vec: []
---

# INT-010 — Working memory schema update

## Problem

`conciergeWorkingMemorySchema` lacks `checkIn`, `checkOut`, `stayType`, and a shared slot snapshot.

> ✅ **Correction (verified on disk 2026-05-28).** `budgetType` is **already present** on `lastRentalQuery` (`concierge.ts:25`) — do not re-add it. The real **Zod↔TS drift** is `genericAskPending`: it exists on the TS type (`src/lib/types.ts:17` `ConciergeWorkingMemory.lastRentalQuery.genericAskPending`) **and** on the Zod `lastEventQuery` (`concierge.ts:54`), but is **missing from the Zod `lastRentalQuery`** (`concierge.ts:20-26`). Because Mastra validates/persists working memory through this Zod schema and Zod strips unknown keys, the rental clarify-once flag the parser reads at `rental-query-parser.ts:174,177,192,211,262` (`memory.lastRentalQuery.genericAskPending`) may **never persist across turns** — so the "ask once, then search on the next turn" rental flow can silently misbehave. Add `genericAskPending: z.boolean().optional()` to the Zod `lastRentalQuery` to close the drift.

## User story

As **Camila**, turn 2 should inherit June + $1000/month from turn 1 without re-parsing from scratch only.

## Example prompt

Turn 1: hero rental → Turn 2: `Laureles furnished` uses `lastRentalQuery` with dates/budgetType.

## Workflow

```mermaid
sequenceDiagram
    participant C as Camila
    participant A as conciergeAgent
    participant M as WorkingMemory (LibSQL)

    C->>A: june 1-30 $1000 rentals
    A->>M: read(lastRentalQuery)
    M-->>A: null (first turn)
    A->>A: search-rentals tool
    A->>M: write lastRentalQuery<br/>budgetType checkIn checkOut<br/>genericAskPending=false
    A-->>C: rental cards shown

    C->>A: more options in Laureles
    A->>M: read(lastRentalQuery)
    M-->>A: dates + budgetType preserved
    A->>A: refine search (inherit dates)
    A-->>C: refined cards, no re-parse
```

## Implementation steps

1. Extend Zod in `concierge.ts` + `src/lib/types.ts` (three-place sync rule). **Include the missing `genericAskPending` on the Zod `lastRentalQuery`** (parity with `lastEventQuery`); add `checkIn`/`checkOut`/`stayType`. Do **not** re-add `budgetType` (already present).
2. Fast-path hooks write partial slots to `setState`
3. Consider `scope: resource` spike doc (Phase 2 — not required here)
4. Tests in `concierge.test.ts`

## Files likely touched

- `mdeapp/src/mastra/agents/concierge.ts`
- `mdeapp/src/lib/types.ts`
- `mdeapp/src/hooks/use-rental-search-fast-path.ts`
- `mdeapp/src/hooks/use-event-search-fast-path.ts`
- `mdeapp/src/mastra/lib/agent-memory.ts`

## Data requirements

Aligned with INT-001 slot fields.

## RLS / security

Thread memory via F13 storage — no service role in client.

## Tests

- Schema accepts new fields
- Follow-up turn preserves `lastRentalQuery`

## Acceptance criteria

- [ ] Hero + follow-up E2E in working memory tests
- [ ] No drift between Zod and TS types

## Failure points

- Forgetting third sync location (packages/types in W4)

## Dependencies

INT-001

## Verify

### Unit tests — schema round-trip + Zod↔TS parity

```bash
cd mdeapp && npx vitest run \
  src/mastra/agents/__tests__/concierge.test.ts \
  src/mastra/lib/__tests__/intelligence-rental-search.test.ts
# Expected: lastRentalQuery with checkIn/checkOut/stayType/genericAskPending persists across turns;
#           Zod schema round-trips all fields without stripping unknowns
```

### Drift guard — Zod schema and TS type must be in sync

```bash
cd mdeapp && npx tsc --noEmit
# Expected: 0 errors — no TS type mismatch between concierge.ts Zod and src/lib/types.ts
```

### Working memory multi-turn proof (requires `npm run dev`)

```
1. Turn 1: send "rentals in Laureles june 1 to 30 $80/night"
   → fast-path triggers, search results shown
   → working memory written: lastRentalQuery {checkIn, checkOut, neighborhood}
2. Turn 2: send "show me furnished options"
   → agent reads lastRentalQuery from memory
   → new search inherits checkIn/checkOut from turn 1 (no re-parse)
   Network: search_rentals tool call on turn 2 includes checkIn="2026-06-01"
```

### genericAskPending round-trip proof

```bash
cd mdeapp && npx vitest run src/lib/__tests__/rental-search-fast-path.test.ts
# Expected: clarify-once flag survives Zod validation (not stripped as unknown key)
```

### Full suite + build

```bash
cd mdeapp && npm run test && npm run build
```
