# 07 — Supabase data smoke (read-only)

**Project:** `zkwcbyxiwklihegjhuql` · run via Supabase MCP or SQL editor — **no migrations in this pack**.

## Queries (safe read-only)

```sql
-- Rentals inventory
SELECT count(*) AS active_apartments FROM apartments WHERE deleted_at IS NULL;

-- Events inventory
SELECT count(*) AS published_events FROM events WHERE status = 'published' OR status IS NULL LIMIT 1;

-- Duplicate IDs in recent event search window (sanity)
SELECT id, count(*) FROM events GROUP BY id HAVING count(*) > 1 LIMIT 5;

-- RLS enabled on apartments
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'apartments';
```

## Verify

| # | Check |
|---|--------|
| 1 | `searchRentals` uses `apartments` (see `source: supabase` in API JSON) |
| 2 | Events from `events` table |
| 3 | No `SUPABASE_SERVICE_ROLE` in client bundles |
| 4 | RLS on user-facing tables |

Evidence: paste MCP/SQL output into `supabase-data-RESULTS.md`
