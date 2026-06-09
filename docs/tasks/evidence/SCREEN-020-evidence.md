# SCREEN-020 evidence

**Verified:** 2026-05-20

## Dev server

- Port: `:3001` (shared with SCREEN-019 run)

## Browser MCP (Cursor)

- Skip link `Skip to main content` present in a11y tree
- Regions labeled: Concierge navigation, Concierge chat, Search results on map, Medellín map
- `Open map` button has accessible name

## Playwright

```bash
cd mdeapp && PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-020-a11y.spec.ts --project=chromium
```

**Result:** 4/4 pass

| Test | Pass |
|------|------|
| Skip link → `#main-content` | ✅ |
| Nav/chat/map aria labels + `aria-live` on chat | ✅ |
| Checkout modal Esc closes | ✅ |
| Map FAB `aria-label` | ✅ |

## A11y changes

- Global skip link in `layout.tsx`
- `#main-content` on home `<main>`
- `#copilot-chat-region` + `aria-live="polite"` on concierge chat
- `#chat-map` skip target fixed
- Skip to chat link in nav rail
- Modal focus trap + Esc (`useModalA11y`) on checkout + schedule viewing
- Host wizard chat region `aria-live`
- Map FAB dynamic `aria-label` with pin count

## Floor

Shared with SCREEN-019 — exit 0 · 135/135 Vitest

## Screenshots

`mdeapp/tmp/screenshots/SCREEN-020/` (Playwright capture)
