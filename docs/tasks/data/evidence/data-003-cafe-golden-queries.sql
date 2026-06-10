-- DATA-003 — Café golden query anchor assertions (read-only)
-- Project: zkwcbyxiwklihegjhuql · Sarah persona / venue_anchors kind=cafe
-- JSON map: tasks/venues/seeds/golden-queries-venues.json

-- G0: Seed gate (DATA-035)
SELECT COUNT(*) AS active_cafe_anchors
FROM venue_anchors
WHERE kind = 'cafe' AND is_active = true;
-- expect: 17

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

-- G6: Metadata contract (DATA-002) — ai_vibe_summary on all cafés
SELECT COUNT(*) FILTER (WHERE metadata ? 'ai_vibe_summary') AS with_vibe,
       COUNT(*) AS total
FROM venue_anchors
WHERE kind = 'cafe' AND is_active;
-- expect: 17/17

-- G7: No duplicate place_id per kind
SELECT google_place_id, COUNT(*) AS n
FROM venue_anchors
WHERE kind = 'cafe' AND is_active
GROUP BY google_place_id
HAVING COUNT(*) > 1;
-- expect: 0 rows
