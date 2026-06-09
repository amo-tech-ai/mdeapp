---
id: EVP-024-mvp
linear: SAN-127
legacy_id: EVT-D06
title: Places API enrichment for discovered events
status: Not Started
priority: P2
phase: Post-MVP
effort: 2d
depends_on: [EVP-022-mvp-event-discovery-workflow]
parent_pack: EVP-018-mvp-event-web-discovery-task-pack.md
plans:
  - ../../plan/events/event-discovery/10-event-discover-plan.md §11
skill:
  - mde-maps
  - mde-supabase
---

# EVP-024-mvp — Places enrichment

> Implements plan 10 **EVD-06** + `mde-maps` enrichment mask (`places.id`, `googleMapsLinks`, `location`). Reuse `mdeapp/src/mastra/lib/google-places-client.ts`.

## Per discovered event

- Resolve venue → `place_id`
- lat/lng, formatted address
- `googleMapsLinks.placeUri` when available
- Rating, photos (field-masked)
- Distance from user neighborhood (Laureles default)
- Map pin in `MapContext`

## Hard rules

- Every Places call includes `X-Goog-FieldMask`
- Server-side keys only
- `<AdvancedMarker>` parent `<Map mapId=…>`

## Acceptance criteria

- [ ] Enrichment step unit tested with fixture
- [ ] ≥80% approved candidates get `place_id` + lat/lng (plan 10 gate)
- [ ] Missing place → candidate stays `discovery_status=candidate`, no fake pin
- [ ] `npm run verify:maps` or maps floor passes
