-- DATA-027 — trip_items CHECK extension + insert_trip_item_for_user RPC
-- Applied live: data027_trip_items_check_and_rpc (2026-05-29)

ALTER TABLE public.trip_items DROP CONSTRAINT IF EXISTS trip_items_item_type_check;
ALTER TABLE public.trip_items ADD CONSTRAINT trip_items_item_type_check
  CHECK (item_type IN (
    'rental','event','restaurant','poi','showing','booking','custom_note','other'
  ));

CREATE OR REPLACE FUNCTION public.insert_trip_item_for_user(
  p_trip_id uuid,
  p_item_type text,
  p_source_id uuid,
  p_title text DEFAULT NULL,
  p_start_at timestamptz DEFAULT NULL,
  p_end_at timestamptz DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_item_id uuid;
  v_title text;
  v_lat numeric;
  v_lng numeric;
  v_address text;
  v_found boolean := false;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM trips t WHERE t.id = p_trip_id AND t.user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Trip not found or not owned by user';
  END IF;

  v_title := NULL;
  v_lat := NULL;
  v_lng := NULL;
  v_address := NULL;

  CASE p_item_type
    WHEN 'event' THEN
      SELECT e.title, NULL::numeric, NULL::numeric, NULL::text
      INTO v_title, v_lat, v_lng, v_address
      FROM events e WHERE e.id = p_source_id;
      v_found := FOUND;
    WHEN 'restaurant' THEN
      SELECT r.name, r.latitude, r.longitude, r.address
      INTO v_title, v_lat, v_lng, v_address
      FROM restaurants r WHERE r.id = p_source_id;
      v_found := FOUND;
    WHEN 'rental' THEN
      SELECT a.title, a.latitude, a.longitude, a.address
      INTO v_title, v_lat, v_lng, v_address
      FROM apartments a WHERE a.id = p_source_id;
      v_found := FOUND;
    WHEN 'showing' THEN
      SELECT COALESCE(p_title, 'Showing'), NULL::numeric, NULL::numeric, NULL::text
      INTO v_title, v_lat, v_lng, v_address
      FROM showings s WHERE s.id = p_source_id;
      v_found := FOUND;
    WHEN 'booking' THEN
      SELECT COALESCE(p_title, 'Booking'), NULL::numeric, NULL::numeric, NULL::text
      INTO v_title, v_lat, v_lng, v_address
      FROM bookings b WHERE b.id = p_source_id;
      v_found := FOUND;
    WHEN 'custom_note', 'poi', 'other' THEN
      v_title := COALESCE(p_title, 'Item');
      v_found := true;
    ELSE
      RAISE EXCEPTION 'Unsupported item_type: %', p_item_type;
  END CASE;

  IF NOT v_found OR (v_title IS NULL AND p_item_type NOT IN ('custom_note', 'poi', 'other')) THEN
    RAISE EXCEPTION 'Source entity not found for type % id %', p_item_type, p_source_id;
  END IF;

  v_title := COALESCE(p_title, v_title, 'Item');

  INSERT INTO trip_items (
    trip_id, item_type, source_id, title, start_at, end_at,
    latitude, longitude, address, created_by
  )
  VALUES (
    p_trip_id, p_item_type, p_source_id, v_title, p_start_at, p_end_at,
    v_lat, v_lng, v_address, v_user_id
  )
  ON CONFLICT (trip_id, item_type, source_id)
  DO UPDATE SET
    title = EXCLUDED.title,
    start_at = COALESCE(EXCLUDED.start_at, trip_items.start_at),
    end_at = COALESCE(EXCLUDED.end_at, trip_items.end_at),
    updated_at = now()
  RETURNING id INTO v_item_id;

  RETURN v_item_id;
END;
$$;

REVOKE ALL ON FUNCTION public.insert_trip_item_for_user(uuid, text, uuid, text, timestamptz, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.insert_trip_item_for_user(uuid, text, uuid, text, timestamptz, timestamptz) TO authenticated;
