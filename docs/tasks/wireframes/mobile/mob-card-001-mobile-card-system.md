---
id: MOB-CARD-001
linear: SAN-TBD
title: Mobile Card System — Touch Spacing + Carousels
status: Not Started
priority: P1
phase: MVP Phase 1 Polish
effort: 3h
milestone: M3
depends_on:
  - SCREEN-018
  - MOB-CHAT-001
skill:
  - mde-task-lifecycle
  - tailwind-responsive-ui
  - shadcn
playwright_spec: ../../../mdeapp/e2e/screens/MOB-CARD-001-mobile-cards.spec.ts
path: /
verified_against: 2026-06-02
---

# MOB-CARD-001 — Mobile Card System — Touch Spacing + Carousels

## Goal
Rental, event, and restaurant cards optimized for thumb reach on mobile; horizontal carousel with scroll-snap; image aspect ratio preserved; CTA buttons ≥ 44px; no card overflow at 390px.

## User story
As **Camila** on mobile, I swipe through rental cards horizontally in the chat results without cards overflowing or CTA buttons being too small to tap.

## Screen / path
`/` — chat response cards; `/events/[slug]` — event cards; `<390px` viewport

## Current status
**Not Started** — depends on SCREEN-018 (shell) and MOB-CHAT-001 (chat composer context).

**Integration note:** Cards render as CopilotKit tool call renders inside the chat message stream — they live in `src/components/copilot/*-card.tsx` and are wired via `useCopilotAction` render callbacks, NOT in an orphan `src/components/cards/` folder (that folder does not exist on disk).

## Build scope

### Frontend
- `src/components/copilot/rental-card.tsx` — verify + fix sizing (already exists)
  - `w-full` on mobile, `md:w-[320px]` on desktop
  - CTA button: `min-h-[44px] w-full` with `rounded-lg`
  - Image wrapper: `aspect-ratio: 16/9` + `overflow-hidden`; `<Image>` with `object-fit: cover`
  - `data-testid="rental-card"` — already present; verify sizing
- `src/components/copilot/event-card.tsx` — same sizing pass (already exists)
  - `data-testid="event-card"`
- `src/components/copilot/restaurant-card.tsx` — same sizing pass (already exists)
  - `data-testid="restaurant-card"`
- Horizontal carousel wrapper (new — add to tool render wrapper component, NOT a separate `cards/` folder)
  - Horizontal scroll: `-mx-4 px-4 flex gap-3 overflow-x-auto scroll-snap-type-x-mandatory`
  - Each card item: `scroll-snap-align: start; flex-shrink: 0; w-[calc(100%-2rem)]` (single card visible)
  - `touch-action: pan-x` on carousel wrapper (allow horizontal swipe, block vertical interference)
  - `scrollbar-hide` utility (`scrollbar-width: none`)
  - `data-testid="card-carousel"`
  - **Integration point:** wrap the `results` array render in `rich-card-results-context.tsx` or the fast-path panel components
