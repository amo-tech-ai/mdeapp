-- DATA-035 café venue_anchors seed
-- Generated 2026-05-30T00:19:29.154Z

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Rituales Compañía de Café',
  'ChIJQ-PPmKEpRI4RhZKQdct4w6Q',
  'Laureles',
  'Medellín',
  6.245572699999999,
  -75.5952334,
  '{"third-wave","wifi-friendly","specialty-coffee"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Single-origin coffee from Barrio La Sierra with full farmer traceability.","ai_vibe_summary":"Community-driven artisan coffee shop balancing education with a focused morning environment.","contact":{"website":"https://ritualescafe.co","instagram":"@ritualescafe"},"confidence_score":98,"listing_sources":["03-cafe-laureles.md"],"verified_at":"2026-05-30T00:19:21.429Z","places_verify":{"place_id":"ChIJQ-PPmKEpRI4RhZKQdct4w6Q","mask":"places.id,places.displayName,places.location","display_name":"Rituales Compañía de Café"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Pergamino Café Laureles',
  'ChIJzcFcU8spRI4RKdDH5QXv8LU',
  'Laureles',
  'Medellín',
  6.2413788,
  -75.59618689999999,
  '{"third-wave","coworking-friendly","wifi-friendly"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Laureles outpost of Medellín''s flagship third-wave brand.","ai_vibe_summary":"High-energy modern specialty coffee hub for remote workers.","contact":{"website":"https://pergamino.co","instagram":"@pergaminocafe"},"confidence_score":96,"listing_sources":["03-cafe-laureles.md"],"verified_at":"2026-05-30T00:19:21.866Z","places_verify":{"place_id":"ChIJzcFcU8spRI4RKdDH5QXv8LU","mask":"places.id,places.displayName,places.location","display_name":"Pergamino | Cafe - Laureles"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Café Revolución',
  'ChIJY3PNMaEpRI4RI_KC4_QQWd0',
  'Laureles',
  'Medellín',
  6.2459636,
  -75.592226,
  '{"expat-friendly","brunch","wifi-friendly"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Neighborhood favorite since 2014 with warm expat community.","ai_vibe_summary":"Cozy social neighborhood expat hub with home-style comfort.","contact":{"instagram":"@caferevolucion"},"confidence_score":95,"listing_sources":["03-cafe-laureles.md"],"verified_at":"2026-05-30T00:19:22.379Z","places_verify":{"place_id":"ChIJY3PNMaEpRI4RI_KC4_QQWd0","mask":"places.id,places.displayName,places.location","display_name":"Café Rev"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Semilla Café Coworking',
  'ChIJt22VcKMpRI4RBfxl2xT31yM',
  'Laureles',
  'Medellín',
  6.245765899999999,
  -75.5927856,
  '{"coworking-friendly","third-wave","wifi-friendly"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Hybrid café + structured coworking zones near Primer Parque.","ai_vibe_summary":"Professional coworking café with dedicated quiet membership areas.","contact":{},"confidence_score":94,"listing_sources":["03-cafe-laureles.md"],"verified_at":"2026-05-30T00:19:22.886Z","places_verify":{"place_id":"ChIJt22VcKMpRI4RBfxl2xT31yM","mask":"places.id,places.displayName,places.location","display_name":"Semilla Cafe Coworking S.A.S."}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Café Namazzi',
  'ChIJ13TZTwApRI4R6nj62_0XA4Y',
  'Laureles',
  'Medellín',
  6.2395304,
  -75.5994391,
  '{"specialty-coffee","aesthetic"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Curated Laureles café in local directory packs.","ai_vibe_summary":"Stylish neighborhood café for specialty coffee seekers.","contact":{},"confidence_score":92,"listing_sources":["03-cafe-laureles.md"],"verified_at":"2026-05-30T00:19:23.364Z","places_verify":{"place_id":"ChIJ13TZTwApRI4R6nj62_0XA4Y","mask":"places.id,places.displayName,places.location","display_name":"Café Namazzi"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Délmuri Coffee',
  'ChIJp_baYN8pRI4RqTsdj_HJ1W0',
  'Laureles',
  'Medellín',
  6.2499968,
  -75.5906547,
  '{"third-wave","quiet"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Laureles third-wave roastery café.","ai_vibe_summary":"Quiet specialty coffee focused on origin-forward cups.","contact":{},"confidence_score":90,"listing_sources":["03-cafe-laureles.md"],"verified_at":"2026-05-30T00:19:23.814Z","places_verify":{"place_id":"ChIJp_baYN8pRI4RqTsdj_HJ1W0","mask":"places.id,places.displayName,places.location","display_name":"Amelier Café Laureles"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Naturalia Café',
  'ChIJMRCXA6IpRI4Rm1T8IKltV5w',
  'Laureles',
  'Medellín',
  6.245735100000001,
  -75.58972299999999,
  '{"organic","brunch","wifi-friendly"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Health-forward café with organic menu options.","ai_vibe_summary":"Calm organic café for brunch and light remote work.","contact":{},"confidence_score":88,"listing_sources":["03-cafe-laureles.md"],"verified_at":"2026-05-30T00:19:24.324Z","places_verify":{"place_id":"ChIJMRCXA6IpRI4Rm1T8IKltV5w","mask":"places.id,places.displayName,places.location","display_name":"Naturalia Café - Sede Laureles"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Amelier Café Laureles',
  'ChIJp_baYN8pRI4RqTsdj_HJ1W0',
  'Laureles',
  'Medellín',
  6.2499968,
  -75.5906547,
  '{"coworking-friendly","brunch"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Café-brunch concept with laptop-friendly seating.","ai_vibe_summary":"Brunch-forward coworking café in Laureles.","contact":{},"confidence_score":87,"listing_sources":["03-cafe-laureles.md"],"verified_at":"2026-05-30T00:19:24.723Z","places_verify":{"place_id":"ChIJp_baYN8pRI4RqTsdj_HJ1W0","mask":"places.id,places.displayName,places.location","display_name":"Amelier Café Laureles"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Pausa Café & Brunch',
  'ChIJGwyAX0kpRI4R0MrZuOjjmlo',
  'Laureles',
  'Medellín',
  6.2465988999999995,
  -75.5895984,
  '{"brunch","wifi-friendly"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"All-day brunch café in Laureles.","ai_vibe_summary":"Relaxed brunch café with steady morning laptop crowd.","contact":{},"confidence_score":86,"listing_sources":["03-cafe-laureles.md"],"verified_at":"2026-05-30T00:19:25.210Z","places_verify":{"place_id":"ChIJGwyAX0kpRI4R0MrZuOjjmlo","mask":"places.id,places.displayName,places.location","display_name":"Pausa Coffee & Brunch"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Botswana Café Creativo',
  'ChIJlYRAUE4pRI4RD_kjt-mHSuw',
  'Laureles',
  'Medellín',
  6.2453781,
  -75.59727819999999,
  '{"creative","aesthetic","wifi-friendly"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Creative café space in Laureles listings pack.","ai_vibe_summary":"Art-forward café with creative community vibe.","contact":{},"confidence_score":85,"listing_sources":["03-cafe-laureles.md"],"verified_at":"2026-05-30T00:19:25.629Z","places_verify":{"place_id":"ChIJlYRAUE4pRI4RD_kjt-mHSuw","mask":"places.id,places.displayName,places.location","display_name":"Botswana Café & Brunch | Laureles"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Pergamino Calle 10B',
  'ChIJmyfHJngpRI4RLQG7fWFfH_I',
  'El Poblado',
  'Medellín',
  6.2107136999999994,
  -75.565759,
  '{"third-wave","wifi-friendly","specialty-coffee"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Iconic El Poblado flagship specialty café.","ai_vibe_summary":"Creative retro third-wave flagship for nomads and visitors.","contact":{"website":"https://co.pergamino.co","instagram":"@pergaminocafe"},"confidence_score":98,"listing_sources":["04-pablado-cafes.md"],"verified_at":"2026-05-30T00:19:26.067Z","places_verify":{"place_id":"ChIJmyfHJngpRI4RLQG7fWFfH_I","mask":"places.id,places.displayName,places.location","display_name":"PERGAMINO Café Calle 10B, Medellín"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Hija Mía Coffee Roasters',
  'ChIJd-HheCwoRI4RUuNYh8mFofw',
  'El Poblado',
  'Medellín',
  6.212461299999999,
  -75.5708741,
  '{"roastery","wifi-friendly","specialty-coffee"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Manila roaster-café with in-house roasting.","ai_vibe_summary":"Roastery café popular with remote workers and flat-white fans.","contact":{"website":"https://www.hijamiacoffee.com","instagram":"@hijamiacoffee"},"confidence_score":96,"listing_sources":["04-pablado-cafes.md"],"verified_at":"2026-05-30T00:19:26.491Z","places_verify":{"place_id":"ChIJd-HheCwoRI4RUuNYh8mFofw","mask":"places.id,places.displayName,places.location","display_name":"Hija Mía | Coffee - Manila"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Urbania Café',
  'ChIJ1QrC3yooRI4RZ18CGQQG63s',
  'El Poblado',
  'Medellín',
  6.209790099999999,
  -75.5727771,
  '{"specialty-coffee","ethical","quiet"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Colombian specialty brand with social mission.","ai_vibe_summary":"Quiet ethical specialty coffee for focused work.","contact":{"website":"https://www.urbaniacafe.com"},"confidence_score":95,"listing_sources":["04-pablado-cafes.md"],"verified_at":"2026-05-30T00:19:26.899Z","places_verify":{"place_id":"ChIJ1QrC3yooRI4RZ18CGQQG63s","mask":"places.id,places.displayName,places.location","display_name":"Urbania Café El Poblado"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Café Velvet',
  'ChIJXUCqDNQpRI4RKLeAcaPhClA',
  'El Poblado',
  'Medellín',
  6.2408718,
  -75.59206739999999,
  '{"brunch","wifi-friendly","aesthetic"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Via Primavera brunch café with outdoor seating.","ai_vibe_summary":"Aesthetic Via Primavera café for quiet work and brunch.","contact":{},"confidence_score":94,"listing_sources":["04-pablado-cafes.md"],"verified_at":"2026-05-30T00:19:27.325Z","places_verify":{"place_id":"ChIJXUCqDNQpRI4RKLeAcaPhClA","mask":"places.id,places.displayName,places.location","display_name":"Café Primavera"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Café Noir',
  'ChIJ6bs39KgpRI4RqAxz1fHkl38',
  'El Poblado',
  'Medellín',
  6.2074437,
  -75.5681251,
  '{"upscale","evening","specialty-coffee"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Luxury café-bar lounge in El Poblado.","ai_vibe_summary":"Sophisticated evening café with artisanal coffee and cocktails.","contact":{"website":"https://www.cafenoircolombia.com"},"confidence_score":92,"listing_sources":["04-pablado-cafes.md"],"verified_at":"2026-05-30T00:19:27.768Z","places_verify":{"place_id":"ChIJ6bs39KgpRI4RqAxz1fHkl38","mask":"places.id,places.displayName,places.location","display_name":"Café Noir Bar & Lounge"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Amelier Café El Poblado',
  'ChIJ7arRSNUpRI4R_yoq0TDSjSs',
  'El Poblado',
  'Medellín',
  6.2089535,
  -75.5672067,
  '{"coworking-friendly","brunch","group-work"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Coworking café at Cl. 9A #37-48.","ai_vibe_summary":"Group-friendly coworking brunch café in Poblado.","contact":{},"confidence_score":90,"listing_sources":["04-pablado-cafes.md"],"verified_at":"2026-05-30T00:19:28.177Z","places_verify":{"place_id":"ChIJ7arRSNUpRI4R_yoq0TDSjSs","mask":"places.id,places.displayName,places.location","display_name":"Amelier Café Poblado"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Café Quindío Vía Primavera',
  'ChIJd2TcTAApRI4RG6oHLp0d7Lw',
  'El Poblado',
  'Medellín',
  6.207939499999999,
  -75.566992,
  '{"brand-cafe","aesthetic"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"National Colombian coffee brand Vía Primavera location.","ai_vibe_summary":"Classic Colombian brand café on Via Primavera.","contact":{},"confidence_score":88,"listing_sources":["04-pablado-cafes.md"],"verified_at":"2026-05-30T00:19:28.628Z","places_verify":{"place_id":"ChIJd2TcTAApRI4RG6oHLp0d7Lw","mask":"places.id,places.displayName,places.location","display_name":"Café Quindío Vía Primavera"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'cafe',
  'Pergamino Vía Primavera',
  'ChIJAwOZ5ikoRI4RWqsKH3Ve1gI',
  'El Poblado',
  'Medellín',
  6.2083135,
  -75.5671227,
  '{"third-wave","tourist-friendly"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"why_special":"Pergamino Vía Primavera storefront.","ai_vibe_summary":"Reliable tourist-friendly Pergamino on Via Primavera.","contact":{},"confidence_score":88,"listing_sources":["04-pablado-cafes.md"],"verified_at":"2026-05-30T00:19:29.034Z","places_verify":{"place_id":"ChIJAwOZ5ikoRI4RWqsKH3Ve1gI","mask":"places.id,places.displayName,places.location","display_name":"PERGAMINO Coffee Via Primavera"}}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();
