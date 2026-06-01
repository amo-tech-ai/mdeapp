-- Migration: seed_events_attractions
-- Purpose: Seed demo events and tourist destinations for chat smoke testing.
--   Both tables were empty in production; AI chat verticals need data to return results.
-- Tables affected: public.events, public.tourist_destinations
-- Safe to re-run: uses ON CONFLICT DO NOTHING via explicit UUIDs

-- ─────────────────────────────────────────────────────────────────
-- EVENTS (upcoming, status = published, is_active = true)
-- ─────────────────────────────────────────────────────────────────

insert into public.events (
  id, name, event_type, subcategory, address, city, country,
  event_start_time, event_end_time, timezone,
  ticket_price_min, ticket_price_max, currency, ticket_url,
  primary_image_url, description, tags,
  latitude, longitude, is_active, is_verified, status, source
) values
(
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Festival de Música Colombiana',
  'Music',
  'Festival',
  'La Macarena, Cra. 33, Medellín',
  'Medellín', 'Colombia',
  '2026-06-07 20:00:00+00', '2026-06-07 23:30:00+00', 'America/Bogota',
  25.00, 80.00, 'USD', 'https://tuboleta.com/medellin',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
  'A celebration of traditional and contemporary Colombian music featuring top national artists.',
  ARRAY['music', 'festival', 'colombian', 'live'],
  6.23516000, -75.57383000, true, true, 'published', 'manual'
),
(
  'a1b2c3d4-0001-0001-0001-000000000002',
  'Salsa Night at Teatro Lido',
  'Nightlife',
  'Dance',
  'El Poblado, Calle 9, Medellín',
  'Medellín', 'Colombia',
  '2026-05-16 22:00:00+00', '2026-05-17 04:00:00+00', 'America/Bogota',
  15.00, 30.00, 'USD', 'https://teatrolido.com/eventos',
  'https://images.unsplash.com/photo-1545959570-a94084071b5d?w=800',
  'Live salsa orchestra and open dance floor in the heart of El Poblado. Beginner classes at 10pm.',
  ARRAY['salsa', 'dance', 'nightlife', 'latin'],
  6.20847000, -75.57059000, true, true, 'published', 'manual'
),
(
  'a1b2c3d4-0001-0001-0001-000000000003',
  'Feria de las Flores Preview Parade',
  'Culture',
  'Parade',
  'Avenida El Poblado, Medellín',
  'Medellín', 'Colombia',
  '2026-08-01 14:00:00+00', '2026-08-01 18:00:00+00', 'America/Bogota',
  0.00, 0.00, 'USD', 'https://feriadelasflores.gov.co',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
  'Medellín''s iconic Flower Festival parade preview — silleteros carry massive floral arrangements through the city.',
  ARRAY['feria', 'flores', 'festival', 'culture', 'free'],
  6.21088000, -75.57091000, true, true, 'published', 'manual'
),
(
  'a1b2c3d4-0001-0001-0001-000000000004',
  'Jazz & Cóctel at Parque Explora',
  'Music',
  'Jazz',
  'Cra. 52 #73-75, Parque Explora, Medellín',
  'Medellín', 'Colombia',
  '2026-05-22 19:00:00+00', '2026-05-22 23:00:00+00', 'America/Bogota',
  20.00, 45.00, 'USD', 'https://parqueexplora.org/eventos',
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
  'Open-air jazz concert on the Parque Explora terrace with craft cocktails and Medellín city views.',
  ARRAY['jazz', 'cocktails', 'outdoor', 'music'],
  6.27167000, -75.56786000, true, true, 'published', 'manual'
),
(
  'a1b2c3d4-0001-0001-0001-000000000005',
  'Medellín Food & Wine Festival',
  'Food',
  'Festival',
  'Centro Comercial El Tesoro, Medellín',
  'Medellín', 'Colombia',
  '2026-05-30 12:00:00+00', '2026-05-30 20:00:00+00', 'America/Bogota',
  30.00, 75.00, 'USD', 'https://tuboleta.com/foodwine',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
  'Top Colombian chefs and international wineries. Tastings, masterclasses, and live cooking demonstrations.',
  ARRAY['food', 'wine', 'gastronomy', 'festival'],
  6.19970000, -75.57290000, true, true, 'published', 'manual'
),
(
  'a1b2c3d4-0001-0001-0001-000000000006',
  'Reggaeton & Urban Night',
  'Nightlife',
  'Concert',
  'Antioquia, Medellín Arena',
  'Medellín', 'Colombia',
  '2026-06-14 21:00:00+00', '2026-06-15 02:00:00+00', 'America/Bogota',
  40.00, 120.00, 'USD', 'https://tuboleta.com/arena',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'Major urban music night featuring top reggaeton and urban artists from Colombia and Latin America.',
  ARRAY['reggaeton', 'urban', 'concert', 'nightlife'],
  6.25278000, -75.59389000, true, true, 'published', 'manual'
)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────
-- TOURIST DESTINATIONS
-- ─────────────────────────────────────────────────────────────────

