# SCREEN-006 evidence — 2026-05-24

## Commands

```text
npm test                  → 101/101 (includes event-card.test.tsx)
npm run floor             → exit 0
npm run test:e2e:screens  → 17/17 (includes SCREEN-006)
npm run smoke:map-pins    → exit 0
npm run verify:console    → exit 0
```

## Chrome DevTools MCP

- Route: `http://localhost:3001/`
- Events chip + salsa query → ≥1 `event-card`, Buy tickets → `/events/{id}`
- Event pins on map; Details opens SCREEN-007 sheet with pin selected

## Playwright

- Spec: `mdeapp/e2e/screens/SCREEN-006-event-card.spec.ts`
- Desktop: cards, buy CTA href, map pins, details → venue sheet
- Mobile: event cards in center chat
- Screenshots:
  - `mdeapp/tmp/screenshots/SCREEN-006/desktop-event-cards.png`
  - `mdeapp/tmp/screenshots/SCREEN-006/mobile-event-cards.png`

## Vitest

- `mdeapp/src/components/copilot/__tests__/event-card.test.tsx` — SSR render from F15 tool JSON

## Workflow

Andrés asks for salsa events → `search-events` tool → `EventCard` in chat + event pins → Buy tickets links to `/events/{id}` (SCREEN-014 route next).
