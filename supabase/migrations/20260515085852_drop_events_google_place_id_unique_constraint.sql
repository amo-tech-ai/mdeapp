-- Events can share a google_place_id because many events happen at the same venue.
-- e.g. 6 concerts at Estadio Atanasio Girardot, 3 festivals at Parque Norte, etc.
-- UNIQUE(google_place_id) on events is architecturally wrong — removing it.
-- Restaurants and tourist_destinations keep their unique constraints (each is a distinct place).
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_google_place_id_key;
