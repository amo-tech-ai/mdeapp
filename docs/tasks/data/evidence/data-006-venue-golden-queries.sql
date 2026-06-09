-- DATA-006 — Venue golden query assertions (read-only)
-- Project: zkwcbyxiwklihegjhuql
-- JSON map: tasks/venues/seeds/golden-queries-venues.json
-- Depends: DATA-003 (café), DATA-004 (restaurants), DATA-005 (nightclub)
-- Run via Supabase MCP execute_sql or psql — each section independent.

-- =============================================================================
-- GATE — catalog counts
-- =============================================================================

-- G0a: Café anchors (DATA-003 / DATA-035)
SELECT COUNT(*) AS active_cafe_anchors
FROM venue_anchors
WHERE kind = 'cafe' AND is_active = true;
-- expect: 17

-- G0b: Nightclub anchors (DATA-005)
SELECT COUNT(*) AS active_nightclub_anchors
FROM venue_anchors
WHERE kind = 'nightclub' AND is_active = true;
-- expect: 13

-- G0c: Restaurant catalog (DATA-004)
SELECT COUNT(*) AS total_restaurants,
       COUNT(*) FILTER (WHERE google_place_id IS NOT NULL) AS with_place_id
FROM restaurants
WHERE is_active = true;
-- expect: 44 / 44

-- =============================================================================
-- CAFÉ — venue_anchors kind=cafe (Sarah persona)
-- =============================================================================

-- G1: cafe-001 — quiet WiFi Laureles (≥3 wifi/coworking anchors)
SELECT id, name, google_place_id, tags
FROM venue_anchors
WHERE kind = 'cafe'
  AND is_active
  AND neighborhood = 'Laureles'
  AND (tags && ARRAY['wifi-friendly', 'coworking-friendly', 'quiet']::text[])
ORDER BY name;

-- G2: cafe-002 — third-wave Laureles
SELECT id, name, google_place_id
FROM venue_anchors
WHERE kind = 'cafe'
  AND is_active
  AND neighborhood = 'Laureles'
  AND (tags && ARRAY['third-wave', 'specialty-coffee']::text[]);

-- G3: cafe-004 — roastery / specialty Poblado
SELECT id, name, google_place_id
FROM venue_anchors
WHERE kind = 'cafe'
  AND is_active
  AND neighborhood = 'El Poblado'
  AND (tags && ARRAY['roastery', 'wifi-friendly', 'specialty-coffee', 'third-wave']::text[]);

-- G4: cafe-005 — Urbania quiet ethical (exact anchor)
SELECT id, name, google_place_id, tags
FROM venue_anchors
WHERE kind = 'cafe'
  AND is_active
  AND google_place_id = 'ChIJ1QrC3yooRI4RZ18CGQQG63s';

-- G5: cafe-006 — brunch expat Laureles
SELECT id, name, google_place_id
FROM venue_anchors
WHERE kind = 'cafe'
  AND is_active
  AND neighborhood = 'Laureles'
  AND (tags && ARRAY['brunch', 'expat-friendly']::text[]);

-- G6: Café metadata contract — ai_vibe_summary on all active cafés
SELECT COUNT(*) FILTER (WHERE metadata ? 'ai_vibe_summary') AS with_vibe,
       COUNT(*) AS total
FROM venue_anchors
WHERE kind = 'cafe' AND is_active;
-- expect: 17/17

-- G7: No duplicate place_id per café kind
SELECT google_place_id, COUNT(*) AS n
FROM venue_anchors
WHERE kind = 'cafe' AND is_active
GROUP BY google_place_id
HAVING COUNT(*) > 1;
-- expect: 0 rows

-- =============================================================================
-- RESTAURANT — public.restaurants (Carlos persona / search-restaurants tool)
-- Neighborhood filter mirrors search-restaurants.ts:
--   .or(`address.ilike.%${neighborhood}%,city.ilike.%${neighborhood}%`)
-- =============================================================================

