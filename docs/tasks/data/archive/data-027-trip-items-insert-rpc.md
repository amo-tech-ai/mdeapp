---
task_id: data-027
mvp_step: 27
title: trip_items type CHECK extension + insert RPC
layer: DATA
priority: P1
status: Done
verified: 2026-05-29
evidence: ../evidence/data-027-trip-items-rpc.md
estimated_effort: 4h
depends_on: ["data-026"]
unblocks: ["TRIP-007", "data-028"]
skills: [mde-supabase, mastra]
related:
  - ../../trips/docs/01-audit.md
description: Extend item_type CHECK; SECURITY DEFINER RPC validates trip ownership + source entity exists.
---

# DATA-027 — trip_items insert hardening

## Live state (2026-05-29)

CHECK extended: `rental`, `event`, `restaurant`, `poi`, `showing`, `booking`, `custom_note`, `other`.

RPC `insert_trip_item_for_user` live with `SET search_path = public` (mde-supabase SECURITY DEFINER pattern).

## Migration (sketch)

```sql
ALTER TABLE public.trip_items DROP CONSTRAINT trip_items_item_type_check;
ALTER TABLE public.trip_items ADD CONSTRAINT trip_items_item_type_check
  CHECK (item_type IN (
    'rental','event','restaurant','poi','showing','booking','custom_note','other'
  ));
```

## RPC `insert_trip_item_for_user`

- Verify `auth.uid()` owns `trips.id`
- Validate source row exists for type (dynamic lookup)
- Upsert on conflict `unique_trip_item`
- Copy title, lat, lng, address from source

## Acceptance criteria

- [x] Migration applied via Supabase MCP
- [x] RLS unchanged on `trip_items`
- [ ] RPC callable from Mastra with user JWT — **app track** (TRIP-007)
- [ ] Negative test: wrong user → error — document in TRIP-007 evidence

## POST-MVP

- `trip_items.deleted_at` soft delete
