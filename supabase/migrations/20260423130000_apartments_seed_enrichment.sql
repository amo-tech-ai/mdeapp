-- Apartments seed enrichment + supplemental listings.
-- Idempotent: UPDATE only where fields are NULL, INSERT with ON CONFLICT DO NOTHING.
--
-- Background: the P1 seed created 33 rows with descriptions, addresses, coords,
-- amenities, images, wifi_speed — but left host_name, rating, review_count, and
-- source_url NULL on 28 of them. The chat's ranking formula + the "seen on N sources"
-- trust signal depend on these fields being populated. This migration:
--   1. Backfills realistic host + rating + source data on existing rows.
--   2. Adds 10 additional premium listings (Laureles / Poblado / Provenza focus)
--      with full data including source_url to exercise the aggregation moat.
-- Source URLs are intentionally SYNTHETIC placeholders — not live scraped content.

-- ─── 1. Backfill host + rating on the 28 existing deterministic seeds ──────────
-- Use deterministic fills keyed off the last 2 hex digits of the UUID so results
-- are reproducible and diverse.

WITH existing AS (
  SELECT id,
    -- Deterministic pseudo-random from the UUID tail
    (('x' || substr(id::text, 35, 2))::bit(8)::int) AS seed_byte
  FROM public.apartments
  WHERE id::text LIKE '30000000-0000-4000-8000-%'
)
UPDATE public.apartments a
SET
  host_name = CASE (e.seed_byte % 10)
    WHEN 0 THEN 'María González'
    WHEN 1 THEN 'Carlos Rodríguez'
    WHEN 2 THEN 'Ana Martínez'
    WHEN 3 THEN 'Diego Herrera'
    WHEN 4 THEN 'Valentina Ramírez'
    WHEN 5 THEN 'Juan Pablo Ortiz'
    WHEN 6 THEN 'Sofía Vélez'
    WHEN 7 THEN 'Andrés Jaramillo'
    WHEN 8 THEN 'Laura Quintero'
    ELSE 'Mateo Restrepo'
  END,
  host_response_time = CASE (e.seed_byte % 3)
    WHEN 0 THEN 'within an hour'
    WHEN 1 THEN 'within a few hours'
    ELSE 'within a day'
  END,
  rating = ROUND((4.0 + (e.seed_byte % 10) * 0.1)::numeric, 2),
  review_count = 8 + (e.seed_byte % 90),
  verified = (e.seed_byte % 3 <> 0),  -- ~67% verified
  source_url = CASE (e.seed_byte % 4)
    WHEN 0 THEN 'https://www.airbnb.com/rooms/stub-' || substr(a.id::text, 30)
    WHEN 1 THEN 'https://www.fazwaz.com.co/en/property/stub-' || substr(a.id::text, 30)
    WHEN 2 THEN 'https://www.facebook.com/groups/765646657979980/posts/stub-' || substr(a.id::text, 30)
    ELSE NULL  -- direct submission
  END,
  freshness_status = 'active',
  last_checked_at = now() - (e.seed_byte || ' hours')::interval
FROM existing e
WHERE a.id = e.id
  AND (a.host_name IS NULL OR a.rating IS NULL OR a.source_url IS NULL);

-- ─── 2. Add 10 supplemental high-quality listings ─────────────────────────────

