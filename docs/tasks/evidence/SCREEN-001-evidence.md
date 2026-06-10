# SCREEN-001 evidence — 2026-05-24

## Commands

```text
npm test                    → 100/100 exit 0
npm run floor               → exit 0
npm run verify:console      → exit 0 (0 critical errors)
npm run smoke:map-pins      → exit 0 (5 cards, 6 pins)
npm run test:e2e:screens    → 13/13 pass (chromium, includes SCREEN-001)
```

## Chrome DevTools MCP

- Route: `http://localhost:3001/`
- Console: 0 critical (via Playwright `pageerror` + `verify:console`)
- Screenshots:
  - `mdeapp/tmp/screenshots/SCREEN-001/desktop-1280.png`
  - `mdeapp/tmp/screenshots/SCREEN-001/mobile-390.png`

## Playwright

- Spec: `mdeapp/e2e/screens/SCREEN-001-home-chrome.spec.ts`
- Desktop: pass (1280px — nav, center chat, map, query bar, workflow strip slot)
- Mobile: pass (390px — canvas, center panel, map sheet trigger)

## Workflow

Camila loads `/` → 3-panel Mindtrip shell visible → rental query keeps chrome regions + cards.
