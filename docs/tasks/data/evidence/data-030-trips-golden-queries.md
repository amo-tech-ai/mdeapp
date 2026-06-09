---
task: data-030
date: 2026-05-29
project: zkwcbyxiwklihegjhuql
status: Done
---

# DATA-030 — Trips golden queries

Read-only SQL pack for TRIP-011 / TRIP-015 Done gates. Live sample: 2 trips, 4 trip_items.

## Q1 — User trips (dashboard)

```sql
SELECT id, title, status, start_date, end_date
FROM trips
WHERE user_id = :uid AND deleted_at IS NULL
ORDER BY start_date;
```

**Expected shape:** `id`, `title`, `status`, `start_date`, `end_date` — RLS scopes to owner.

## Q2 — Itinerary items (workspace)

```sql
SELECT id, item_type, title, start_at, end_at, latitude, longitude
FROM trip_items
WHERE trip_id = :trip_id
ORDER BY start_at NULLS LAST;
```

**Live sample (trip `11111111-1111-1111-1111-000000000001`):** 2 rental items.

## Q3 — Open conflicts

```sql
SELECT id, title, severity, status, affected_items
FROM conflict_resolutions
WHERE trip_id = :trip_id AND status IN ('detected', 'pending_review');
```

**Live:** 0 rows (table empty — valid MVP state).

## Q4 — Item count per trip (dashboard card)

```sql
SELECT trip_id, count(*) AS item_count
FROM trip_items
WHERE trip_id = ANY(:trip_ids)
GROUP BY trip_id;
```

**Live:** trip `…0001` → 2 items; trip `…0002` → 2 items.

## Q5 — RPC insert path (DATA-027)

```sql
-- Callable as authenticated trip owner:
SELECT insert_trip_item_for_user(
  :trip_id, 'restaurant', :restaurant_id, NULL, NULL, NULL
);
```

**Rule:** Mastra/tools must use RPC — not bypass RLS with service role in browser.

## Q6 — RLS negative (manual)

User B JWT must **not** `SELECT` trips where `user_id != auth.uid()`.

## EXPLAIN note

If **DATA-031** adds `(trip_id, start_at)` index, re-run `EXPLAIN` on Q2.
