---
id: MAP-023
title: Static Maps API — event location previews + OG images
status: Not Started
priority: P3
phase: Post-MVP marketing
effort: 2h
owner: claude
depends_on: [MAP-004]
blocks: []
skill: [mde-maps, mde-vercel, nextjs]
checklist_ref: ./maps-checklist.md #10
prd_ref: ../../plan/maps/maps-prd.md
personas: [Roberto, Tourist]
official_docs:
  - https://developers.google.com/maps/documentation/maps-static/overview
target_files:
  - /home/sk/mdeai/mdeapp/src/lib/maps/static-map-url.ts
  - /home/sk/mdeai/mdeapp/src/app/api/og/event/route.tsx
  - /home/sk/mdeai/mdeapp/src/app/host/events/[id]/page.tsx
---

# MAP-023 — Static Maps event previews

## At a glance

**Description:** Generate **mini map thumbnails** and **Open Graph images** for Roberto’s events using the **Maps Static API** — venue pin on a styled map image for share cards, WhatsApp link previews, and SEO.

**Purpose:** **Roberto** shares an event link; recipients see **where it is** without opening the app. Low effort, high marketing value.

| Surface | Effect |
|---------|--------|
| Event detail `/host/events/[id]` or public `/events/[slug]` | Location thumbnail in preview card |
| OG / Twitter card | Map + title composite image |
| WhatsApp / iMessage unfurl | Rich preview with map strip |

## Architecture

```text
Event row (lat/lng or place_id from MAP-010)
  → server helper staticMapUrl({ center, zoom, marker })
  → signed URL built server-side only (GOOGLE_MAPS_API_KEY or dedicated Static key)
  → <Image> or og:image in route handler
```

**Security:**

- Static API key **server-only** — never `NEXT_PUBLIC_*`.
- Prefer **signed URLs** or server-side proxy route if key must stay off CDN query strings.
- Rate-limit OG route if public (reuse patterns from `/api/places/photo`).

## Helper spec

`staticMapUrl(params)`:

| Param | Default |
|-------|---------|
| `center` | Event venue lat/lng |
| `zoom` | `15` |
| `size` | `600x300` (OG) / `400x200` (card) |
| `scale` | `2` for retina OG |
| `maptype` | `roadmap` |
| `markers` | `color:red\|{lat},{lng}` |

Use **`map_id`** if Static API supports styled maps with project Map ID — else default roadmap.

**Field mask N/A** — Static API is separate SKU from Places Details.

## Workflows

1. MCP / docs verify Static API params + billing (per-request).
2. Implement `static-map-url.ts` + Vitest (URL shape, no key leak in returned client props).
3. Add `opengraph-image` or `/api/og/event?id=` route — composite title + static map (optional: `@vercel/og`).
4. Wire event public page `metadata.openGraph.images`.
5. Manual: paste event URL in WhatsApp debugger / Twitter card validator — screenshot in evidence.

## Acceptance criteria

1. Public event with venue coords → OG image includes map marker (or static map segment).
2. `rg GOOGLE_MAPS mdeapp/src/components` → no Static key in client bundle.
3. Missing coords → graceful fallback (title-only OG, no broken image).
4. `npm run floor` green.

## Verification checklist

> Evidence: `tasks/notes/MAP-023-evidence.md`

- [ ] Vitest: `staticMapUrl` encodes center + marker
- [ ] OG route returns 200 + image content-type for fixture event
- [ ] Card validator screenshot (or local curl + file size check)
- [ ] Patricia note: Static API enabled on GCP project + budget alert

## Out of scope

- Interactive map on share page (vis.gl — already MAP-001)
- Dynamic Maps JS in OG iframe
- Rental listing OG (Camila — Phase 2 reuse helper)
- Custom map styling beyond Map ID

## Rollback

Remove OG route + metadata; event pages fall back to text-only previews.

## Definition of Done

§ acceptance + evidence. Commit: `feat(maps): Static Maps OG previews for events (MAP-023)`.
