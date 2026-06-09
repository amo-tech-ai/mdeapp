---
id: INT-007
title: Event intelligence wrapper
phase: MVP
priority: P1
status: Done
closed: 2026-06-01  # committed origin/main c9e54b8 (use-event-search-fast-path.ts + event-discovery-workflow.ts, events hybrid via #32/#34); LIVE — prod synthetic smoke run 26760735915 events query → event-card on https://www.mdeai.co (success)
owner_system: [Mastra, Gemini]
personas: [Roberto, Andrés]
depends_on: [INT-001, INT-005]
unblocks: [INT-018]
linear_title: "INT-007 — Event intelligence wrapper"
linear_labels: [intelligence, mvp, p1, events]
implements: []
related_re: []
related_vec: []
---

# INT-007 — Event intelligence wrapper

## Problem

Event fast-path may repeat rental failure mode (canned clarify before agent).

## User story

As **Roberto**, `salsa events this weekend near Provenza` should extract vibe + dateRange + neighborhood without generic re-ask.

## Example prompt

`salsa events this weekend near Provenza` → `event_discovery`, slots filled → search or one focused clarify.

## Purpose & goals

- **Purpose:** Event vertical uses shared INT-001 slots — no rental-only bypass.
- **Goal:** Roberto discovers salsa events near Provenza without generic re-ask.
- **Success:** Event hero searches or one focused clarify; follow-up "cheaper tickets?" keeps intent.

## Workflow

```mermaid
flowchart TD
  R[Roberto: salsa events this weekend Provenza] --> E[INT-001 extract]
  E --> W[eventDiscoveryWorkflow]
  W --> S{confidence}
  S -->|≥ 0.85| SEARCH[search_events + cards]
  S -->|0.50–0.84| CL[One clarify: date or vibe]
  S -->|< 0.50| AG[conciergeAgent]
  SEARCH --> MAP[Map pins on /host/events or /chat]
```

## Implementation steps

1. Map INT-001 extract to `eventDiscoveryWorkflow` inputs
2. Align `use-event-search-fast-path.ts` confidence bands with CORE
3. Extend event parser if separate from shared extract
4. Regression test in INT-005 table

## Files likely touched

- `mdeapp/src/hooks/use-event-search-fast-path.ts`
- `mdeapp/src/mastra/workflows/event-discovery-workflow.ts`
- `mdeapp/src/mastra/agents/router.ts`

## Data requirements

`events` table filters (vibe, date, neighborhood).

## RLS / security

Events RLS per existing policies.

## Tests

- Unit: salsa weekend Provenza slots
- No instant canned event clarify when date+vibe present

## Acceptance criteria

- [ ] Event hero pattern searches or focused clarify
- [ ] Follow-up “cheaper tickets?” preserves intent (router rule)

## Failure points

- Duplicating rental-only parser logic (must use INT-001)

## Dependencies

INT-001, INT-005

## Verify

```bash
cd mdeapp && npm run test -- src/hooks/__tests__/use-event-search-fast-path.test.ts
```
