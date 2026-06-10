---
task: data-027
date: 2026-05-29
project: zkwcbyxiwklihegjhuql
status: Done
---

# DATA-027 — trip_items CHECK + RPC evidence

## Migration

Applied live: `data027_trip_items_check_and_rpc`

## CHECK extended

Allowed types: `rental`, `event`, `restaurant`, `poi`, `showing`, `booking`, `custom_note`, `other`

## RPC

`public.insert_trip_item_for_user(trip_id, item_type, source_id, title?, start_at?, end_at?)`

- SECURITY DEFINER, `search_path = public`
- Validates `auth.uid()` owns trip
- Validates source row for typed items
- Upsert on `unique_trip_item (trip_id, item_type, source_id)`
- GRANT EXECUTE to `authenticated`

## RLS

Unchanged — RPC runs as definer but enforces ownership in function body.
