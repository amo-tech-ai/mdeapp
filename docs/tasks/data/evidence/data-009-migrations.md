---
task: data-009
date: 2026-05-29
project: zkwcbyxiwklihegjhuql
status: Done
---

# DATA-009 — M1/M2/M3 migration evidence

## Applied (live Supabase MCP)

| Step | Migration name | Result |
|------|----------------|--------|
| M1 | `data009_venue_booking_requests` | ✅ |
| M2 | `data009_venue_anchors_m2` | ✅ (retry after schema_migrations version clash) |
| M3 | `data009_apartments_price_daily_indexes` | ✅ |

## Post-apply verification

### Tables + RLS

| Table | RLS | Policies |
|-------|-----|----------|
| `venue_booking_requests` | on | 3 |
| `venue_anchors` | on | 2 |

### Indexes (apartments)

- `idx_apartments_price_daily_active`
- `idx_apartments_rental_search_daily`

### EXPLAIN (Camila rental query)

```text
Index Scan using idx_apartments_rental_search_daily on apartments
  Index Cond: ((neighborhood = 'Laureles') AND (bedrooms = 2) AND (price_daily <= 100))
```

## Repo sync pending

SQL copies in [`migrations/`](./migrations/) — commit to `supabase/migrations/` with `MDEAI_ALLOW_MIGRATION_EDIT=1`.

## Unblocks

DATA-003, DATA-005, DATA-035 (venue_anchors), DATA-008 (booking table exists).