INSERT INTO public.apartments (
  id, title, description, neighborhood, address, city,
  latitude, longitude, bedrooms, bathrooms, size_sqm,
  furnished, wifi_speed, amenities, building_amenities,
  price_monthly, price_daily, currency, deposit_amount,
  utilities_included, minimum_stay_days, pet_friendly, parking_included,
  images, host_name, host_response_time, rating, review_count,
  status, featured, verified, source_url, freshness_status,
  available_from, metadata
)
VALUES
  (
    'a0000000-0000-4000-a000-000000000001'::uuid,
    'Estadio Modern 1BR · Fiber Wi-Fi',
    'Fresh remodel one block from Estadio metro. 200 Mbps fiber, workstation nook, blackout blinds, quiet interior unit. Walk to Segundo Parque cafés.',
    'Laureles', 'Cra 70 #47A-22', 'Medellín',
    6.2449, -75.5905, 1, 1, 55,
    true, 200, ARRAY['WiFi','AC','Workstation','Washer','Smart TV','Blackout Blinds','Safe'],
    ARRAY['24/7 Security','Elevator','Rooftop'],
    850, 45, 'USD', 850, true, 30, false, false,
    ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200'],
    'Andrés Jaramillo', 'within an hour', 4.85, 42,
    'active', true, true,
    'https://www.airbnb.com/rooms/stub-estadio-1br', 'active',
    (now() + interval '3 days')::date,
    '{"nomad_friendly": true, "workspace_score": 9}'::jsonb
  ),
  (
    'a0000000-0000-4000-a000-000000000002'::uuid,
    'Primer Parque Loft · 2BR + Terrace',
    'Open-plan loft on Primer Parque with 30m² terrace, Eames chair in the reading corner, 150 Mbps. Walk to Carmen, Vásquez, Café Velvet.',
    'Laureles', 'Cir 73B #38-50', 'Medellín',
    6.2458, -75.5938, 2, 2, 95,
    true, 150, ARRAY['WiFi','AC','Dishwasher','Washer','Dryer','Nespresso','Terrace','Smart TV'],
    ARRAY['Concierge','Gym','Pool','Cowork Lounge'],
    1200, 65, 'USD', 1200, false, 30, true, true,
    ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200'],
    'Valentina Ramírez', 'within an hour', 4.92, 78,
    'active', true, true,
    'https://www.fazwaz.com.co/en/property/stub-primer-parque', 'active',
    (now() + interval '1 day')::date,
    '{"nomad_friendly": true, "family_friendly": true}'::jsonb
  ),
  (
    'a0000000-0000-4000-a000-000000000003'::uuid,
    'Segundo Parque Duplex · 2BR',
    'Duplex townhouse three minutes walk from Segundo Parque. Second floor is a full master suite. Independent entrance. Tree-lined street.',
    'Laureles', 'Cra 75 #34-118', 'Medellín',
    6.2469, -75.5950, 2, 3, 110,
    true, 120, ARRAY['WiFi','AC','Dishwasher','Washer','Dryer','Private Patio','BBQ'],
    ARRAY['Gated Entrance'],
    1450, 80, 'USD', 1450, false, 60, true, true,
    ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'],
    'Juan Pablo Ortiz', 'within a few hours', 4.76, 31,
    'active', false, true,
    NULL, 'active',
    (now() + interval '7 days')::date,
    '{"quiet_street": true}'::jsonb
  ),
  (
    'a0000000-0000-4000-a000-000000000004'::uuid,
    'El Poblado Skyline Penthouse · 3BR',
    'Full floor penthouse on 22F with panoramic valley views, 60m² wraparound terrace, jacuzzi, chef kitchen. Walking distance to Provenza nightlife.',
    'El Poblado', 'Cra 32 #9-10', 'Medellín',
    6.2089, -75.5672, 3, 3, 210,
    true, 300, ARRAY['WiFi','AC','Dishwasher','Washer','Dryer','Jacuzzi','Chef Kitchen','Home Office','Smart TV','Projector','Sonos'],
    ARRAY['Concierge','Gym','Pool','Spa','Rooftop Bar','Valet Parking'],
    2800, 150, 'USD', 2800, true, 30, false, true,
    ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200'],
    'Mateo Restrepo', 'within an hour', 4.98, 24,
    'active', true, true,
    'https://www.airbnb.com/rooms/stub-poblado-penthouse', 'active',
    (now() + interval '14 days')::date,
    '{"luxury": true, "skyline_view": true}'::jsonb
  ),
  (
    'a0000000-0000-4000-a000-000000000005'::uuid,
    'Provenza Designer Studio',
    'Architect-designed studio one block from Parque Provenza. Restored hardwood floors, built-in murphy bed, standing desk. 120 Mbps.',
    'El Poblado', 'Cra 35 #8A-45', 'Medellín',
    6.2104, -75.5686, 1, 1, 42,
    true, 120, ARRAY['WiFi','AC','Workstation','Washer','Smart TV','Murphy Bed','Design Kitchen'],
    ARRAY['Elevator','Package Room'],
    1100, 60, 'USD', 1100, true, 30, false, false,
    ARRAY['https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200'],
    'Sofía Vélez', 'within an hour', 4.89, 55,
    'active', true, true,
    'https://www.fazwaz.com.co/en/property/stub-provenza-studio', 'active',
    (now() + interval '2 days')::date,
    '{"nomad_friendly": true, "design_focused": true}'::jsonb
  ),
  (
    'a0000000-0000-4000-a000-000000000006'::uuid,
    'Manila Garden 2BR · Quiet Interior',
    'Back unit in a low-rise Manila building. Large garden patio. Two bedrooms, one with a crib-ready nook. Families welcome.',
    'Manila', 'Cra 43C #9-42', 'Medellín',
    6.2062, -75.5689, 2, 2, 88,
    true, 100, ARRAY['WiFi','AC','Dishwasher','Washer','Dryer','Crib','Garden','BBQ'],
    ARRAY['Playground','24/7 Security'],
    1350, 75, 'USD', 1350, false, 60, true, true,
    ARRAY['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200'],
    'Laura Quintero', 'within a day', 4.70, 19,
    'active', false, true,
    NULL, 'active',
    (now() + interval '5 days')::date,
    '{"family_friendly": true, "quiet_interior": true}'::jsonb
  ),
  (
    'a0000000-0000-4000-a000-000000000007'::uuid,
    'Envigado Quiet Retreat · 2BR',
    'Hillside apartment on the quiet side of Envigado. Mountain views from both bedrooms, large open kitchen, dog walking path at the door.',
    'Envigado', 'Cra 43A #38 Sur-12', 'Medellín',
    6.1711, -75.5861, 2, 2, 92,
    true, 80, ARRAY['WiFi','AC','Dishwasher','Washer','Mountain View','Dog Run','Workstation'],
    ARRAY['24/7 Security'],
    950, 55, 'USD', 950, false, 60, true, true,
    ARRAY['https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200'],
    'Diego Herrera', 'within a few hours', 4.66, 37,
    'active', false, false,
    'https://www.facebook.com/groups/765646657979980/posts/stub-envigado-retreat', 'unconfirmed',
    (now() + interval '10 days')::date,
    '{"pet_friendly": true, "hillside": true}'::jsonb
  ),
  (
    'a0000000-0000-4000-a000-000000000008'::uuid,
    'Envigado Modern Tower · 2BR',
    'New-build tower with resort-grade amenities. Large gym, heated pool, co-working lounge. Walking distance to Parque Envigado.',
    'Envigado', 'Cra 48 #28 Sur-86', 'Medellín',
    6.1688, -75.5823, 2, 2, 86,
    true, 250, ARRAY['WiFi','AC','Dishwasher','Washer','Dryer','Smart TV','Workstation'],
    ARRAY['Heated Pool','Gym','Cowork','Sauna','Spa','Concierge','Valet Parking'],
    1700, 90, 'USD', 1700, true, 30, false, true,
    ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'],
    'Carlos Rodríguez', 'within an hour', 4.91, 62,
    'active', true, true,
    'https://www.airbnb.com/rooms/stub-envigado-tower', 'active',
    (now() + interval '1 day')::date,
    '{"nomad_friendly": true, "luxury": true}'::jsonb
  ),
  (
    'a0000000-0000-4000-a000-000000000009'::uuid,
    'Centro Budget Studio · 300 USD',
    'Basic studio near Parque Berrío. Honest listing — no elevator, street noise, but walkable to metro and La Candelaria. Budget option.',
    'Centro', 'Cra 52 #53-18', 'Medellín',
    6.2476, -75.5669, 1, 1, 28,
    true, 30, ARRAY['WiFi','Fan','Shared Washer','Desk'],
    ARRAY[]::text[],
    300, 18, 'USD', 300, true, 30, false, false,
    ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200'],
    'Ana Martínez', 'within a day', 4.12, 14,
    'active', false, false,
    'https://www.metrocuadrado.com/apartamento-stub-centro-studio', 'unconfirmed',
    (now() + interval '2 days')::date,
    '{"budget": true, "noise_flag": true}'::jsonb
  ),
  (
    'a0000000-0000-4000-a000-000000000010'::uuid,
    'La Setenta 2BR · Walk to Second Park',
    'Two bedroom on La 70, Laureles main strip. Walking distance to Nuestro, Hija María, Rituales. Third floor, light-filled, 120 Mbps.',
    'Laureles', 'Cra 70 #34-89', 'Medellín',
    6.2442, -75.5917, 2, 2, 78,
    true, 120, ARRAY['WiFi','AC','Dishwasher','Washer','Dryer','Balcony','Workstation'],
    ARRAY['Elevator','24/7 Security'],
    1050, 58, 'USD', 1050, false, 30, true, false,
    ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200'],
    'María González', 'within an hour', 4.80, 47,
    'active', false, true,
    NULL, 'active',
    (now() + interval '4 days')::date,
    '{"nomad_friendly": true, "walk_to_70": true}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- ─── 3. Seed property_verifications rows for any verified apartment lacking one ──

INSERT INTO public.property_verifications (apartment_id, status, notes, verified_at)
SELECT a.id, 'verified',
       'Seeded verification — host identity + listing authenticity checked',
       now() - ((random() * 30)::int || ' days')::interval
  FROM public.apartments a
 WHERE a.verified = true
   AND NOT EXISTS (
     SELECT 1 FROM public.property_verifications pv WHERE pv.apartment_id = a.id
   );
