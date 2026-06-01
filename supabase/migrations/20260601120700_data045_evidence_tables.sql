-- DATA-045: venue_source_evidence + event_grounding + rental_grounding

CREATE TABLE public.venue_source_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_kind text NOT NULL,
  restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE CASCADE,
  venue_anchor_id uuid REFERENCES public.venue_anchors(id) ON DELETE CASCADE,
  source_type text NOT NULL,
  source_url text,
  source_title text,
  extracted_text text,
  confidence numeric(4,3) DEFAULT 0.5,
  checked_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT venue_evidence_one_parent CHECK (
    (restaurant_id IS NOT NULL)::int + (venue_anchor_id IS NOT NULL)::int = 1
  )
);

CREATE TABLE public.event_grounding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  source_type text NOT NULL,
  source_url text,
  claim text NOT NULL,
  confidence numeric(4,3) DEFAULT 0.5,
  checked_at timestamptz DEFAULT now()
);

CREATE TABLE public.rental_grounding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id uuid NOT NULL REFERENCES public.apartments(id) ON DELETE CASCADE,
  source_type text NOT NULL,
  source_url text,
  extracted_text text,
  confidence numeric(4,3) DEFAULT 0.5,
  checked_at timestamptz DEFAULT now()
);

ALTER TABLE public.venue_source_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_grounding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_grounding ENABLE ROW LEVEL SECURITY;

CREATE POLICY venue_source_evidence_public_select ON public.venue_source_evidence FOR SELECT USING (true);
CREATE POLICY venue_source_evidence_service_write ON public.venue_source_evidence
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY event_grounding_public_select ON public.event_grounding FOR SELECT USING (true);
CREATE POLICY event_grounding_service_write ON public.event_grounding
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY rental_grounding_public_select ON public.rental_grounding FOR SELECT USING (true);
CREATE POLICY rental_grounding_service_write ON public.rental_grounding
  FOR ALL TO service_role USING (true) WITH CHECK (true);
