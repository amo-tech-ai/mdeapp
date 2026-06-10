-- SAN-493 · EVT-034 — Seed Mamacita + 5 event venue partners
-- Run AFTER SAN-492 migration on target env (staging/disposable — NOT prod until signed off).
--
--   PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres \
--     -v ON_ERROR_STOP=1 -f supabase/seeds/san493_event_venues.sql
--
-- Deterministic UUID namespace: 00000000-0000-4001-8xxx (dev/staging only)
--
-- | # | Venue                  | partner_id (810x) | location_id (820x) | profile_id (830x) |
-- |---|------------------------|-------------------|--------------------|-------------------|
-- | 1 | Mamacita               | ...8101           | ...8201            | ...8301           |
-- | 2 | Rooftop Laureles       | ...8102           | ...8202            | ...8302           |
-- | 3 | El Patio Envigado      | ...8103           | ...8203            | ...8303           |
-- | 4 | Garden El Poblado      | ...8104           | ...8204            | ...8304           |
-- | 5 | Terrace Manila         | ...8105           | ...8205            | ...8305           |
-- | 6 | Studio Ciudad del Rio  | ...8106           | ...8206            | ...8306           |

begin;

-- ── Profiles (one per venue partner) ─────────────────────────────────────────
insert into public.profiles (id, email, full_name)
values
  ('00000000-0000-4001-8301-000000000001', 'san493-mamacita@test.local', 'Mamacita Venue'),
  ('00000000-0000-4001-8302-000000000002', 'san493-rooftop-laureles@test.local', 'Rooftop Laureles Venue'),
  ('00000000-0000-4001-8303-000000000003', 'san493-el-patio-envigado@test.local', 'El Patio Envigado Venue'),
  ('00000000-0000-4001-8304-000000000004', 'san493-garden-poblado@test.local', 'Garden El Poblado Venue'),
  ('00000000-0000-4001-8305-000000000005', 'san493-terrace-manila@test.local', 'Terrace Manila Venue'),
  ('00000000-0000-4001-8306-000000000006', 'san493-studio-ciudad-del-rio@test.local', 'Studio Ciudad del Rio Venue')
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name;

-- ── Partners (type=venue, status=active) ─────────────────────────────────────
insert into public.partners (id, profile_id, type, status)
values
  ('00000000-0000-4001-8101-000000000001', '00000000-0000-4001-8301-000000000001', 'venue', 'active'),
  ('00000000-0000-4001-8102-000000000002', '00000000-0000-4001-8302-000000000002', 'venue', 'active'),
  ('00000000-0000-4001-8103-000000000003', '00000000-0000-4001-8303-000000000003', 'venue', 'active'),
  ('00000000-0000-4001-8104-000000000004', '00000000-0000-4001-8304-000000000004', 'venue', 'active'),
  ('00000000-0000-4001-8105-000000000005', '00000000-0000-4001-8305-000000000005', 'venue', 'active'),
  ('00000000-0000-4001-8106-000000000006', '00000000-0000-4001-8306-000000000006', 'venue', 'active')
on conflict (id) do update set
  profile_id = excluded.profile_id,
  type = excluded.type,
  status = excluded.status;

-- ── Partner locations (verified + event-capable) ─────────────────────────────
insert into public.partner_locations (
  id, partner_id, label, address, neighborhood,
  lat, lng, google_place_id,
  accepts_event_bookings, is_verified,
  capacity_seated, capacity_standing, is_primary
) values
  (
    '00000000-0000-4001-8201-000000000001',
    '00000000-0000-4001-8101-000000000001',
    'Mamacita Provenza', 'Calle 10 #37-40', 'Provenza',
    6.2088, -75.5672, 'ChIJSAN493MAMACITA01',
    true, true, 80, 120, true
  ),
  (
    '00000000-0000-4001-8202-000000000002',
    '00000000-0000-4001-8102-000000000002',
    'Rooftop Laureles', 'Cra 70 #4-15', 'Laureles',
    6.2445, -75.5891, 'ChIJSAN493ROOFLAU002',
    true, true, 60, 90, true
  ),
  (
    '00000000-0000-4001-8203-000000000003',
    '00000000-0000-4001-8103-000000000003',
    'El Patio Envigado', 'Calle 37 Sur #40-50', 'Envigado',
    6.1702, -75.5897, 'ChIJSAN493ELPATIO003',
    true, true, 50, 70, true
  ),
  (
    '00000000-0000-4001-8204-000000000004',
    '00000000-0000-4001-8104-000000000004',
    'Garden El Poblado', 'Calle 8 #43-28', 'El Poblado',
    6.2095, -75.5689, 'ChIJSAN493GARDEN004',
    true, true, 100, 150, true
  ),
  (
    '00000000-0000-4001-8205-000000000005',
    '00000000-0000-4001-8105-000000000005',
    'Terrace Manila', 'Calle 10 #36-20', 'Manila',
    6.2101, -75.5655, 'ChIJSAN493TERRACE005',
    true, true, 40, 60, true
  ),
  (
    '00000000-0000-4001-8206-000000000006',
    '00000000-0000-4001-8106-000000000006',
    'Studio Ciudad del Rio', 'Calle 15 #48-10', 'Ciudad del Rio',
    6.2234, -75.5748, 'ChIJSAN493STUDIO006',
    true, true, 30, 200, true
  )
on conflict (id) do update set
  partner_id = excluded.partner_id,
  label = excluded.label,
  address = excluded.address,
  neighborhood = excluded.neighborhood,
  lat = excluded.lat,
  lng = excluded.lng,
  google_place_id = excluded.google_place_id,
  accepts_event_bookings = excluded.accepts_event_bookings,
  is_verified = excluded.is_verified,
  capacity_seated = excluded.capacity_seated,
  capacity_standing = excluded.capacity_standing,
  is_primary = excluded.is_primary;

-- ── Offerings (Mamacita + 2 others) ────────────────────────────────────────
insert into public.venue_event_offerings (
  partner_location_id, offering_key, event_types, amenities, minimum_spend, price_per_person_from
) values
  (
    '00000000-0000-4001-8201-000000000001',
    'birthday',
    array['birthday', 'celebration'],
    array['rooftop', 'dj booth'],
    5000000, 85000
  ),
  (
    '00000000-0000-4001-8204-000000000004',
    'corporate',
    array['corporate', 'networking'],
    array['garden', 'av setup'],
    8000000, 120000
  ),
  (
    '00000000-0000-4001-8205-000000000005',
    'birthday',
    array['birthday'],
    array['terrace', 'city view'],
    4000000, 75000
  )
on conflict (partner_location_id, offering_key) do update set
  event_types = excluded.event_types,
  amenities = excluded.amenities,
  minimum_spend = excluded.minimum_spend,
  price_per_person_from = excluded.price_per_person_from;

-- ── Packages (Mamacita minimum) ────────────────────────────────────────────
insert into public.venue_event_packages (
  partner_location_id, name, description, price_from, min_guests, max_guests
) values
  (
    '00000000-0000-4001-8201-000000000001',
    'Rooftop Celebration',
    'Private rooftop with DJ and welcome cocktails',
    3500000, 20, 80
  )
on conflict (partner_location_id, name) do update set
  description = excluded.description,
  price_from = excluded.price_from,
  min_guests = excluded.min_guests,
  max_guests = excluded.max_guests;

commit;
