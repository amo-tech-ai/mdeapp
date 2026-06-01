-- DATA-009 M1 — venue_booking_requests
-- Applied live: data009_venue_booking_requests (2026-05-29)

CREATE TABLE public.venue_booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  venue_kind text NOT NULL CHECK (venue_kind IN ('cafe', 'restaurant', 'nightclub')),
  place_id text NOT NULL,
  restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE SET NULL,
  venue_anchor_id uuid,
  party_size int CHECK (party_size > 0),
  requested_at timestamptz NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  notes text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'declined', 'cancelled')),
  source text NOT NULL DEFAULT 'web' CHECK (source IN ('web', 'chat', 'whatsapp')),
  idempotency_key text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_venue_booking_idempotency
  ON public.venue_booking_requests (user_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX idx_venue_booking_place_id ON public.venue_booking_requests (place_id);
CREATE INDEX idx_venue_booking_status_created ON public.venue_booking_requests (status, created_at DESC);

ALTER TABLE public.venue_booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY venue_booking_select_own ON public.venue_booking_requests
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY venue_booking_insert_own ON public.venue_booking_requests
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY venue_booking_service ON public.venue_booking_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);
