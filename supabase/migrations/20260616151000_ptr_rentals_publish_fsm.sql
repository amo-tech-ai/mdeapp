-- PTR-RENTALS-003 / SAN-1106 — listing_workflow_status FSM + publish RPCs

BEGIN;

ALTER TABLE public.apartments
  ADD COLUMN IF NOT EXISTS listing_workflow_status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS published_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS paused_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS ready_for_review_at timestamptz;

ALTER TABLE public.apartments
  DROP CONSTRAINT IF EXISTS apartments_listing_workflow_status_check;

ALTER TABLE public.apartments
  ADD CONSTRAINT apartments_listing_workflow_status_check
  CHECK (
    listing_workflow_status = ANY (
      ARRAY['draft', 'ready_for_review', 'published', 'paused', 'rejected']::text[]
    )
  );

UPDATE public.apartments
SET listing_workflow_status = 'published',
    published_at = COALESCE(published_at, updated_at, created_at)
WHERE status IN ('active', 'booked')
  AND listing_workflow_status = 'draft';

UPDATE public.apartments
SET listing_workflow_status = 'paused',
    paused_at = COALESCE(paused_at, updated_at, created_at)
WHERE status = 'inactive'
  AND listing_workflow_status = 'draft';

CREATE OR REPLACE FUNCTION public.assert_listing_workflow_transition(p_from text, p_to text)
RETURNS void
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  IF p_from = p_to THEN RETURN; END IF;
  IF p_from = 'draft' AND p_to = 'ready_for_review' THEN RETURN; END IF;
  IF p_from = 'ready_for_review' AND p_to IN ('published', 'rejected') THEN RETURN; END IF;
  IF p_from = 'published' AND p_to = 'paused' THEN RETURN; END IF;
  IF p_from = 'paused' AND p_to = 'published' THEN RETURN; END IF;
  IF p_from = 'rejected' AND p_to = 'draft' THEN RETURN; END IF;
  RAISE EXCEPTION 'invalid listing workflow transition: % → %', p_from, p_to USING ERRCODE = 'check_violation';
END;
$$;

CREATE OR REPLACE FUNCTION public.transition_listing_workflow(
  p_apartment_id uuid,
  p_target_status text,
  p_rejection_reason text DEFAULT NULL
)
RETURNS public.apartments
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_row public.apartments;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'authentication required' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_row FROM public.apartments WHERE id = p_apartment_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'apartment not found' USING ERRCODE = 'P0002';
  END IF;

  IF v_row.landlord_id IS NULL
     OR v_row.landlord_id NOT IN (SELECT public.acting_landlord_ids()) THEN
    RAISE EXCEPTION 'broker does not own this apartment' USING ERRCODE = '42501';
  END IF;

  PERFORM public.assert_listing_workflow_transition(v_row.listing_workflow_status, p_target_status);

  IF p_target_status = 'rejected' AND (p_rejection_reason IS NULL OR btrim(p_rejection_reason) = '') THEN
    RAISE EXCEPTION 'rejection_reason required when rejecting a listing' USING ERRCODE = 'check_violation';
  END IF;

  UPDATE public.apartments
  SET
    listing_workflow_status = p_target_status,
    ready_for_review_at = CASE WHEN p_target_status = 'ready_for_review' THEN now() ELSE ready_for_review_at END,
    published_at = CASE WHEN p_target_status = 'published' THEN now() ELSE published_at END,
    published_by = CASE WHEN p_target_status = 'published' THEN v_uid ELSE published_by END,
    paused_at = CASE WHEN p_target_status = 'paused' THEN now() ELSE paused_at END,
    rejection_reason = CASE
      WHEN p_target_status = 'rejected' THEN p_rejection_reason
      WHEN p_target_status = 'draft' THEN NULL
      ELSE rejection_reason
    END,
    status = CASE
      WHEN p_target_status = 'published' THEN 'active'
      WHEN p_target_status = 'paused' THEN 'inactive'
      ELSE status
    END,
    updated_at = now()
  WHERE id = p_apartment_id
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.request_listing_publish(p_apartment_id uuid)
RETURNS public.apartments
LANGUAGE sql SECURITY INVOKER SET search_path = public
AS $$ SELECT public.transition_listing_workflow(p_apartment_id, 'ready_for_review'); $$;

CREATE OR REPLACE FUNCTION public.publish_listing(p_apartment_id uuid)
RETURNS public.apartments
LANGUAGE sql SECURITY INVOKER SET search_path = public
AS $$ SELECT public.transition_listing_workflow(p_apartment_id, 'published'); $$;

CREATE OR REPLACE FUNCTION public.pause_listing(p_apartment_id uuid)
RETURNS public.apartments
LANGUAGE sql SECURITY INVOKER SET search_path = public
AS $$ SELECT public.transition_listing_workflow(p_apartment_id, 'paused'); $$;

REVOKE ALL ON FUNCTION public.assert_listing_workflow_transition(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.transition_listing_workflow(uuid, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.request_listing_publish(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.publish_listing(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.pause_listing(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.transition_listing_workflow(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.request_listing_publish(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_listing(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.pause_listing(uuid) TO authenticated;

COMMIT;
