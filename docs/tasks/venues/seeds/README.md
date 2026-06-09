---
title: Venues seed artifacts (redirect)
date: 2026-05-31
---

# Venues seeds — moved

**Canonical location:** [`../../../mdeapp/supabase/seeds/venues/`](../../../mdeapp/supabase/seeds/venues/) (workspace symlink: [`../../../supabase/seeds/venues/`](../../../supabase/seeds/venues/))

**Migrations (applied SQL):** [`../../../mdeapp/supabase/migrations/`](../../../mdeapp/supabase/migrations/)

| Task | Source artifact | Table |
|------|-----------------|-------|
| [DATA-035](../../data/tasks-data/data-035-cafe-listings-venue-anchor-seed.md) | `supabase/seeds/venues/cafes-medellin.*.json` | `venue_anchors` (kind=cafe) |
| [DATA-003](../../data/tasks-data/data-003-cafe-seed.md) | `supabase/seeds/venues/golden-queries-venues.json` | eval harness |
| [DATA-005](../../data/tasks-data/data-005-nightclub-seed.md) | `supabase/seeds/venues/nightclubs-medellin.*` | `venue_anchors` (kind=nightclub) |
| DATA-004 | verify-only (no CSV) | `restaurants` via `20260404044721_restaurants_seed.sql` |

**Listings source (human/LLM research):** [`../tasks/listings/`](../tasks/listings/)

**Schema:** [`../../data/supabase-plan.md`](../../data/supabase-plan.md) M2 `venue_anchors`
