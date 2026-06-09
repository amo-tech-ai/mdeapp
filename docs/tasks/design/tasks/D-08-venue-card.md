---
id: D-08
linear: SAN-574
phase: 3
status: Todo
blocked_by: []
prerequisites_done: [D-02, D-03, D-05]
outputs:
  - mdeapp/src/components/browse/venue-card-shell.tsx
  - mdeapp/src/components/browse/BrowseLayout.tsx
  - mdeapp/scripts/san-574-scope-gate.sh
---

# D-08 — Shared browse system (VenueCard + BrowseLayout)

## Purpose

One card + one layout for restaurants, nightlife, cafés, rentals browse — image · name · rating · 2-line clamp · actions.

**Scope boundary:** Shared card/layout only. **No** sidebar nav activation, no new browse routes, no map/agent/API changes.

## Prerequisites (completed — not active blockers)

D-02, D-03, D-05 are **completed prerequisites**. They remain related history, not active blockers. SAN-462 soak Done (2026-06-05).

## Acceptance criteria

- [ ] `<VenueCard>` consolidates existing RestaurantCard / cafe / rental patterns (do **not** rebuild from zero)
- [ ] `<BrowseLayout>`: FilterBar · ResultsColumn · MapColumn (desktop split; mobile toggle)
- [ ] Image slot per D-03; tokens per D-02
- [ ] Card click → detail sheet (not Google-only Directions)
- [ ] **Existing CTA behavior preserved** (Details, Directions, Booking, Schedule Viewing)
- [ ] **Existing `data-testid`s preserved** on card surfaces
- [ ] **Empty/missing image state** does not break layout (blur-up + placeholder per D-03)
- [ ] **No route/sidebar activation changes** — do not flip `EXPLORE_ITEMS` hrefs
- [ ] **No new API calls**
- [ ] **No changes** under `src/mastra/**` or `src/app/api/copilotkit/**`
- [ ] `mapId` on parent `<Map>` where map column exists; FieldMask on Places calls
- [ ] **Existing Playwright suites pass with no selector changes**
- [ ] `scripts/san-574-scope-gate.sh` passes on PR diff

## shadcn debt (defer to SAN-575 / D-09)

SAN-574 preserves visual parity — **do not fix here**. Track for D-09 re-skin:

| Item | Current | Target (D-09) |
|------|---------|---------------|
| Card shell | Raw `<article>` in `VenueCardShell` | `Card` + `CardHeader` / `CardContent` / `CardFooter` |
| Footers | `border-t` divs | `CardFooter` or `Separator` |
| Filter chips | Styled `Link` + `aria-pressed` | `ToggleGroup` + `ToggleGroupItem` (add via CLI) |
| Empty states | `EmptyState` custom | shadcn `Empty` (add via CLI) or keep if testids differ |
| Map/direction links | Styled `<a>` | `Button variant="outline" size="sm"` + Link `render` |
| Button icons | `className="size-3.5"` on lucide | `data-icon="inline-start"` (drop manual sizes) |
| Media box | `h-24 w-24` | `size-24` or D-03 16:10 + `Skeleton` blur-up |
| Card radius | `rounded-lg` | nova `rounded-xl` + ring token |

**Fixed in SAN-574:** `BrowseLayout` filter stack uses `flex flex-col gap-3` (not `space-y-3`).

## Wireframe / spec references

- [`../README.md`](../README.md) §2A Browse system
- [`../mockups/cafes.html`](../mockups/cafes.html)
- [`../wireframes/real-estate/009-scr-rental-card-polish.md`](../wireframes/real-estate/009-scr-rental-card-polish.md)

## Legacy / dedup

- **Reuse:** SAN-360, SAN-437, shipped restaurant/rental/café cards
- **Absorb:** duplicate card shell tickets → SAN-574

## Proof

```bash
cd /home/sk/mdeai/mdeapp
npm run typecheck
npm run build
npm test -- cafe-result-card restaurant-card rental-card --run
npm run floor
```

### Browser proof (required)

Verify screenshots at:

- `/` (chat cards if visible)
- `/restaurants`
- Any rental card surface currently available in chat
- Mobile 375px · tablet 768px · desktop ≥1280px

## Suggested implementation order

1. Branch from fresh `main`.
2. Read the 3 existing card files.
3. Extract only common shell pieces.
4. Add `components/browse/venue-card-shell.tsx` (internal — no public `VenueCard`).
5. Add `components/browse/BrowseLayout`.
6. Migrate one card at a time; run targeted tests after each.
7. Before/after screenshots; PR states **no route/map/agent changes**.