-- R1: restaurant-001 — traditional bandeja paisa Laureles (≥2 expected rows)
SELECT id, name, google_place_id, address, cuisine_types, price_level
FROM restaurants
WHERE is_active
  AND (address ILIKE '%Laureles%' OR city ILIKE '%Laureles%')
  AND google_place_id IN (
    'ChIJw67M_fgoRI4RMiM53OU6lnQ',  -- Hacienda Junín
    'ChIJx3bu-qEpRI4Rg_hkQIAltXU'   -- Bárbaro Laureles
  )
ORDER BY name;
-- expect: 2 rows

-- R2: restaurant-002 — fine dining El Poblado tasting menu
SELECT id, name, google_place_id, address, cuisine_types, price_level
FROM restaurants
WHERE is_active
  AND (address ILIKE '%Poblado%' OR city ILIKE '%Poblado%')
  AND google_place_id IN (
    'ChIJ9dyLhikoRI4R1IEZoWSmNOo',  -- El Cielo (Cra 40)
    'ChIJNwlQASkoRI4RLE2RqbGpVP0'   -- Carmen
  )
  AND price_level >= 3
ORDER BY name;
-- expect: 2 rows

-- R3: restaurant-003 — vegetarian healthy El Poblado
SELECT id, name, google_place_id, address, cuisine_types
FROM restaurants
WHERE is_active
  AND google_place_id = 'ChIJqWx0yikoRI4R62vONfeQ86M'  -- Verdeo
  AND (address ILIKE '%Poblado%' OR city ILIKE '%Poblado%');
-- expect: 1 row (Verdeo)

-- R4: restaurant-004 — Peruvian ceviche Laureles
SELECT id, name, google_place_id, address, cuisine_types
FROM restaurants
WHERE is_active
  AND google_place_id = 'ChIJYaqNo-opRI4RVOF3Bkieaqc'  -- Rocoto
  AND cuisine_types @> ARRAY['Peruvian']::text[];
-- expect: 1 row

-- R5: restaurant-005 — affordable casual Laureles (price_level <= 2)
SELECT id, name, google_place_id, address, price_level
FROM restaurants
WHERE is_active
  AND (address ILIKE '%Laureles%' OR city ILIKE '%Laureles%')
  AND price_level <= 2
  AND google_place_id IN (
    'ChIJT6VrbOyDRo4Rx112mBkBwdQ',  -- Cucayito
    'ChIJ7fBJUgApRI4REwgd1Vw4sCI'   -- Narcobollo
  )
ORDER BY price_level, name;
-- expect: 2 rows

-- R6: restaurant-006 — Argentine parrilla Laureles
SELECT id, name, google_place_id, address, cuisine_types
FROM restaurants
WHERE is_active
  AND google_place_id = 'ChIJR6jHAAApRI4RwNiaoq9mXNc'  -- La Pampa Laureles
  AND (address ILIKE '%Laureles%' OR city ILIKE '%Laureles%');
-- expect: 1 row

-- R7: Restaurant catalog contract — all active rows have google_place_id
SELECT COUNT(*) AS missing_place_id
FROM restaurants
WHERE is_active AND google_place_id IS NULL;
-- expect: 0

-- R8: Golden restaurant IDs resolve (6 queries × expected IDs)
SELECT id, name, google_place_id
FROM restaurants
WHERE is_active
  AND id IN (
    'a1b2c3d4-e5f6-4789-abcd-100000000002',
    '038f84d2-bd57-475a-ab7b-1ef2d89dd536',
    'a1b2c3d4-e5f6-4789-abcd-100000000004',
    'ade2d416-1250-4edb-b131-59691910e8e1',
    'a1b2c3d4-e5f6-4789-abcd-100000000005',
    '7c82e7f7-c430-4178-884b-331370f4bf65',
    '7f98b6b7-86ee-47d3-815e-3f39654599a8',
    '1585f3fb-d5eb-4ec3-83eb-39acf9113a88',
    '98476b32-77cb-46ed-9c41-2cbfbc66d60b'
  )
