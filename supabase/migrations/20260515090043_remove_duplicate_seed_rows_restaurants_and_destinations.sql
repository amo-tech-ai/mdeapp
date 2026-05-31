-- Remove seed rows that are exact duplicates of existing enriched rows.
-- These all have the pattern a1b2c3d4-* or b2c3d4e5-* IDs (synthetic seed UUIDs).
-- Their enrichment fails with UNIQUE constraint violations because another row
-- already holds the correct google_place_id for the same physical place.

-- Restaurants: Carmen and Oci.Mde seed rows duplicate existing enriched entries.
-- Mondongos seed (Centro branch) conflates with Mondongos Laureles/Poblado place_id.
DELETE FROM restaurants
WHERE id IN (
  'a1b2c3d4-e5f6-4789-abcd-100000000001',
  'a1b2c3d4-e5f6-4789-abcd-100000000003',
  'a1b2c3d4-e5f6-4789-abcd-100000000006'
);

-- Tourist destinations: 5 seed rows duplicate existing enriched entries.
DELETE FROM tourist_destinations
WHERE id IN (
  'b2c3d4e5-0002-0002-0002-000000000001',
  'b2c3d4e5-0002-0002-0002-000000000004',
  'b2c3d4e5-0002-0002-0002-000000000005',
  'b2c3d4e5-0002-0002-0002-000000000007',
  'b2c3d4e5-0002-0002-0002-000000000008'
);
