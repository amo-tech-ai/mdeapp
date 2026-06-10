---
title: Café & tour listing research packs
date: 2026-05-28
---

# Listings — research packs (not executable tasks)

Markdown **content** used to seed Supabase. Execution: **[DATA-035](../../../data/tasks-data/data-035-cafe-listings-venue-anchor-seed.md)** (cafés) · **VEN-034** (tour seed).

## Café packs → DATA-035

| File | Neighborhood / scope |
|------|----------------------|
| [prompt-cafes.md](./prompt-cafes.md) | Research prompt / field checklist |
| [03-cafe-laureles.md](./03-cafe-laureles.md) | Laureles (primary) |
| [04-pablado-cafes.md](./04-pablado-cafes.md) | El Poblado |
| [03a-laureles.md](./03a-laureles.md) / [04a-poblado.md](./04a-poblado.md) | Supplements |
| [01-cafes.md](./01-cafes.md) / [02-cafes.md](./02-cafes.md) | Top-10 drafts — **verify** IG/web before prod |

## Coffee tour packs → VEN-034+

| File | Scope |
|------|--------|
| [prompt-tours.md](./prompt-tours.md) | Tour research prompt |
| [05-coffee-tours.md](./05-coffee-tours.md) … [06-coffee-tours.md](./06-coffee-tours.md) | Tour copy |

## Rules

1. **place_id** only from Places API verify — never guessed.
2. Hours / phone / Google photos → **DATA-008** cache, not invented in markdown.
3. Instagram / website / email → `venue_anchors.metadata.contact` after human or script verify.
4. ChatGPT/static image URLs in drafts are **not** production assets until replaced with Places photo refs or hosted CDN URLs.
