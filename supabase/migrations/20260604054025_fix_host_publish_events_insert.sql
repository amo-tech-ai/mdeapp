-- Fix two live-DB bugs that block host event publish (SAN-366 / EVT-002).
-- Both found empirically: any INSERT of a published event into public.events
-- failed, so the host wizard publish (and /host/events showing the host's events)
-- could never work on prod.
--
--   Bug 1: events_source_check rejected 'host_wizard' — the exact `source` the
--          approval-commit edge fn writes -> publish failed with 23514.
--   Bug 2: enqueue_embedding_job() (data040) referenced NEW.title unconditionally.
--          public.events has `name`, no `title`; the AFTER INSERT trigger fires
--          WHEN (NEW.is_active = true) -- true for published rows -- so every
--          published insert failed with 42703 "record new has no field title".
--
-- No new tables / no RLS change: only adjusts a CHECK constraint and a trigger
-- function body. Existing trg_enqueue_embed_* triggers pick up the new function
-- body via CREATE OR REPLACE (no trigger recreation needed).

-- Bug 1 -- allow the host-wizard source.
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_source_check;
ALTER TABLE public.events
  ADD CONSTRAINT events_source_check
  CHECK (
    source = ANY (
      ARRAY['google'::text, 'ticketmaster'::text, 'manual'::text,
            'ai_generated'::text, 'host_wizard'::text]
    )
  );

-- Bug 2 -- only read NEW.title for tables that have it. The TG_TABLE_NAME CASE
-- already exists; move the title/name pick inside it so NEW.title is never
-- evaluated for events/restaurants (PL/pgSQL resolves field access per branch).
CREATE OR REPLACE FUNCTION public.enqueue_embedding_job()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_entity_type text;
  v_title text;
  v_hash text;
BEGIN
  CASE TG_TABLE_NAME
    WHEN 'apartments' THEN
      v_entity_type := 'apartment';
      v_title := NEW.title;
    WHEN 'events' THEN
      v_entity_type := 'event';
      v_title := NEW.name;
    WHEN 'restaurants' THEN
      v_entity_type := 'restaurant';
      v_title := NEW.name;
    ELSE
      RETURN NEW;
  END CASE;

  v_hash := md5(
    COALESCE(v_title, '') ||
    COALESCE(NEW.description, '') ||
    NEW.id::text
  );

  INSERT INTO public.embedding_jobs (entity_type, entity_id, content_hash, status)
  VALUES (v_entity_type, NEW.id, v_hash, 'pending')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;
