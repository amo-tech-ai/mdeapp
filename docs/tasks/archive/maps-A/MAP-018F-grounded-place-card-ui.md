---
id: MAP-018F
title: GroundedPlaceCard — Mindtrip-style UI for search-grounded-places
status: Done
priority: P0
phase: MVP — MAP-018 track
effort: 3-4h
owner: claude
depends_on: [MAP-018C, MAP-018D, MAP-015]
blocks: []
parent: MAP-018
skill: [mde-maps, copilotkit-develop, shadcn, testing]
design_ref: ../../../screenshots/mindtrip/01-mindtrip.png
---

# MAP-018F — GroundedPlaceCard UI

## At a glance

**Camila:** Café results look like a travel app — **thumbnail, stars, review count, price chip, open/closed, one-line why, Open in Google Maps** — not a plain text box.

**Goal:** New `GroundedPlaceCard` used by `groundedRender` in `search-tool-renders.tsx`; keep `PlaceResultCard` for restaurants/attractions until enriched.

## UI fields (from tool output)

| UI element | Prop source |
|------------|-------------|
| Thumbnail | `/api/places/photo?name={photoName}` or neutral placeholder |
| Title | `title` / `displayName` |
| Rating | `rating` + `userRatingCount` → "4.6 (128)" |
| Price | `priceLevel` → `$`–`$$$$` chip |
| Hours | `openNow` → "Open now" / "Closed" |
| Type | `primaryType` → "Café" chip |
| Blurb | `summary` or agent prose fallback |
| Maps CTA | `mapsUrl` → **Open in Google Maps** |
| Map sync | `pinId` + `onSelect` — requires **MAP-015** |

## Files to modify

| File | Change |
|------|--------|
| `mdeapp/src/components/copilot/grounded-place-card.tsx` | **New** |
| `mdeapp/src/components/copilot/search-tool-renders.tsx` | `groundedRender` → `GroundedPlaceCard` |
| `mdeapp/src/components/chat/chat-results-column.tsx` | Optional layout tweak |
| `mdeapp/e2e/maps-grounding.spec.ts` | Assert rating/photo testid |
| `mdeapp/src/components/copilot/__tests__/grounded-place-card.test.tsx` | **New** |

## Env vars

| Var | Notes |
|-----|-------|
| `NEXT_PUBLIC_RICH_GROUNDED_CARDS` | Optional `true`/`false` rollback — default `true` when 018F ships |

## Security

- No server keys in component.
- Photo only via 018D proxy path.
- External link: `rel="noopener noreferrer"`.

## Tests

- Vitest: renders rating when prop set; placeholder when no photo.
- Playwright www/local: café query → `grounded-card` has non-generic title + rating text OR placeholder class.
- `npm run floor` exit 0.

## Success criteria

1. www *"list cafés in Laureles"* → ≥1 card with image or placeholder + rating when 018B live.
2. 0 cards titled only `"Place"` when MCP returns attribution.
3. Maps link present on every card with `mapsUrl`.
4. Card click pans map (MAP-015).

## Rollback

`NEXT_PUBLIC_RICH_GROUNDED_CARDS=false` → revert to `PlaceResultCard` in `groundedRender`.

## Post-ship follow-on — deep-link CTAs

> **Status:** 018F MVP is **Done** (`mapsUrl` → place page only). **Execute [**MAP-019**](./MAP-019-google-maps-link-ctas.md)** after MAP-004 §12 mask ships.

| CTA | Prop | Priority |
|-----|------|----------|
| Open in Google Maps | `mapsUrl` (`placeUri`) | ✅ |
| Get directions | `directionsUrl` | **P1** — MAP-019 |
| Read reviews | `reviewsUrl` | **P2** — MAP-019 |

## Do not

- Embed Places UI Kit web components (CopilotKit owns layout).
- Fetch Places from browser.
