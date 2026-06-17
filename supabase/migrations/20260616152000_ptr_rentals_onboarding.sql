-- PTR-RENTALS-004 / SAN-1107 — broker onboarding backend write contract

BEGIN;

CREATE OR REPLACE FUNCTION public.create_broker_onboarding_draft(
  p_display_name text,
  p_listing_title text DEFAULT 'Untitled listing',
  p_neighborhood text DEFAULT 'Medellín'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_profile public.landlord_profiles;
  v_apartment public.apartments;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'authentication required' USING ERRCODE = '42501';
  END IF;
  IF p_display_name IS NULL OR btrim(p_display_name) = '' THEN
    RAISE EXCEPTION 'display_name is required' USING ERRCODE = 'check_violation';
  END IF;

  INSERT INTO public.landlord_profiles (user_id, display_name, kind)
  VALUES (v_uid, btrim(p_display_name), 'agent')
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO v_profile FROM public.landlord_profiles WHERE user_id = v_uid;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'failed to upsert landlord profile' USING ERRCODE = 'P0001';
  END IF;

  SELECT * INTO v_apartment
  FROM public.apartments
  WHERE landlord_id = v_profile.id
    AND listing_workflow_status = 'draft'
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    INSERT INTO public.apartments (title, neighborhood, landlord_id, status, listing_workflow_status, created_by)
    VALUES (
      COALESCE(NULLIF(btrim(p_listing_title), ''), 'Untitled listing'),
      COALESCE(NULLIF(btrim(p_neighborhood), ''), 'Medellín'),
      v_profile.id,
      'inactive',
      'draft',
      v_uid
    )
    RETURNING * INTO v_apartment;
  END IF;

  RETURN jsonb_build_object(
    'landlord_profile_id', v_profile.id,
    'apartment_id', v_apartment.id,
    'listing_workflow_status', v_apartment.listing_workflow_status
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_broker_onboarding_draft(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_broker_onboarding_draft(text, text, text) TO authenticated;

COMMENT ON FUNCTION public.create_broker_onboarding_draft(text, text, text) IS
  'PTR onboarding: upsert landlord_profiles for auth.uid(), insert draft apartment with landlord_id.';

COMMIT;
