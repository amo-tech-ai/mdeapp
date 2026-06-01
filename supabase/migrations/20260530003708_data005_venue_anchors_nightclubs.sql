-- DATA-005 nightclub venue_anchors seed
-- Generated 2026-05-30T00:37:01.386Z
-- NOT sourced from events table

INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'nightclub',
  'Dulce Jesús Mío',
  'ChIJ3QqIKDcoRI4RiVE5Rr_jonk',
  'Provenza',
  'Medellín',
  6.2230061999999995,
  -75.5653332,
  '{"themed","reggaeton","tourist-friendly","live-music"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"bar","why_special":"Iconic Antioquian-themed bar — staple Provenza nightlife for visitors.","ai_vibe_summary":"High-energy themed bar with reggaeton and classic paisa kitsch — loud, fun, tourist-safe crowd.","contact":{},"confidence_score":98,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:36:56.373Z","places_verify":{"place_id":"ChIJ3QqIKDcoRI4RiVE5Rr_jonk","mask":"places.id,places.displayName,places.location","display_name":"Sweet Jesus Mine"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
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
  'nightclub',
  '360 Rooftop Bar',
  'ChIJkWmO1w4pRI4RJ_Ez8Fw5es8',
  'Provenza',
  'Medellín',
  6.209672599999999,
  -75.56612659999999,
  '{"rooftop","cocktails","reggaeton"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"bar","why_special":"Provenza rooftop with city views and DJ sets.","ai_vibe_summary":"Upscale rooftop cocktails and reggaeton with skyline views.","contact":{},"confidence_score":96,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:36:56.814Z","places_verify":{"place_id":"ChIJkWmO1w4pRI4RJ_Ez8Fw5es8","mask":"places.id,places.displayName,places.location","display_name":"360 Rooftop Bar & Restaurante"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
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
  'nightclub',
  'Envy Roof Bar',
  'ChIJz33pvSkoRI4Rp3jsj_c-VNw',
  'Provenza',
  'Medellín',
  6.208922299999999,
  -75.5670602,
  '{"rooftop","cocktails","dress-code"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"bar","why_special":"Provenza rooftop cocktail bar popular with weekend crowds.","ai_vibe_summary":"Stylish rooftop bar — dress up, cocktails, late-night Provenza energy.","contact":{},"confidence_score":95,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:36:57.193Z","places_verify":{"place_id":"ChIJz33pvSkoRI4Rp3jsj_c-VNw","mask":"places.id,places.displayName,places.location","display_name":"Envy Rooftop - Rooftop en Medellín"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
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
  'nightclub',
  'Salon Amador',
  'ChIJDzB_rikoRI4RK7880NQlw-4',
  'Provenza',
  'Medellín',
  6.2098968999999995,
  -75.5682776,
  '{"electronic","techno","late-night"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"nightclub","why_special":"Medellín electronic music institution near Provenza.","ai_vibe_summary":"Underground electronic club for house and techno — late-night crowd.","contact":{},"confidence_score":94,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:36:57.613Z","places_verify":{"place_id":"ChIJDzB_rikoRI4RK7880NQlw-4","mask":"places.id,places.displayName,places.location","display_name":"Salón Amador"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
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
  'nightclub',
  'VIVO Medellín',
  'ChIJjSpbHvQpRI4RcOicgNc_pkY',
  'Provenza',
  'Medellín',
  6.207855899999999,
  -75.56602649999999,
  '{"reggaeton","latin","late-night"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"nightclub","why_special":"Large-format Provenza nightclub (La House) for reggaeton and crossover hits.","ai_vibe_summary":"Big-room reggaeton club — peak weekend energy in Provenza.","contact":{},"confidence_score":93,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:36:58.044Z","places_verify":{"place_id":"ChIJjSpbHvQpRI4RcOicgNc_pkY","mask":"places.id,places.displayName,places.location","display_name":"La House Provenza"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
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
  'nightclub',
  'Red Bar Medellín',
  'ChIJcd1i5paDRo4R_43xXyY06js',
  'El Poblado',
  'Medellín',
  6.2063426999999995,
  -75.5686593,
  '{"cocktails","expat-friendly","late-night"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"bar","why_special":"Long-running Poblado cocktail bar with steady expat traffic.","ai_vibe_summary":"Casual cocktail bar — good pre-game before Provenza clubs.","contact":{},"confidence_score":90,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:36:58.452Z","places_verify":{"place_id":"ChIJcd1i5paDRo4R_43xXyY06js","mask":"places.id,places.displayName,places.location","display_name":"Red Bar"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
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
  'nightclub',
  'Bendito Seas',
  'ChIJCTe8u8ApRI4ReA6E6ke922A',
  'Manila',
  'Medellín',
  6.2101619999999995,
  -75.5673929,
  '{"reggaeton","latin","late-night"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"nightclub","why_special":"Manila reggaeton club — crossover hits and local crowd.","ai_vibe_summary":"Reggaeton-forward Manila club — younger local weekend scene.","contact":{},"confidence_score":92,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:36:58.800Z","places_verify":{"place_id":"ChIJCTe8u8ApRI4ReA6E6ke922A","mask":"places.id,places.displayName,places.location","display_name":"Bendito Seas"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
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
  'nightclub',
  'Palma Pitón Manila',
  'ChIJ5YybASEpRI4RMQVFxi9kfcE',
  'Manila',
  'Medellín',
  6.2147141,
  -75.5715682,
  '{"reggaeton","latin","late-night"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"nightclub","why_special":"Manila nightclub — reggaeton and crossover nights.","ai_vibe_summary":"Latin reggaeton club in Manila — lively local weekend scene.","contact":{},"confidence_score":88,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:36:59.271Z","places_verify":{"place_id":"ChIJ5YybASEpRI4RMQVFxi9kfcE","mask":"places.id,places.displayName,places.location","display_name":"Palma Pitón Manila"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
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
  'nightclub',
  '818 DISTRICT',
  'ChIJcw-7qt0pRI4Ree7F6X1eGuo',
  'Laureles',
  'Medellín',
  6.2418827,
  -75.59206449999999,
  '{"reggaeton","crossover","late-night"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"nightclub","why_special":"Laureles nightlife district — alternative to Poblado circuit.","ai_vibe_summary":"Neighborhood club district — Laureles locals, less touristy than Provenza.","contact":{},"confidence_score":91,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:36:59.644Z","places_verify":{"place_id":"ChIJcw-7qt0pRI4Ree7F6X1eGuo","mask":"places.id,places.displayName,places.location","display_name":"818 DISTRICT"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
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
  'nightclub',
  'La Octava Bar',
  'ChIJebEL-SkoRI4RcXaj3HEEDJU',
  'El Poblado',
  'Medellín',
  6.2074808,
  -75.56815379999999,
  '{"reggaeton","crossover","late-night"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"bar","why_special":"Poblado bar with reggaeton and crossover nights.","ai_vibe_summary":"Late-night bar — reggaeton weekends near Provenza.","contact":{},"confidence_score":87,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:37:00.027Z","places_verify":{"place_id":"ChIJebEL-SkoRI4RcXaj3HEEDJU","mask":"places.id,places.displayName,places.location","display_name":"La Octava Bar"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
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
  'nightclub',
  'Son Havana',
  'ChIJT6rIGAopRI4RnmT4NpkaFco',
  'Laureles',
  'Medellín',
  6.2502127,
  -75.5920785,
  '{"live-music","salsa","late-night"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"bar","why_special":"Live salsa and Cuban music — Laureles nightlife staple.","ai_vibe_summary":"Live salsa bar — dancing, bands, mixed tourist/local crowd.","contact":{},"confidence_score":89,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:37:00.502Z","places_verify":{"place_id":"ChIJT6rIGAopRI4RnmT4NpkaFco","mask":"places.id,places.displayName,places.location","display_name":"Son Havana Bar"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
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
  'nightclub',
  'La Ruana de Juana',
  'ChIJM1ouySsoRI4RSQ0PWE7IcW8',
  'El Poblado',
  'Medellín',
  6.210098899999999,
  -75.569465,
  '{"local","reggaeton","late-night"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"bar","why_special":"Classic Laureles bar with crossover and reggaeton nights.","ai_vibe_summary":"Neighborhood bar — reggaeton weekends, local Laureles vibe.","contact":{},"confidence_score":86,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:37:00.912Z","places_verify":{"place_id":"ChIJM1ouySsoRI4RSQ0PWE7IcW8","mask":"places.id,places.displayName,places.location","display_name":"La Ruana de Juana"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
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
  'nightclub',
  'Bar Chupitos Provenza',
  'ChIJAa567CkoRI4RKt8qX61DqOM',
  'Provenza',
  'Medellín',
  6.2083669,
  -75.5672754,
  '{"shooters","pre-game","tourist-friendly"}'::text[],
  true,
  'curated',
  '{"schema_version":1,"place_type":"bar","why_special":"Provenza shooter bar — common pre-club stop.","ai_vibe_summary":"High-energy shooter bar — pre-game crowd before bigger clubs.","contact":{},"confidence_score":85,"listing_sources":["nightlife-curated-v1"],"verified_at":"2026-05-30T00:37:01.265Z","places_verify":{"place_id":"ChIJAa567CkoRI4RKt8qX61DqOM","mask":"places.id,places.displayName,places.location","display_name":"Chupitos Medellin | Bar Parque Lleras"},"disambiguation":"venue_anchor_not_event — not ticketed events table"}'::jsonb
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();