insert into public.tourist_destinations (
  id, name, category, subcategory, description, address, city, country,
  entry_fee, entry_fee_amount, currency,
  estimated_visit_duration, best_for, tags,
  primary_image_url, website, rating, rating_count,
  latitude, longitude, is_active, is_verified, family_friendly,
  source
) values
(
  'b2c3d4e5-0002-0002-0002-000000000001',
  'Parque Explora',
  'Museum',
  'Science',
  'Interactive science museum and aquarium with planetarium and hands-on exhibits for all ages. One of Latin America''s largest science parks.',
  'Cra. 52 #73-75, Medellín',
  'Medellín', 'Colombia',
  'Paid', 18.00, 'USD',
  '2-3 hours',
  ARRAY['Families', 'Kids', 'Science', 'Education'],
  ARRAY['museum', 'aquarium', 'science', 'kids', 'interactive'],
  'https://images.unsplash.com/photo-1564420228546-7aebf7af2a0b?w=800',
  'https://parqueexplora.org',
  4.60, 3200,
  6.27167000, -75.56786000, true, true, true, 'manual'
),
(
  'b2c3d4e5-0002-0002-0002-000000000002',
  'El Peñol Rock (Guatapé)',
  'Nature',
  'Landmark',
  'Massive granite monolith rising 220m above the surrounding landscape. Climb 740 steps to the summit for panoramic views of the reservoir and islands below.',
  'Vereda El Peñol, Guatapé',
  'Guatapé', 'Colombia',
  'Paid', 8.00, 'USD',
  'Half day',
  ARRAY['Views', 'Hiking', 'Photography', 'Adventure'],
  ARRAY['guatape', 'peñol', 'rock', 'hiking', 'views', 'day trip'],
  'https://images.unsplash.com/photo-1582640213886-8b6d8e1e8cb1?w=800',
  'https://guatape.gov.co',
  4.80, 8400,
  6.21650000, -75.23170000, true, true, true, 'manual'
),
(
  'b2c3d4e5-0002-0002-0002-000000000003',
  'Parque Arví',
  'Nature',
  'Park',
  'Vast eco-park at 2,600m elevation in the mountains above Medellín. Accessible via the iconic Metrocable Line L. Hiking trails, craft markets, and fresh mountain air.',
  'Corregimiento Santa Elena, Medellín',
  'Medellín', 'Colombia',
  'Low', 5.00, 'USD',
  '3-4 hours',
  ARRAY['Hiking', 'Nature', 'Families', 'Views'],
  ARRAY['arvi', 'nature', 'hiking', 'metrocable', 'ecotourism', 'park'],
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'https://parquearvi.org',
  4.50, 5100,
  6.28330000, -75.51780000, true, true, true, 'manual'
),
(
  'b2c3d4e5-0002-0002-0002-000000000004',
  'Plaza Botero',
  'Culture',
  'Landmark',
  'Open-air sculpture gallery in the heart of downtown Medellín featuring 23 monumental bronze sculptures by Fernando Botero, Colombia''s most famous artist.',
  'Cra. 52 #52-28, Centro, Medellín',
  'Medellín', 'Colombia',
  'Free', 0.00, 'USD',
  '30-60 min',
  ARRAY['Art', 'Photography', 'Culture', 'Free'],
  ARRAY['botero', 'art', 'sculpture', 'downtown', 'free', 'culture'],
  'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800',
  'https://www.museodeantioquia.co',
  4.60, 7200,
  6.25126000, -75.56840000, true, true, true, 'manual'
),
(
  'b2c3d4e5-0002-0002-0002-000000000005',
  'Pueblito Paisa',
  'Culture',
  'Historic Site',
  'Replica of a traditional Antioquian colonial village perched on Cerro Nutibara hill. Panoramic views of the city skyline with artisan shops and traditional food stalls.',
  'Cerro Nutibara, Medellín',
  'Medellín', 'Colombia',
  'Free', 0.00, 'USD',
  '1-2 hours',
  ARRAY['Culture', 'Views', 'Photography', 'Shopping'],
  ARRAY['pueblito', 'colonial', 'culture', 'views', 'free', 'antioquia'],
  'https://images.unsplash.com/photo-1618667667767-e37b0e63e83c?w=800',
  null,
  4.20, 3800,
  6.23600000, -75.59390000, true, true, true, 'manual'
),
(
  'b2c3d4e5-0002-0002-0002-000000000006',
  'Jardín Botánico de Medellín',
  'Nature',
  'Garden',
  'Beautiful 14-hectare urban botanical garden with over 4,500 plant species. The iconic orquideórama butterfly-shaped structure hosts concerts and events. Serene escape in the city.',
  'Cra. 52 #73-298, Medellín',
  'Medellín', 'Colombia',
  'Free', 0.00, 'USD',
  '1-2 hours',
  ARRAY['Nature', 'Families', 'Relaxation', 'Photography'],
  ARRAY['botanical garden', 'nature', 'orchids', 'park', 'free', 'flowers'],
  'https://images.unsplash.com/photo-1585320806297-9794b3e4aaae?w=800',
  'https://jbmed.org',
  4.70, 6100,
  6.27286000, -75.56672000, true, true, true, 'manual'
),
(
  'b2c3d4e5-0002-0002-0002-000000000007',
  'El Poblado Nightlife Strip (Parque Lleras)',
  'Nightlife',
  'Entertainment District',
  'The epicenter of Medellín''s vibrant nightlife. Parque Lleras plaza and surrounding blocks are lined with rooftop bars, clubs, and restaurants that come alive after 10pm.',
  'Parque Lleras, El Poblado, Medellín',
  'Medellín', 'Colombia',
  'Free', 0.00, 'USD',
  '2-4 hours',
  ARRAY['Nightlife', 'Bars', 'Social'],
  ARRAY['nightlife', 'el poblado', 'parque lleras', 'bars', 'clubs', 'social'],
  'https://images.unsplash.com/photo-1572715376701-98568319fd0b?w=800',
  null,
  4.30, 4500,
  6.20788000, -75.57014000, true, true, false, 'manual'
),
(
  'b2c3d4e5-0002-0002-0002-000000000008',
  'Metrocable to Santo Domingo',
  'Experience',
  'Transport & Views',
  'Ride the iconic urban Metrocable above the hillside comunas and enjoy breathtaking aerial views of Medellín. Connects to the urban integration project at Santo Domingo Savio.',
  'Estación Acevedo, Metro Line A, Medellín',
  'Medellín', 'Colombia',
  'Low', 1.20, 'USD',
  '1-2 hours',
  ARRAY['Views', 'Photography', 'Culture', 'Unique'],
  ARRAY['metrocable', 'cable car', 'commune 13', 'views', 'urban'],
  'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800',
  'https://www.metrodemedellin.gov.co',
  4.50, 5800,
  6.29250000, -75.55470000, true, true, true, 'manual'
)
on conflict (id) do nothing;
