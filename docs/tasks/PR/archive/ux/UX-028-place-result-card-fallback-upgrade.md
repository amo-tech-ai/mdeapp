---
id: UX-028
title: PlaceResultCard minimum fallback upgrade
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
vercel: true
merged_pr: https://github.com/amo-tech-ai/mdeapp/pull/35
merge_sha: d9ce40c
linear: SAN-440
priority: P1
phase: Card unification — fallback quality
effort: 2-3h
owner: claude
depends_on: [UX-021]
blocks: []
risk: 🟢 Low
complexity: S
skill: [mde-task-lifecycle, shadcn, testing]
related:
  - ../tests/22-card-audit.md
description: Until RestaurantCard ships, upgrade PlaceResultCard — 64px glyph, Badge price, Button Maps CTA, onOpenDetails hook — audit R-08.
---

# UX-028 — PlaceResultCard fallback upgrade

## Purpose

Bridge quality gap for unknown/sparse categories and interim restaurant path.

## Changes

- 64×64 `bg-muted` + `MapPin` icon placeholder
- `priceLabel` → `<Badge variant="outline">`
- Maps link → `<Button size="sm" variant="outline">View on Maps</Button>`
- `overflow-hidden` on root
- Optional `onOpenDetails` for future panel

## Acceptance

- [ ] Fallback card visually closer to café cards.
- [ ] Used only when no domain-specific card (document in comment).
- [ ] Tests updated.

## Flow diagram

```mermaid
flowchart TD
  Sparse[Sparse tool payload] --> FB[PlaceResultCard fallback]
  FB --> Glyph[64px MapPin glyph]
  FB --> Badge[Price Badge]
  FB --> Maps[View on Maps Button]
```

## Shipped scope (2026-06-01) — SAN-440 / PR #35

Restaurant **hero photos** via Places `id,photos` + `/api/places/photo` proxy on `POST /api/restaurants/search` (not full PlaceResultCard UI polish).

| Gate | Result |
|------|--------|
| PR #35 merged `d9ce40c` | ✅ |
| Prod API El Poblado sample | ✅ PROXY URLs (not empty `imageUrl`) |
| Prod visual `01-restaurants.png` | ✅ [`visual-cards-prod/`](../../testing/evidence/visual-cards-prod/) |
| `restaurantPhotoPlaceholders` (synthetic) | ✅ 0 |

## Verification (2026-05-31) — original spec scope

| Claim | Result |
|-------|--------|
| Interim until UX-025 | ✅ Correct scope |
| Required testId today | 🔴 no default — fix in UX-021 |
