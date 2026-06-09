---
spec: EVT-013
san: SAN-117
date: 2026-05-31
floor: exit 0 (313/313)
playwright: SCREEN-006 3/3, SCREEN-021 4/4
pr: "#14"
branch: feat/c012-cafe-places-detail
head: 28316b0
---

# EVT-013 — Event cards in AI chat (SCREEN-006)

## Root cause

Event cards rendered only via CopilotKit tool renders (agent round-trip ~30s).
`[data-testid="event-card"]` never appeared in fast-path chat → 120s timeout.

## Fix

`EventFastPathContext` + `EventFastPathPanel`:
- `useEventSearchFastPath.handleUserMessage` calls `setToolResult(envelope)` on results
- `EventFastPathPanel` renders `<EventResults />` inline; cards appear in seconds
- dateWindow fallback: retry with `"any"` if specific window returns 0 results

CodeRabbit blocker (same PR): `createClient()` + `supabase.auth.getUser()` moved inside `try` in `/api/copilotkit/[[...path]]/route.ts`

## Proof

```
npm run floor
  lint ✅  typecheck ✅  build ✅  test 313/313 ✅  audit (19 mod/low) ✅
  FLOOR_EXIT: 0

PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-006-event-card.spec.ts \
  --project=chromium --workers=1
  [chromium] generic event query clarifies without cards  ✅
  [chromium] event query renders cards, buy CTA, and map pins  ✅
  [chromium] mobile event cards render in center chat  ✅
  3 passed (2.6m)

PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-021-cafe-listings.spec.ts \
  --project=chromium --workers=1
  [chromium] renders ranked café cards, map sync, detail panel, booking stub  ✅
  [chromium] ask prompt keeps detail panel open and injects chat  ✅
  [chromium] keeps café cards usable on mobile without horizontal overflow  ✅
  [chromium] best cafes medellin — no JSON leak or bar-lounge cards  ✅
  4 passed (2.9m)
```

## Files changed (PR #14 commit 28316b0)

- `src/components/chat/event-fast-path-context.tsx` (new)
- `src/components/chat/event-fast-path-panel.tsx` (new)
- `src/components/chat/geo-chat-shell.tsx`
- `src/components/chat/chat-center-panel.tsx`
- `src/hooks/use-event-search-fast-path.ts`
- `src/components/copilot/search-tool-renders.tsx`
- `e2e/screens/SCREEN-006-event-card.spec.ts`
- `src/app/api/copilotkit/[[...path]]/route.ts` (CodeRabbit blocker fix)
