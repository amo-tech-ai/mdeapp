-- DATA-023 — Rental golden queries (read-only)
-- Project: zkwcbyxiwklihegjhuql · Camila eval pack
-- Requires: data-009 M3 idx_apartments_rental_search_daily

-- Q1: Hood + beds (expect ≤8 rows, all Laureles)
SELECT id, title, neighborhood, bedrooms, price_daily
FROM apartments
WHERE status = 'active'
  AND neighborhood = 'Laureles'
  AND bedrooms = 2
ORDER BY price_daily
LIMIT 8;

-- Q2: Price ceiling Poblado (expect price_daily <= 50)
SELECT id, title, neighborhood, price_daily
FROM apartments
WHERE status = 'active'
  AND neighborhood ILIKE '%Poblado%'
  AND price_daily <= 50
ORDER BY price_daily
LIMIT 20;

-- Q3: WiFi / remote work signal
SELECT id, title, neighborhood, wifi_speed, amenities
FROM apartments
WHERE status = 'active'
  AND (wifi_speed >= 50 OR amenities @> ARRAY['wifi']::text[])
ORDER BY wifi_speed DESC NULLS LAST
LIMIT 10;

-- Q4: Furnished long-stay Laureles
SELECT id, title, neighborhood, price_monthly, furnished
FROM apartments
WHERE status = 'active'
  AND neighborhood = 'Laureles'
  AND furnished = true
  AND price_monthly IS NOT NULL
ORDER BY price_monthly
LIMIT 10;

-- Q5: Empty / no hallucination (expect 0 rows)
SELECT id FROM apartments
WHERE status = 'active' AND bedrooms >= 10
LIMIT 5;

-- Q6: EXPLAIN index use (data-009 M3 gate)
EXPLAIN (FORMAT TEXT)
SELECT id FROM apartments
WHERE status = 'active'
  AND neighborhood = 'Laureles'
  AND bedrooms = 2
  AND price_daily <= 100
ORDER BY price_daily
LIMIT 20;

-- Q7: Lead + apartment FK (data-020)
SELECT l.id, l.intent, l.apartment_id, a.title AS listing_title
FROM leads l
LEFT JOIN apartments a ON a.id = l.apartment_id
WHERE l.intent = 'rental'
ORDER BY l.created_at DESC
LIMIT 10;
