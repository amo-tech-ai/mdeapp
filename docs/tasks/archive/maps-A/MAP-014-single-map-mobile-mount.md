---
id: MAP-014
title: Single ChatMap instance — mobile conditional mount
status: Done
priority: P1
phase: MVP-hardening
effort: 2h
owner: claude
depends_on: [MAP-007B, MAP-008]
blocks: [SCREEN-018]
skill: [mde-maps, copilotkit-develop, testing]
audit_ref: ../audit/27-maps-audit.md §6 P1
prd_ref: ../../../plan/maps/maps-prd.md
---

# MAP-014 — Single ChatMap instance (mobile)

## At a glance

**Problem ([`27-maps-audit.md`](../audit/27-maps-audit.md)):** On mobile, `ChatMapPanel` stays mounted (`hidden lg:flex`) while `MapMobileSheet` mounts a **second** `ChatMap` — two Maps JS instances, extra memory/billing.

**Goal:** Exactly **one** `ChatMap` per `/` session — desktop right column **or** mobile bottom sheet, never both.

| Who | Effect |
|-----|--------|
| **Camila** (mobile) | Faster load; map opens in sheet without a hidden map warming in background |
| **Sofía** | One Maps API map instance in Playwright mobile specs |

## Build scope

### Frontend
- **`chat-canvas.tsx`** — conditional mount: `useMediaQuery('(min-width: 1024px)')` or CSS-only split so only one tree renders `ChatMap`.
- **`chat-map-panel.tsx`** — do not render `<ChatMap>` when viewport &lt; lg.
- **`map-mobile-sheet.tsx`** — own the sole mobile `ChatMap`; keep `MapResizeSignal` on sheet open.
- Preserve `data-testid="chat-map"` on the active instance only.

### Do not
- Change `MapContextProvider` ownership or pin merge logic.
- Add a second `APIProvider`.

## Acceptance criteria

1. Mobile viewport (&lt;1024px): `document.querySelectorAll('[data-testid="chat-map"]').length === 1` after sheet open.
2. Desktop (≥1024px): one `chat-map` in right panel; mobile sheet trigger hidden.
3. `npm run smoke:map-pins` + `npm run smoke:f50-pin-sync` pass unchanged.
4. `e2e/maps-layout-mobile.spec.ts` (or SCREEN-018 when added) — no duplicate map roots.
5. `npm run floor` exit 0.

## Verification

- Evidence: `tasks/notes/MAP-014-evidence.md` — mobile + desktop screenshot, DevTools count of map instances.
- Manual: Chrome device mode → Network → confirm single Maps bootstrap on load.

## Definition of Done

§4 acceptance + evidence + INDEX rows `status: Done`.