ORDER BY name;
-- expect: 9 rows

-- =============================================================================
-- NIGHTCLUB — venue_anchors kind=nightclub (Tourist persona)
-- =============================================================================

-- N1: nightlife-001 — reggaeton near Provenza (≥3 anchors)
SELECT id, name, google_place_id, tags
FROM venue_anchors
WHERE kind = 'nightclub'
  AND is_active
  AND google_place_id IN (
    'ChIJ3QqIKDcoRI4RiVE5Rr_jonk',
    'ChIJjSpbHvQpRI4RcOicgNc_pkY',
    'ChIJAa567CkoRI4RKt8qX61DqOM'
  )
ORDER BY name;
-- expect: 3 rows (Dulce Jesús Mío, VIVO, Bar Chupitos)

-- N2: nightlife-002 — rooftop cocktails Provenza
SELECT id, name, google_place_id, tags
FROM venue_anchors
WHERE kind = 'nightclub'
  AND is_active
  AND google_place_id IN (
    'ChIJkWmO1w4pRI4RJ_Ez8Fw5es8',
    'ChIJz33pvSkoRI4Rp3jsj_c-VNw'
  )
ORDER BY name;
-- expect: 2 rows (360 Rooftop, Envy Roof)

-- N3: nightlife-003 — techno Salon Amador
SELECT id, name, google_place_id
FROM venue_anchors
WHERE kind = 'nightclub'
  AND is_active
  AND google_place_id = 'ChIJDzB_rikoRI4RK7880NQlw-4';

-- N4: nightlife-004 — reggaeton Manila
SELECT id, name, google_place_id
FROM venue_anchors
WHERE kind = 'nightclub'
  AND is_active
  AND google_place_id IN (
    'ChIJCTe8u8ApRI4ReA6E6ke922A',
    'ChIJ5YybASEpRI4RMQVFxi9kfcE'
  )
ORDER BY name;
-- expect: 2 rows (Bendito Seas, Palma Pitón Manila)

-- N5: nightlife-005 — salsa Laureles
SELECT id, name, google_place_id
FROM venue_anchors
WHERE kind = 'nightclub'
  AND is_active
  AND google_place_id = 'ChIJT6rIGAopRI4RnmT4NpkaFco';  -- Son Havana

-- N6: nightlife-006 — Laureles nightlife (818 DISTRICT)
SELECT id, name, google_place_id, neighborhood
FROM venue_anchors
WHERE kind = 'nightclub'
  AND is_active
  AND google_place_id = 'ChIJcw-7qt0pRI4Ree7F6X1eGuo';

-- N7: No duplicate place_id per nightclub kind
SELECT google_place_id, COUNT(*) AS n
FROM venue_anchors
WHERE kind = 'nightclub' AND is_active
GROUP BY google_place_id
HAVING COUNT(*) > 1;
-- expect: 0 rows

-- N8: All golden nightclub anchor IDs resolve (6 queries)
SELECT id, name, google_place_id
FROM venue_anchors
WHERE kind = 'nightclub'
  AND is_active
  AND id IN (
    '4be2eb3e-4b24-4bdb-89a5-4b846c110b43',
    '3556d4e4-f1ac-4b6e-ae36-c266ac43f77b',
    '6936c65c-4b5a-4f09-bc0c-93a8766e4d36',
    '1b7cfc0b-98b7-438d-b899-c1e3ab2d9144',
    'e163f409-f9b2-407b-9a19-34d7a8a29179',
    '7417d9ad-5305-4b6f-9e60-3db2cf580d17',
    '609d5433-2507-4e32-b823-6e77f3462bda',
    'd84cb149-9670-4a44-9cbb-9211cf1cef42',
    'f8284e52-09fe-46b3-a3fd-05ebafa67aee',
    '90d9559b-afc3-4284-a786-5e2a98d47eb3'
  )
ORDER BY name;
-- expect: 10 rows
