# SCREEN-003 evidence — 2026-05-24

## Commands

```text
npm test -- chat-filter-chips  → pass
npm run floor                  → exit 0
npm run test:e2e:screens       → includes SCREEN-003 pass
```

## Chrome DevTools MCP

- Route: `http://localhost:3001/`
- Console: 0 critical
- Screenshots:
  - `mdeapp/tmp/screenshots/SCREEN-003/desktop-chips-active.png`
  - `mdeapp/tmp/screenshots/SCREEN-003/desktop-rental-after-chip.png`
  - `mdeapp/tmp/screenshots/SCREEN-003/mobile-chips.png`

## Playwright

- Spec: `mdeapp/e2e/screens/SCREEN-003-query-bar.spec.ts`
- Desktop: chip toggle `data-active` / `aria-pressed`; 6 chips; rental after Laureles chip
- Mobile: chips wrap, no horizontal overflow

## Workflow

Camila taps **Laureles** → chip active → sends rental query → cards render. Fix: optimistic local state in `chat-query-bar.tsx` until co-agent hydrates.
