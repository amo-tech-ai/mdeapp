-- DATA-002 gap exports by venue kind (read-only)
-- Project: zkwcbyxiwklihegjhuql · 2026-05-29

-- Café: anchors missing
SELECT 'cafe' AS kind, count(*) AS anchor_count
FROM venue_anchors WHERE kind = 'cafe' AND is_active;

-- Restaurant: place_id gaps
SELECT id, name, neighborhood
FROM restaurants
WHERE google_place_id IS NULL OR google_place_id = '';

-- Restaurant: embedding gaps
SELECT r.id, r.name
FROM restaurants r
LEFT JOIN restaurant_embeddings e ON e.restaurant_id = r.id
WHERE e.restaurant_id IS NULL;

-- Nightclub: anchors missing
SELECT 'nightclub' AS kind, count(*) AS anchor_count
FROM venue_anchors WHERE kind = 'nightclub' AND is_active;

-- Nightclub vs events conflation check (should return 0 overlap by design)
SELECT e.id, e.title
FROM events e
WHERE e.title ILIKE '%reggaeton%'
  AND e.status IN ('published', 'active');

-- Cache coverage for restaurant place_ids
SELECT count(DISTINCT r.google_place_id) AS restaurants_with_cache
FROM restaurants r
INNER JOIN place_details_cache c ON c.place_id = r.google_place_id;
