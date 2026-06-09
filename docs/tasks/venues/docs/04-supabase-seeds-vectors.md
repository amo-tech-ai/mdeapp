---
doc_id: VENUES-SUPABASE-V1
title: Supabase schema, seeds, pgvector
version: 1.0.0
date: 2026-05-27
skills: [mde-supabase, gemini, pgvector]
parent: ./README.md
---

# Supabase, seeds, vectors

## Table audit (2026-05-27)

| Table | Rows (approx) | Venues use |
|-------|---------------|------------|
| `public.restaurants` | 44 | Restaurant cards, detail, booking metadata |
| `public.restaurant_embeddings` | 43 | VEC rerank (Phase B) |
| `public.place_details_cache` | varies | Places detail API cache |
| `public.places_search_cache` | varies | Text search cache |
| `public.bookings` | generic | **Not** Phase 1 WA requests |
| `public.whatsapp_*` / `wa_outbox` | empty | VEN-005 outbound |
| `public.approval_requests` | exists | Patricia gate |

**Missing:** `venue_booking_requests` → **VEN-001**.

---

## VEN-001 — `venue_booking_requests`

**Supersedes:** [`../archive/CAFE-001-booking-requests-schema.md`](../archive/CAFE-001-booking-requests-schema.md) (cafe-only draft).

### RLS (minimum)

| Policy | Rule |
|--------|------|
| `select_own` | `auth.uid() = user_id` |
| `insert_own` | authenticated user, own row |
| `admin_all` | Patricia role via `profiles.role = admin` |

Enable RLS on create. Migration in [`supabase/migrations/`](../../../supabase/migrations/).

### Indexes

- `(user_id, created_at desc)`
- `(status)` where status in pending/sent/needs_user
- `(google_place_id)` for venue ops

---

## Seeds

| Task | Action |
|------|--------|
| **VEN-006** | Expand `restaurants` Medellín seed; backfill `google_place_id` |
| **VEN-009** | Cron: Places backfill for rows missing hours/phone |
| Café listings | Prompt packs [`../cafes/listings/`](../cafes/listings/) — manual or OpenClaw draft |

**Never** seed lat/lng from LLM — Places or verified CSV only.

---

## pgvector path (VEC-001 → VEC-005)

Before enabling semantic rerank on café/restaurant search:

| Step | Task | Gate |
|------|------|------|
| 1 | VEC-001 inventory | Which tables have embeddings |
| 2 | VEC-002 dimension check | 768 vs 1536 vs model change |
| 3 | VEC-003 HNSW / IVFFlat | query latency budget |
| 4 | VEC-004 eval set | 20 Medellín queries, human labels |
| 5 | VEC-005 tool flag | `search-restaurants` `useVector: true` behind flag |

**Embedding model:** align with `gemini-3.5-flash` embedding API per gemini skill — re-verify model id before migration.

### Query pattern (Phase B)

```sql
SELECT r.*, 1 - (e.embedding <=> query_embedding) AS score
FROM restaurants r
JOIN restaurant_embeddings e ON e.restaurant_id = r.id
ORDER BY e.embedding <=> query_embedding
LIMIT 10;
```

---

## `public.bookings` — future unification

Phase 3+ may map confirmed `venue_booking_requests` → `bookings` with `booking_type = 'restaurant'`. Until then, keep ledgers separate to avoid false "confirmed" UX.

---

## Related

- [`02-booking-whatsapp.md`](./02-booking-whatsapp.md)
- [`../../vector/`](../../vector/) — VEC tasks
- [`prd-venues.md`](./prd-venues.md) §6
