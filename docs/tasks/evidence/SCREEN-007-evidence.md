# SCREEN-007 evidence — 2026-05-24

## Commands

```text
npm run floor             → exit 0
npm run test:e2e:screens  → 17/17 (includes SCREEN-007)
npm run smoke:f50-pin-sync → exit 0
npm run verify:console    → exit 0
```

## Chrome DevTools MCP

- Route: `http://localhost:3001/` overlay
- Rental Details → `venue-detail-sheet` (title, price, neighborhood)
- Map pin focused (`data-selected` + visible map pin)
- Schedule in sheet → `schedule-viewing-modal`; Cancel closes modal; Escape closes sheet
- Chat thread intact after close

## Playwright

- Spec: `mdeapp/e2e/screens/SCREEN-007-venue-sheet.spec.ts`
- Desktop: card → sheet → pin sync → close → schedule modal flow
- Mobile: full-width sheet from card body click
- Screenshots:
  - `mdeapp/tmp/screenshots/SCREEN-007/desktop-venue-sheet.png`
  - `mdeapp/tmp/screenshots/SCREEN-007/mobile-venue-sheet.png`

## Workflow

Camila clicks rental Details → sheet with amenities/schedule CTA → Schedule opens SCREEN-008 modal shell (submit still F47).
