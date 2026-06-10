-- DATA-041-R06 — anchor venue_source_evidence (10 rows)
-- Task: DATA-041-R06 — Anchor venue_source_evidence
-- Rows: 5 café · 5 nightclub (venue_anchor_id FK)
--
-- Apply (service_role):
--   psql "$DATABASE_URL" -f tasks/data/seeds/data041_anchor_evidence.sql
--
-- Idempotent: ON CONFLICT (id) DO UPDATE refreshes text in place.
--
-- Rollback:
--   DELETE FROM public.venue_source_evidence WHERE id IN (
--     'a1000001-0000-4000-8000-000000000001','a1000001-0000-4000-8000-000000000002',
--     'a1000001-0000-4000-8000-000000000003','a1000001-0000-4000-8000-000000000004',
--     'a1000001-0000-4000-8000-000000000005','b2000002-0000-4000-8000-000000000001',
--     'b2000002-0000-4000-8000-000000000002','b2000002-0000-4000-8000-000000000003',
--     'b2000002-0000-4000-8000-000000000004','b2000002-0000-4000-8000-000000000005'
--   );

BEGIN;

INSERT INTO public.venue_source_evidence (
  id, venue_kind, restaurant_id, venue_anchor_id,
  source_type, source_url, source_title, extracted_text,
  confidence, checked_at, created_at
)
VALUES
  (
    'a1000001-0000-4000-8000-000000000001', 'cafe', NULL,
    '7e2cdb49-c9d7-4548-9128-3d4754acf295',
    'editorial', 'https://www.semilla.co/', 'Semilla Café Coworking',
    'Laureles specialty café with reliable Wi-Fi and laptop-friendly seating for remote work.',
    0.92, '2026-06-01T12:00:00+00:00', '2026-06-01T12:00:00+00:00'
  ),
  (
    'a1000001-0000-4000-8000-000000000002', 'cafe', NULL,
    '2aa4f319-f2be-4a18-8270-bed824600276',
    'editorial', 'https://www.pergamino.co/', 'Pergamino Café Laureles',
    'Third-wave roaster on Circular 3; quiet specialty coffee locals recommend in Laureles.',
    0.91, '2026-06-01T12:00:00+00:00', '2026-06-01T12:00:00+00:00'
  ),
  (
    'a1000001-0000-4000-8000-000000000003', 'cafe', NULL,
    '026cfc6e-807b-4b31-b1a1-43cd5455f63d',
    'editorial', 'https://www.pergamino.co/', 'Pergamino Vía Primavera',
    'Aesthetic Vía Primavera location; specialty espresso and brunch crowd favorite.',
    0.86, '2026-06-01T12:00:00+00:00', '2026-06-01T12:00:00+00:00'
  ),
  (
    'a1000001-0000-4000-8000-000000000004', 'cafe', NULL,
    '5975c9b0-1822-47bc-af2d-3f0c4e6880b9',
    'editorial', NULL, 'Café Revolución Laureles',
    'Neighborhood café with strong Wi-Fi signal and brunch menu in Laureles.',
    0.88, '2026-06-01T12:00:00+00:00', '2026-06-01T12:00:00+00:00'
  ),
  (
    'a1000001-0000-4000-8000-000000000005', 'cafe', NULL,
    '5faf8004-4c9d-4743-ab76-95d6e4070db2',
    'editorial', NULL, 'Hija Mía Café',
    'El Poblado roaster café; specialty single-origin and pour-over focus.',
    0.87, '2026-06-01T12:00:00+00:00', '2026-06-01T12:00:00+00:00'
  ),
  (
    'b2000002-0000-4000-8000-000000000001', 'nightclub', NULL,
    'f8284e52-09fe-46b3-a3fd-05ebafa67aee',
    'editorial', NULL, 'Son Havana',
    'Authentic salsa bar in Laureles where locals dance; live band most nights.',
    0.94, '2026-06-01T12:00:00+00:00', '2026-06-01T12:00:00+00:00'
  ),
  (
    'b2000002-0000-4000-8000-000000000002', 'nightclub', NULL,
    '4be2eb3e-4b24-4bdb-89a5-4b846c110b43',
    'editorial', NULL, 'Dulce Jesús Mío',
    'Provenza nightlife venue with themed rooms and strong weekend crowd.',
    0.89, '2026-06-01T12:00:00+00:00', '2026-06-01T12:00:00+00:00'
  ),
  (
    'b2000002-0000-4000-8000-000000000003', 'nightclub', NULL,
    '7417d9ad-5305-4b6f-9e60-3db2cf580d17',
    'editorial', NULL, 'Salón Amador',
    'Electronic and house-focused club in Provenza; late-night DJ sets.',
    0.88, '2026-06-01T12:00:00+00:00', '2026-06-01T12:00:00+00:00'
  ),
  (
    'b2000002-0000-4000-8000-000000000004', 'nightclub', NULL,
    'e163f409-f9b2-407b-9a19-34d7a8a29179',
    'editorial', NULL, 'Envy Roof Bar',
    'Provenza rooftop cocktails with skyline views; popular pre-club stop.',
    0.9, '2026-06-01T12:00:00+00:00', '2026-06-01T12:00:00+00:00'
  ),
  (
    'b2000002-0000-4000-8000-000000000005', 'nightclub', NULL,
    '1b7cfc0b-98b7-438d-b899-c1e3ab2d9144',
    'editorial', NULL, '360 Rooftop',
    'Provenza rooftop bar with panoramic views and cocktail program.',
    0.92, '2026-06-01T12:00:00+00:00', '2026-06-01T12:00:00+00:00'
  )
ON CONFLICT (id) DO UPDATE SET
  venue_kind = EXCLUDED.venue_kind,
  restaurant_id = EXCLUDED.restaurant_id,
  venue_anchor_id = EXCLUDED.venue_anchor_id,
  source_type = EXCLUDED.source_type,
  source_url = EXCLUDED.source_url,
  source_title = EXCLUDED.source_title,
  extracted_text = EXCLUDED.extracted_text,
  confidence = EXCLUDED.confidence,
  checked_at = EXCLUDED.checked_at;

COMMIT;
