-- EVT-001: Align public.events RLS with status + organizer_id (phase1 columns).
-- Replaces is_active-only SELECT policies; keeps service_role + admin delete.

-- Backfill legacy listings so public catalog does not go dark after status column default.
UPDATE public.events
SET status = 'published'
WHERE is_active = true
  AND status = 'draft';

CREATE OR REPLACE FUNCTION public.events_sync_legacy_is_active()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status IN ('published', 'live') THEN
      NEW.is_active := true;
    ELSIF NEW.status IN ('draft', 'closed', 'archived') THEN
      NEW.is_active := false;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS events_sync_legacy_is_active ON public.events;
CREATE TRIGGER events_sync_legacy_is_active
  BEFORE INSERT OR UPDATE OF status ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.events_sync_legacy_is_active();

DROP POLICY IF EXISTS "anon_can_view_active_events" ON public.events;
DROP POLICY IF EXISTS "authenticated_can_view_active_events" ON public.events;

CREATE POLICY "events_public_select_published"
  ON public.events
  FOR SELECT
  TO anon, authenticated
  USING (status IN ('published', 'live'));

CREATE POLICY "events_organizer_select_own"
  ON public.events
  FOR SELECT
  TO authenticated
  USING (organizer_id = (SELECT auth.uid()));

CREATE POLICY "events_organizer_insert_own"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (organizer_id = (SELECT auth.uid()));

CREATE POLICY "events_organizer_update_own"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING (organizer_id = (SELECT auth.uid()))
  WITH CHECK (organizer_id = (SELECT auth.uid()));

CREATE POLICY "events_admin_select_all"
  ON public.events
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_admin()));

CREATE POLICY "events_admin_insert"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "events_admin_update"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));
