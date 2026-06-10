-- DATA-040: embedding_jobs queue; replace sync trg_ai_embed_* with enqueue triggers

CREATE TABLE public.embedding_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN (
    'apartment', 'event', 'restaurant', 'venue_anchor'
  )),
  entity_id uuid NOT NULL,
  content_hash text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'done', 'failed', 'skipped'
  )),
  model text NOT NULL DEFAULT 'gemini-embedding-001',
  dimensions int NOT NULL DEFAULT 768,
  attempts int NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

CREATE UNIQUE INDEX embedding_jobs_dedup_uidx
  ON public.embedding_jobs (entity_type, entity_id, content_hash)
  WHERE status IN ('pending', 'processing');

CREATE INDEX embedding_jobs_status_created_idx
  ON public.embedding_jobs (status, created_at)
  WHERE status = 'pending';

ALTER TABLE public.embedding_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY embedding_jobs_service_all ON public.embedding_jobs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.enqueue_embedding_job()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_entity_type text;
  v_hash text;
BEGIN
  CASE TG_TABLE_NAME
    WHEN 'apartments' THEN v_entity_type := 'apartment';
    WHEN 'events' THEN v_entity_type := 'event';
    WHEN 'restaurants' THEN v_entity_type := 'restaurant';
    ELSE RETURN NEW;
  END CASE;

  v_hash := md5(
    COALESCE(NEW.title, NEW.name, '') ||
    COALESCE(NEW.description, '') ||
    NEW.id::text
  );

  INSERT INTO public.embedding_jobs (entity_type, entity_id, content_hash, status)
  VALUES (v_entity_type, NEW.id, v_hash, 'pending')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ai_embed_apartment ON public.apartments;
DROP TRIGGER IF EXISTS trg_ai_embed_event ON public.events;
DROP TRIGGER IF EXISTS trg_ai_embed_restaurant ON public.restaurants;

CREATE TRIGGER trg_enqueue_embed_apartment
  AFTER INSERT OR UPDATE OF title, description, neighborhood, amenities
  ON public.apartments
  FOR EACH ROW
  WHEN (NEW.moderation_status = 'approved')
  EXECUTE FUNCTION public.enqueue_embedding_job();

CREATE TRIGGER trg_enqueue_embed_event
  AFTER INSERT OR UPDATE OF name, description, event_type, tags, address
  ON public.events
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION public.enqueue_embedding_job();

CREATE TRIGGER trg_enqueue_embed_restaurant
  AFTER INSERT OR UPDATE OF name, description, cuisine_types, ambiance, tags, address, price_level
  ON public.restaurants
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION public.enqueue_embedding_job();