- Desktop layout: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` in non-carousel context

### Images
- All card images: `next/image` with `sizes="(max-width:768px) 100vw, 320px"`, `loading="lazy"` below fold
- Aspect-ratio set on wrapper element (not just image) to prevent CLS on image load

### Supabase / Mastra
- None

## Acceptance criteria
- [ ] Cards render full-width (`w-full`) at 390px viewport — no horizontal overflow
- [ ] CTA buttons ≥ 44px height on all card types (`data-testid` verified in Playwright)
- [ ] Carousel swipe is smooth with `scroll-snap-type: x mandatory` on container
- [ ] Scroll-snap stops cleanly at each card boundary (no partial cards visible mid-snap)
- [ ] Card images maintain 16:9 aspect ratio — no layout shift on image load (aspect-ratio set on wrapper)
- [ ] Text not truncated mid-word — uses `line-clamp-2` or `truncate` appropriately
- [ ] Horizontal overflow prevented (no `overflow-x: visible` escape on any card ancestor)
- [ ] Card shadow not clipped — parent does not have `overflow: hidden` without accounting for shadow
- [ ] `data-testid="card-empty-state"` visible on mobile when no results
- [ ] Card skeleton renders in <300ms before data arrives (LCP goal)
- [ ] Desktop grid layout activates at `md:768px` — verified in Playwright at 800px viewport
- [ ] 0 console errors on card render + carousel swipe

## Tests
```bash
cd mdeapp && npm test -- --run
npm run lint
npm run typecheck
npm run build
npm run verify:console
npm run floor
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/MOB-CARD-001-mobile-cards.spec.ts --project=chromium
```

## Evidence required
- [ ] Screenshot: carousel at 390px — full-width cards, swipe in progress
- [ ] Screenshot: desktop grid layout at 1024px
- [ ] Playwright mobile spec pass (chromium + webkit)

## Dependencies
- SCREEN-018 (shell with safe areas — not yet Done)
- MOB-CHAT-001 (chat composer)

## Runtime proof (dev restart + Browser)

### Step 1 — Restart dev server
```bash
lsof -ti :3001 | xargs -r kill -9
cd mdeapp && npm run dev
```
Probe:
```bash
curl -s -o /dev/null -w "MOB-CARD-001 → %{http_code}\n" --max-time 15 -L http://localhost:3001/
```

### Step 2 — Browser MCP proof
| Step | Action | Pass |
|------|--------|------|
| 1 | Navigate `http://localhost:3001/` at 390×844 | Cards render full-width |
| 2 | Swipe carousel | Cards snap to boundaries |
| 3 | Measure CTA button | ≥ 44px height via `getBoundingClientRect` |
| 4 | Resize to 1024px | Grid layout activates |
| 5 | Console check | 0 errors |

---

## Card layout transformation

```mermaid
flowchart LR
    subgraph Mobile["Mobile < 768px"]
        A[Card carousel\nhorizontal scroll-snap\nw-full cards]
    end
    subgraph Tablet["Tablet 768–1023px"]
        B[2-column grid\nmd:grid-cols-2\nw-[320px] cards]
    end
    subgraph Desktop["Desktop ≥ 1024px"]
        C[3-column grid\nlg:grid-cols-3\nw-[320px] cards]
    end
    Mobile -->|viewport grows| Tablet
    Tablet -->|viewport grows| Desktop
```

## Common failure points
1. **iOS momentum overscroll** — iOS carousel scrolls past last card and bounces back; set `overscroll-behavior-x: contain` on the carousel wrapper to contain momentum to the carousel itself.
2. **`touch-action` vs pointer-events conflict** — setting `touch-action: pan-x` on the carousel prevents vertical scroll on the carousel element; nested card links must not override this or drag-to-scroll breaks.
3. **Card shadow clipped by `overflow: hidden`** — if a parent container (e.g., the chat message bubble) has `overflow: hidden`, box-shadows on cards are clipped; use `overflow: clip` + `overflow-clip-margin` or restructure shadow to be inset.
4. **Image CORS error shows broken icon** — `next/image` from an external domain needs that domain in `next.config.ts` `images.remotePatterns`; a missing pattern shows a broken 400px-wide broken image icon.
5. **CLS from unsized images** — without `aspect-ratio` on the wrapper, images load with 0 height, then jump to full height causing CLS > 0.1; always set aspect-ratio on the parent `div`, not just on `<Image>`.

## Done gate (all required)
- [ ] Dev server restarted clean
- [ ] Browser MCP: navigate + snapshot + console clean + screenshot
- [ ] Playwright spec pass (chromium + webkit)
- [ ] `npm run floor` exit 0
- [ ] Screenshots under `mdeapp/tmp/screenshots/MOB-CARD-001/`

## Do not do
- Do not use hardcoded `gray-*` Tailwind shades — use oklch design tokens from `globals.css`
- Do not render desktop grid on mobile (stack or carousel only)
