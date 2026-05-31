-- DATA-029 — commerce trip_id linkage
-- Applied live: data029_commerce_trip_id_linkage (2026-05-29)

ALTER TABLE public.event_orders
  ADD COLUMN IF NOT EXISTS trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL;

ALTER TABLE public.showings
  ADD COLUMN IF NOT EXISTS trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_event_orders_trip_id
  ON public.event_orders (trip_id) WHERE trip_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_trip_id
  ON public.leads (trip_id) WHERE trip_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_showings_trip_id
  ON public.showings (trip_id) WHERE trip_id IS NOT NULL;
