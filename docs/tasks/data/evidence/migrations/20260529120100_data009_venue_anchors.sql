-- DATA-009 M2 — venue_anchors + FK from M1
-- Applied live: data009_venue_anchors_m2 (2026-05-29)

CREATE TABLE public.venue_anchors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('cafe', 'nightclub')),
  name text NOT NULL,
  google_place_id text NOT NULL,
  neighborhood text,
  city text NOT NULL DEFAULT 'Medellín',
  latitude numeric,
  longitude numeric,
  tags text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  source text NOT NULL DEFAULT 'curated' CHECK (source IN ('curated', 'places_import')),
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT venue_anchors_place_id_kind_key UNIQUE (google_place_id, kind)
);

CREATE INDEX idx_venue_anchors_kind_active ON public.venue_anchors (kind, is_active);
CREATE INDEX idx_venue_anchors_neighborhood ON public.venue_anchors (neighborhood) WHERE is_active;

ALTER TABLE public.venue_anchors ENABLE ROW LEVEL SECURITY;

CREATE POLICY venue_anchors_public_select ON public.venue_anchors
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY venue_anchors_service_write ON public.venue_anchors
  FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE public.venue_booking_requests
  ADD CONSTRAINT venue_booking_anchor_fk
  FOREIGN KEY (venue_anchor_id) REFERENCES public.venue_anchors(id) ON DELETE SET NULL;
