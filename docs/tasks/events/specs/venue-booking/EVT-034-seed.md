---
id: EVT-034
linear: SAN-493
status: Ready for review · verified local :54322 2026-06-09
persona: Patricia (seed), Camila (anon browse), Roberto (proposal target)
updated: 2026-06-09
depends_on: SAN-492 · EVT-033 (migration applied on target env)
canonical_model: ../../data/VENUE-DATA-MODEL.md
---

# EVT-034 — Seed Mamacita + 5 event venue partners

**Linear:** [SAN-493](https://linear.app/sanjiovani/issue/SAN-493/evt-034-seed-mamacita-5-event-partners)

**Gate:** Run **only after** `20260609120000_san492_event_venue_offerings.sql` is applied on the target environment (staging before prod).

---

## Why this spec exists (audit E1)

Live prod today: **2 partners, both `status='draft'`, 0 `type='venue'`, 0 `partner_locations`.**

Public RLS + `bookings_validate_event_resource()` require:

| Field | Required value | If wrong |
|-------|----------------|----------|
| `partners.type` | `'venue'` | Wrong identity / ops path |
| `partners.status` | `'active'` | Anon sees **zero** venues (`partner_is_active` false) |
| `partner_locations.accepts_event_bookings` | `true` | Filtered from public SELECT |
| `partner_locations.is_verified` | `true` | Filtered from public SELECT + trigger rejects proposals |
| `partner_locations.google_place_id` | unique per `(partner_id, place_id)` | Seed dedupe / second insert fails |

---

## Seed targets (6 venue partners)

| # | Display name | Neighborhood | Role in demo |
|---|--------------|--------------|--------------|
| 1 | **Mamacita** | Provenza | Primary CTA demo (SAN-494) — must have ≥1 offering + ≥1 package |
| 2 | Rooftop Laureles | Laureles | Secondary browse |
| 3 | El Patio Envigado | Envigado | Capacity band variety |
| 4 | Garden El Poblado | El Poblado | Corporate offering |
| 5 | Terrace Manila | Manila | Birthday offering |
| 6 | Studio Ciudad del Rio | Ciudad del Rio | Standing-capacity venue |

**Minimum bar:** 6 `partners` + 6 `partner_locations` + Mamacita has ≥1 row in `venue_event_offerings` and ≥1 in `venue_event_packages`.

---

## Required row shape

### `partners` (INSERT — do not reuse draft host rows)

```sql
-- pattern per venue (service_role or migration seed script)
INSERT INTO public.partners (id, name, type, status, slug, ...)
VALUES (
  '<deterministic-uuid>',           -- document in seed script header
  'Mamacita',
  'venue'::partner_type,
  'active'::partner_status,         -- REQUIRED — draft partners are invisible to anon
  'mamacita-provenza',
  ...
);
```

### `partner_locations`

```sql
INSERT INTO public.partner_locations (
  id, partner_id, label, address, neighborhood,
  lat, lng, google_place_id,
  accepts_event_bookings, is_verified,
  capacity_seated, capacity_standing,
  is_primary
) VALUES (
  '<location-uuid>',
  '<partner-uuid>',
  'Mamacita Provenza',
  '<street address>',
  'Provenza',
  6.2088, -75.5672,
  'ChIJ...',                        -- real Places ID from google-maps MCP
  true,                             -- REQUIRED
  true,                             -- REQUIRED
  80, 120,
  true
);
```

### `venue_event_offerings` (Mamacita + at least 2 others)

```sql
INSERT INTO public.venue_event_offerings (
  partner_location_id, offering_key, event_types, amenities, minimum_spend, price_per_person_from
) VALUES (
  '<mamacita-location-uuid>',
  'birthday',
  ARRAY['birthday','celebration'],
  ARRAY['rooftop','dj booth'],
  5000000, 85000
);
```

### `venue_event_packages` (Mamacita minimum)

```sql
INSERT INTO public.venue_event_packages (
  partner_location_id, name, description, price_from, min_guests, max_guests
) VALUES (
  '<mamacita-location-uuid>',
  'Rooftop Celebration',
  'Private rooftop with DJ and welcome cocktails',
  3500000, 20, 80
);
```

---

## Deterministic UUIDs (dev/staging)

Document fixed UUIDs in the seed script header (e.g. `supabase/seed/san493_event_venues.sql` or `scripts/seed/san493-event-venues.mjs`) so Playwright and RLS smoke fixtures stay stable.

Suggested namespace: `00000000-0000-4001-8xxx-xxxxxxxxxxxx` (dev-only; never collide with prod).

---

## Verification matrix

| Check | Command / assert |
|-------|------------------|
| Anon sees Mamacita | `SET ROLE anon; SELECT count(*) FROM partner_locations WHERE accepts_event_bookings AND is_verified AND id::text LIKE '00000000-0000-4001-820%';` → ≥6 |
| Draft partner invisible | Seed one `status='draft'` location → anon count unchanged |
| Offerings public | `SELECT count(*) FROM venue_event_offerings;` as anon → ≥3 |
| Mamacita packages | `SELECT count(*) FROM venue_event_packages pl JOIN partner_locations l ON l.id = pl.partner_location_id WHERE l.label ILIKE '%Mamacita%';` → ≥1 |
| Proposal insert OK | `INSERT INTO bookings (booking_type, resource_id, partner_id, ...)` with Mamacita location → succeeds |
| Draft partner proposal fails | Same INSERT with draft-partner location → trigger exception |

Full matrix: [`venue-booking-test-matrix.md`](./venue-booking-test-matrix.md)

---

## Out of scope

- No UI (SAN-494–496)
- No prod apply of SAN-492 (separate gate)
- Do **not** mutate existing host partners (`type='host'`, `draft`) — create new venue rows

---

## Skills / MCP

| Tool | Use |
|------|-----|
| `mde-supabase` | RLS + seed via service role |
| `google-maps-code-assist` | Resolve `google_place_id` with field mask |
| `task-verifier` | Done gate after seed script lands |

---

## Done criteria

1. Seed script idempotent on disposable DB (re-run safe)
2. All verification rows in matrix pass on staging post-492
3. Evidence: `tasks/testing/evidence/YYYY-MM-DD/SAN-493-seed-RESULTS.md`
4. Linear SAN-493 → In Review with PR link
