# MAP-007B evidence — Mindtrip center chat layout

**Verified:** 2026-05-23

## Layout migration (Path B)

| Before (MAP-007 / F48) | After (MAP-007B) |
|--------------------------|------------------|
| `CopilotSidebar` edge chat | `CopilotChat` in center column |
| Canvas: nav · pin list · map | Canvas: nav · chat+results · map |
| Chat in sidebar ~40% | Chat centered in `flex-1` column |

**CopilotKit pattern:** `CopilotChat` from `@copilotkit/react-ui` v1.55.2 (not v2 headless). Runtime `/api/copilotkit` unchanged.

## Files changed

| File | Change |
|------|--------|
| `src/app/page.tsx` | Removed `CopilotSidebar`; `GeoChatShell` only |
| `src/components/chat/geo-chat-shell.tsx` | Header + nav drawer; no sidebar children |
| `src/components/chat/chat-canvas.tsx` | `280px \| flex-1 \| 420px` grid |
| `src/components/chat/chat-center-panel.tsx` | **New** — `CopilotChat` + query bar + pin strip |
| `src/components/chat/chat-query-bar.tsx` | **New** — sticky filter stub |
| `src/components/chat/chat-nav-drawer.tsx` | **New** — tablet/mobile nav sheet |
| `src/components/chat/map-mobile-sheet.tsx` | FAB `bottom-[7.5rem] right-4`; 75–85vh sheet |
| `src/app/globals.css` | Center chat CSS; removed sidebar width overrides |
| `e2e/maps-layout-*.spec.ts` | MAP-007B selectors |
| `playwright.config.ts` | `timeout: 150_000` for agent tests |

## Static / build gates

```
npm run lint        → exit 0
npm run typecheck   → exit 0
npm run build       → exit 0
npm run test        → 91/91
npm run floor       → exit 0
```

## Playwright (layout — no AI)

```bash
PW_SKIP_WEBSERVER=1 npx playwright test e2e/maps-layout-desktop.spec.ts \
  e2e/maps-layout-mobile.spec.ts e2e/maps-007b-evidence.spec.ts \
  --project=chromium --grep-invert "rental"
```

**8/8 pass** — nav left, center `.copilotKitChat`, map right, no `.copilotKitSidebar`, mobile input not covered by FAB, tablet nav drawer.

## Gate 9 — localhost

```
GET  http://localhost:3001/              → 200
POST http://localhost:3001/api/copilotkit → 400
```

## Screenshots

| File | Viewport |
|------|----------|
| `tasks/notes/MAP-007B-evidence-desktop-1440.png` | 1440×900 |
| `tasks/notes/MAP-007B-evidence-tablet-768.png` | 768×1024 |
| `tasks/notes/MAP-007B-evidence-mobile-390.png` | 390×844 |
| `tasks/notes/MAP-007B-evidence-mobile-sheet.png` | 390 sheet open |

## AI-dependent smokes (blocked this session)

```
npm run smoke:map-pins → timeout (no rental-card)
```

**Root cause:** Gemini API billing — `AI_APICallError: Lightning dunning decision is deny for project`. User message posts to center chat; agent does not return tool cards until billing restored.

**Re-run when billing OK:**

```bash
npm run smoke:map-pins
npm run smoke:f50-pin-sync
npm run smoke:grounding-attribution
PW_SKIP_WEBSERVER=1 npx playwright test e2e/maps-layout-desktop.spec.ts --grep rental
```

## Console verification (2026-05-23)

**Every task gate (G9):**

```bash
npm run verify:console:boot
```

```
✅ http://localhost:3001 boot console sweep
   layout: centerChat=true sidebar=false navVisible=1
   console errors (raw): 0
   console errors (layout-critical): 0
   console errors (env/billing): 0
✅ Boot console clean (no env blockers detected on idle load)
```

**Full turn (G10 — when Gemini billing OK):**

```bash
npm run verify:console
```

Blocked this session: `Lightning dunning deny` on GCP project `531320863311`. Boot gate passes without AI; full gate requires billing fix.

## verify:console (legacy note)

Superseded by G9/G10 above. Layout tests show no hydration/depth errors on `/`.

## Score

**88/100** — layout migration complete; −12 for Gemini billing blocking pin/card AI smokes this run.

## Status

**MAP-007B Done (layout)** — pending operator re-run of AI smokes after Gemini billing fix.
