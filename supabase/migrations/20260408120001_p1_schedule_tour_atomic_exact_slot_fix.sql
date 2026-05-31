-- Deployed DBs that already applied 20260407120000 with the ORDER BY fallback could return
-- a same-day showing at a different time as success. Replace function with exact-slot semantics.

CREATE OR REPLACE FUNCTION public.p1_schedule_tour_atomic(
  p_user_id uuid,
  p_idempotency_key text,
  p_neighborhood_id uuid,
  p_source text,
  p_email text,
  p_phone text,
  p_notes text,
  p_lead_metadata jsonb,
  p_apartment_id uuid,
  p_scheduled_at timestamptz,
  p_renter_notes text,
  p_showing_metadata jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lead public.leads%ROWTYPE;
  v_showing public.showings%ROWTYPE;
  v_scheduled timestamptz := p_scheduled_at;
BEGIN
  IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) < 8 THEN
    RAISE EXCEPTION 'idempotency_key required (min 8 chars)';
  END IF;

  INSERT INTO public.leads (
    user_id,
    neighborhood_id,
    source,
    email,
    phone,
    notes,
    metadata,
    idempotency_key
  )
  VALUES (
    p_user_id,
    p_neighborhood_id,
    COALESCE(nullif(trim(p_source), ''), 'web'),
    p_email,
    p_phone,
    p_notes,
    COALESCE(p_lead_metadata, '{}'::jsonb),
    p_idempotency_key
  )
  ON CONFLICT (user_id, idempotency_key) WHERE idempotency_key IS NOT NULL
  DO UPDATE SET updated_at = now()
  RETURNING * INTO v_lead;

  SELECT * INTO v_showing
  FROM public.showings
  WHERE lead_id = v_lead.id
    AND apartment_id = p_apartment_id
    AND scheduled_at = v_scheduled;

  IF NOT FOUND THEN
    BEGIN
      INSERT INTO public.showings (
        lead_id,
        apartment_id,
        scheduled_at,
        status,
        renter_notes,
        metadata
      )
      VALUES (
        v_lead.id,
        p_apartment_id,
        v_scheduled,
        'scheduled',
        p_renter_notes,
        COALESCE(p_showing_metadata, '{}'::jsonb)
      )
      RETURNING * INTO v_showing;
    EXCEPTION
      WHEN unique_violation THEN
        SELECT * INTO v_showing
        FROM public.showings
        WHERE lead_id = v_lead.id
          AND apartment_id = p_apartment_id
          AND scheduled_at = v_scheduled;

        IF NOT FOUND THEN
          -- Timezone-correct same-day guard: match idx_showings_lead_apt_day which uses
          -- America/Bogota. Session-tz ::date would mis-bucket rows around midnight Bogota time
          -- (e.g. 23:30 BOG becomes day+1 in UTC), causing the guard to miss real conflicts.
          IF EXISTS (
            SELECT 1
            FROM public.showings s
            WHERE s.lead_id = v_lead.id
              AND s.apartment_id = p_apartment_id
              AND (s.scheduled_at AT TIME ZONE 'America/Bogota')::date
                  = (v_scheduled AT TIME ZONE 'America/Bogota')::date
          ) THEN
            RAISE EXCEPTION 'p1_schedule_tour_atomic: a showing already exists this calendar day (America/Bogota) for this lead and apartment (different time)'
              USING ERRCODE = 'P0001',
                HINT = 'Cancel or reschedule the existing showing, or choose another day.';
          ELSE
            RAISE EXCEPTION 'p1_schedule_tour_atomic: could not create showing (unique constraint)'
              USING ERRCODE = 'P0001';
          END IF;
        END IF;
    END;
  END IF;

  IF v_showing.id IS NULL THEN
    RAISE EXCEPTION 'p1_schedule_tour_atomic: showing not created or resolved'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN jsonb_build_object(
    'lead', to_jsonb(v_lead),
    'showing', to_jsonb(v_showing)
  );
END;
$$;

COMMENT ON FUNCTION public.p1_schedule_tour_atomic IS
  'Single-transaction tour request: idempotent lead + exact showing slot; same-day index rejects a second time — errors instead of returning the wrong slot.';
