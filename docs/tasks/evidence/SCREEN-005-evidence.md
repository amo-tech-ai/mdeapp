# SCREEN-005 evidence — 2026-05-24

## Commands

```text
npm run smoke:map-pins      → exit 0
npm run smoke:f50-pin-sync  → exit 0
npm run verify:console      → exit 0
npm run floor               → exit 0
npm run test:e2e:screens    → includes SCREEN-005 pass
```

## Chrome DevTools MCP

- Route: `http://localhost:3001/`
- Console: 0 critical
- Screenshots:
  - `mdeapp/tmp/screenshots/SCREEN-005/desktop-rental-cards.png`
  - `mdeapp/tmp/screenshots/SCREEN-005/desktop-schedule-modal.png`
  - `mdeapp/tmp/screenshots/SCREEN-005/mobile-rental-cards.png`

## Playwright

- Spec: `mdeapp/e2e/screens/SCREEN-005-rental-card.spec.ts`
- Desktop: ≥3 cards, Schedule CTA → modal, Save disabled, card↔pin sync
- Mobile: rental cards in center chat

## Workflow

Camila searches rentals → cards with CTAs → Schedule opens `schedule-viewing-modal` (submit still blocked until F47).
