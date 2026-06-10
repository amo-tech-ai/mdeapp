---
task_id: ven-033
post_mvp_step: 033
title: restaurant.* schema — reservations, tables, availability, dietary tracking
layer: data
phase: PHASE-3-RESTAURANT
priority: P2
status: Open
estimated_effort: 1 day
area: backend
depends_on: [001-event-schema-migration]
unblocks: [ven-034]
skills: [supabase, supabase-postgres-best-practices, mdeai-project-gates]
edge_function: null
schema_tables:
  - restaurant.venues
  - restaurant.tables
  - restaurant.reservations
  - restaurant.availability_slots
  - restaurant.dietary_requirements
description: Native restaurant reservations schema (replaces external reservation_url redirect).
---

<!-- task-summary -->
> **What:** restaurant.* schema — reservations, tables, availability, dietary tracking
> **Why:** - [ ] All 5 tables created; `\dt restaurant.*` confirms. - [ ] `restaurant.reservations` UNIQUE constraint on `(table_id, reserved_date, reserved_time)` prevents double-booking. - [ ] RLS on all tables;…
> **Delivers:** migrations: `restaurant.venues`, `restaurant.tables`, `restaurant.reservations`, `restaurant.availability_slots`
> **Tools/Skills:** `supabase` · `supabase-postgres-best-practices` · `mdeai-project-gates`
> **PHASE-3-RESTAURANT · P2 · Open · Effort: 1 day**
> **Depends on:** 001-event-schema-migration

# VEN-033 — Data — restaurant reservations schema

## Summary

| Aspect | Details |
|---|---|
| **Phase** | PHASE-3-RESTAURANT — enables native restaurant reservations (replaces external `reservation_url` redirect) |
| **Schema** | New `restaurant` schema; 5 tables; RLS; race-safe booking via `EXCLUDE USING gist` or advisory lock |
| **Real-world** | Carlos (owner of El Cielo restaurant) sets his 20 tables, marks weekends fully booked, and publishes his menu + dietary options. Camila finds El Cielo on `/restaurants`, sees "2 tables available tonight", books a table for 2 at 8pm for Restaurant Week — no redirect to a third-party form |

## Schema

```sql
CREATE SCHEMA IF NOT EXISTS restaurant;

-- Maps to existing restaurants table in public schema
CREATE TABLE restaurant.venues (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   uuid NOT NULL UNIQUE REFERENCES restaurants(id) ON DELETE CASCADE,
  owner_id        uuid NOT NULL REFERENCES auth.users(id),
  total_tables    int NOT NULL DEFAULT 0,
  booking_enabled bool NOT NULL DEFAULT false,
  advance_days    int NOT NULL DEFAULT 30,  -- how many days ahead bookings open
  slot_duration_minutes int NOT NULL DEFAULT 90,
  min_party_size  int NOT NULL DEFAULT 1,
  max_party_size  int NOT NULL DEFAULT 8,
  created_at      timestamptz DEFAULT now()
);

-- Physical tables at the restaurant
CREATE TABLE restaurant.tables (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id        uuid NOT NULL REFERENCES restaurant.venues(id) ON DELETE CASCADE,
  table_number    text NOT NULL,
  capacity        int NOT NULL,
  is_accessible   bool NOT NULL DEFAULT false,
  section         text,  -- 'terrace', 'main hall', 'private room'
  UNIQUE (venue_id, table_number)
);
CREATE INDEX ON restaurant.tables (venue_id);

-- Availability windows (open/blocked per day-of-week or specific date)
CREATE TABLE restaurant.availability_slots (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id        uuid NOT NULL REFERENCES restaurant.venues(id) ON DELETE CASCADE,
  slot_date       date,            -- NULL = recurring rule
  day_of_week     int,             -- 0=Sunday … 6=Saturday; NULL = specific date only
  opens_at        time NOT NULL,
  closes_at       time NOT NULL,
  is_blocked      bool NOT NULL DEFAULT false,
  note            text
);
CREATE INDEX ON restaurant.availability_slots (venue_id, slot_date);

-- Reservations: one row per booking
CREATE TABLE restaurant.reservations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id        uuid NOT NULL REFERENCES restaurant.venues(id),
  table_id        uuid REFERENCES restaurant.tables(id),
  user_id         uuid REFERENCES auth.users(id),  -- nullable (guest booking)
  guest_name      text NOT NULL,
  guest_email     text NOT NULL,
  guest_phone     text,
  party_size      int NOT NULL,
  reserved_date   date NOT NULL,
  reserved_time   time NOT NULL,
  duration_minutes int NOT NULL DEFAULT 90,
  status          text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','seated','completed','cancelled','no_show')),
  special_requests text,
  confirmation_code text NOT NULL DEFAULT upper(substr(md5(random()::text), 1, 6)),
  stripe_payment_intent text,  -- if deposit required
  created_at      timestamptz DEFAULT now(),
  UNIQUE (table_id, reserved_date, reserved_time)  -- prevents double-booking
);
CREATE INDEX ON restaurant.reservations (venue_id, reserved_date, status);
CREATE INDEX ON restaurant.reservations (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX ON restaurant.reservations (guest_email);

-- Dietary requirements / preferences per reservation
CREATE TABLE restaurant.dietary_requirements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  uuid NOT NULL REFERENCES restaurant.reservations(id) ON DELETE CASCADE,
  requirement     text NOT NULL CHECK (requirement IN (
    'vegetarian','vegan','gluten_free','halal','kosher','nut_allergy',
    'dairy_free','shellfish_allergy','other'
  )),
  note            text
);
```

## RLS

```sql
ALTER TABLE restaurant.venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages venue"
  ON restaurant.venues FOR ALL
  USING (owner_id = (SELECT auth.uid()));
CREATE POLICY "public reads booking_enabled venues"
  ON restaurant.venues FOR SELECT
  USING (booking_enabled = true);

ALTER TABLE restaurant.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user sees own reservations"
  ON restaurant.reservations FOR SELECT
  USING (user_id = (SELECT auth.uid()) OR guest_email = current_setting('app.current_email', true));
CREATE POLICY "owner sees all reservations for venue"
  ON restaurant.reservations FOR SELECT
  USING (EXISTS (SELECT 1 FROM restaurant.venues v WHERE v.id = venue_id AND v.owner_id = (SELECT auth.uid())));
```

## Acceptance Criteria

- [ ] All 5 tables created; `\dt restaurant.*` confirms.
- [ ] `restaurant.reservations` UNIQUE constraint on `(table_id, reserved_date, reserved_time)` prevents double-booking.
- [ ] RLS on all tables; `get_advisors(security)` zero new ERRORs.
- [ ] FK indexes on all REFERENCES columns; `get_advisors(performance)` confirms.
- [ ] `npm run lint` zero new errors; `npm run build` clean.

## See also

- [`034-ven-supabase-restaurant-booking-edge-fn.md`](./034-ven-supabase-restaurant-booking-edge-fn.md) — the booking flow
- [`15-user-stories.md`](../15-user-stories.md) §8.3 — Vendor partner (Carlos) story
