# EVT-013 — Event card E2E fix evidence

**Date:** 2026-05-31  
**Branch:** `feat/c012-cafe-places-detail`  
**Spec:** SAN-117 / EVT-013

## Root causes

| # | Issue | Severity |
|---|--------|----------|
| 1 | Event fast-path ran search + map rows but **never mounted `EventCard`** in chat (no `EventFastPathPanel`, input not wired) | 🔴 Blocker |
| 2 | `this_weekend` filter returned **0 rows** (seed events May 16–23; test date May 30) | 🔴 Blocker |
| 3 | Map clustering renders only subset of pins at default zoom; test assumed first card pin always in DOM | 🟡 Test flake |

## Fix (C-013 pattern)

- `event-fast-path-context.tsx` + `EventFastPathPanel` → `EventResults` in `#copilot-chat-region`
- `ConciergeChatInput` calls `useEventSearchFastPath().handleUserMessage` after rental intercept
- `use-event-search-fast-path`: `setToolResult(envelope)` + **weekend-empty → retry `dateWindow: "any"`**
- `export EventResults` + `RichCardResultsRegistrar category="event"`
- E2E: pick card with visible map pin; click **that** card's Details CTA

## Verification

```bash
cd mdeapp && npm run dev   # :3001
PW_SKIP_WEBSERVER=1 npx playwright test \
  e2e/screens/SCREEN-006-event-card.spec.ts \
  e2e/rich-card-dedup.spec.ts -g "event" \
  --project=chromium --workers=1
```

**Result:** 4/4 PASS (2026-05-31)

```
✓ rich-card-dedup events
✓ SCREEN-006 clarify without cards
✓ SCREEN-006 desktop cards + buy CTA + pins
✓ SCREEN-006 mobile cards in chat
```

Unit: `npm run test -- event-search-fast-path event-query-classifier` → 19/19 PASS

## Red flags / follow-ups

- **Data drift:** prod/dev events not aligned with Bogotá `this_weekend` windows — e2e relies on `any` fallback until DATA seeds current-weekend rows.
- **Clustering:** 10 event pins → only ~3 individual `map-pin` nodes at city zoom; pan/select may need product polish.
- **Agent nudge path** in `waitForEventCards` still slow/flaky if fast-path regresses — keep fast-path as primary.
