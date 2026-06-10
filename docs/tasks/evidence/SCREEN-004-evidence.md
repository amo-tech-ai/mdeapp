# SCREEN-004 evidence — 2026-05-24

## Commands

```text
npm run smoke:map-pins   → exit 0
npm run verify:console   → exit 0
npm run floor            → exit 0
npm run test:e2e:screens → includes SCREEN-004 pass
```

## Chrome DevTools MCP

- Route: `http://localhost:3001/`
- Console: 0 critical
- Screenshots:
  - `mdeapp/tmp/screenshots/SCREEN-004/desktop-strip-running.png`
  - `mdeapp/tmp/screenshots/SCREEN-004/desktop-strip-complete.png`
  - `mdeapp/tmp/screenshots/SCREEN-004/mobile-strip-results.png`

## Playwright

- Spec: `mdeapp/e2e/screens/SCREEN-004-workflow-strip.spec.ts`
- Desktop: rental query → strip `data-kind=rental` (running or cards) → cards visible
- Mobile: strip attached during rental search

## Workflow

Tool generative render reports status → `WorkflowProgressStrip` shows rental steps → cards appear (Phase A — not Mastra SSE).
