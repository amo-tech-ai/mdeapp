# MAP-014 evidence — single ChatMap mobile mount

**Date:** 2026-05-25  
**Status:** Done

## Change

- `useIsLgUp()` hook (`src/hooks/use-is-lg-up.ts`) — Tailwind `lg` breakpoint via `useSyncExternalStore`
- `ChatMapPanel` — returns `null` when `< lg`; sole desktop mount
- `MapMobileSheet` — returns `null` when `≥ lg`; `ChatMap` only when sheet `open`

## Verification (localhost :3001)

| Check | Result |
|-------|--------|
| `curl http://localhost:3001/` | HTTP 200 |
| `npx playwright test e2e/maps-layout-mobile.spec.ts --project=chromium` | 3/3 pass |
| Mobile sheet open: `[data-testid="chat-map"]` count | **1** (assertion in spec) |
| `npm run smoke:map-pins` | 5 cards · 5 pins |
| `npm run floor` | exit 0 · **181** Vitest |
