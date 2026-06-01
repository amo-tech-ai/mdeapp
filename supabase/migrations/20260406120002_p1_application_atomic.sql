-- P1 CRM atomic RPC: start a rental application (lead + application) in one transaction.
-- Split from original 20260406120000.

CREATE OR REPLACE FUNCTION public.p1_start_rental_application_atomic(
  p_user_id uuid,
  p_idempotency_key text,
  p_neighborhood_id uuid,
  p_source text,
  p_notes text,
  p_lead_metadata jsonb,
  p_apartment_id uuid,
  p_application_metadata jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lead public.leads%ROWTYPE;
  v_app public.rental_applications%ROWTYPE;
BEGIN
  IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) < 8 THEN
    RAISE EXCEPTION 'idempotency_key required (min 8 chars)';
  END IF;

  INSERT INTO public.leads (
    user_id, neighborhood_id, source, notes, metadata, idempotency_key
  )
  VALUES (
    p_user_id, p_neighborhood_id,
    COALESCE(nullif(trim(p_source), ''), 'web'),
    p_notes,
    COALESCE(p_lead_metadata, '{}'::jsonb),
    p_idempotency_key
  )
  ON CONFLICT (user_id, idempotency_key) WHERE idempotency_key IS NOT NULL
  DO UPDATE SET updated_at = now()
  RETURNING * INTO v_lead;

  SELECT * INTO v_app
  FROM public.rental_applications
  WHERE applicant_id = p_user_id AND idempotency_key = p_idempotency_key;

  IF NOT FOUND THEN
    BEGIN
      INSERT INTO public.rental_applications (
        lead_id, apartment_id, applicant_id, status, metadata, idempotency_key
      )
      VALUES (
        v_lead.id, p_apartment_id, p_user_id, 'draft',
        COALESCE(p_application_metadata, '{}'::jsonb),
        p_idempotency_key
      )
      RETURNING * INTO v_app;
    EXCEPTION
      WHEN unique_violation THEN
        SELECT * INTO v_app
        FROM public.rental_applications
        WHERE applicant_id = p_user_id AND idempotency_key = p_idempotency_key;
    END;
  END IF;

  RETURN jsonb_build_object('lead', to_jsonb(v_lead), 'application', to_jsonb(v_app));
END;
$$;
