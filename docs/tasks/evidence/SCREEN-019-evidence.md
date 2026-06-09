# SCREEN-019 evidence

**Verified:** 2026-05-20

## Dev server

- Command: `E2E_BYPASS_AUTH=1 npm run dev:ui` from `mdeapp/`
- Port: `:3001` Ready

## Route probes

| Route | HTTP |
|-------|------|
| `GET /` | 200 |
| `GET /events/does-not-exist-019` | 404 |

## Browser MCP (Cursor)

- `/` — skip link, `No pins yet`, `Map is ready` empty overlays visible
- Console: clean on load

## Playwright

```bash
cd mdeapp && PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-019-empty-error.spec.ts --project=chromium
```

**Result:** 4/4 pass (desktop home empty, event 404, checkout error, mobile map sheet empty)

## Floor

```bash
cd mdeapp && npm run floor
```

**Result:** exit 0 · **135/135** Vitest

## Surfaces covered

| Surface | testid |
|---------|--------|
| `/` map empty | `map-empty-state`, `map-empty-state-card` |
| `/` results empty | `results-empty` |
| `/` nav threads | `nav-threads-empty` |
| Mobile map sheet | `map-mobile-empty-state` |
| Tool loading | `tool-cards-loading` (skeleton) |
| Tool empty | `rentals-empty`, `events-empty`, etc. |
| Tool error | `tool-error-chip` |
| Workflow error | `workflow-error` |
| Event 404 | `event-not-found` |
| Checkout error | `booking-checkout-error` (modal stays open) |
| Schedule error | `schedule-viewing-error` |

## Screenshots

`mdeapp/tmp/screenshots/SCREEN-019/` (Playwright capture)
