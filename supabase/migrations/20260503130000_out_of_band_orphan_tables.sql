-- migration: out_of_band_orphan_tables   (DATA-050 / B3 — orphan base-table recovery)
--
-- Five tables created in production via direct SQL, never committed as ordered migrations.
-- First consumers: 20260524024118 (event_media_assets FK), 20260531215952 data049 (indexes).
--
-- ALREADY EXISTS IN PROD — register without re-running DDL:
--   supabase migration repair --status applied 20260503130000
--
-- Source: live schema introspection 2026-06-01 (columns, constraints, policies, indexes).
-- Timestamp after event_phase1 (events + event_tickets + set_updated_at exist).
BEGIN;

-- fn_apply_approval_decision — required by approval_decisions trigger
CREATE OR REPLACE FUNCTION public.fn_apply_approval_decision()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_outbox_id uuid;
  v_new_status text;
BEGIN
  v_new_status := CASE NEW.decision
    WHEN 'approve' THEN 'approved'
    WHEN 'reject' THEN 'rejected'
    ELSE 'pending'
  END;

  UPDATE public.approval_requests
  SET status = v_new_status,
      decided_at = pg_catalog.now(),
      decided_by = NEW.decided_by
  WHERE id = NEW.request_id
  RETURNING outbox_id INTO v_outbox_id;

  IF v_outbox_id IS NOT NULL AND to_regclass('public.outbox') IS NOT NULL THEN
    UPDATE public.outbox
    SET status = CASE v_new_status
                   WHEN 'approved' THEN 'approved'
                   ELSE 'cancelled'
                 END,
        updated_at = pg_catalog.now()
    WHERE id = v_outbox_id;
  END IF;

  RETURN NEW;
END;
$$;

-- 1. approval_requests (hub — create before approval_decisions)
CREATE TABLE IF NOT EXISTS public.approval_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent text NOT NULL,
  action_type text NOT NULL,
  subject text NOT NULL,
  payload jsonb NOT NULL,
  risk_level text NOT NULL DEFAULT 'low'
    CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'cancelled')),
  requested_by text NOT NULL,
  requested_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by uuid REFERENCES auth.users(id),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  outbox_id uuid,
  notes text
);

CREATE INDEX IF NOT EXISTS approval_requests_pending
  ON public.approval_requests(status, risk_level DESC, requested_at)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_approval_requests_outbox_id
  ON public.approval_requests(outbox_id);

ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS approval_requests_auth_select ON public.approval_requests;
CREATE POLICY approval_requests_auth_select
  ON public.approval_requests FOR SELECT TO authenticated
  USING (public.is_admin() OR requested_by = ((SELECT auth.uid()))::text);

DROP POLICY IF EXISTS approval_requests_no_anon ON public.approval_requests;
CREATE POLICY approval_requests_no_anon
  ON public.approval_requests FOR ALL TO anon
  USING (false) WITH CHECK (false);

GRANT ALL ON TABLE public.approval_requests TO anon, authenticated, service_role;

-- 2. approval_decisions
CREATE TABLE IF NOT EXISTS public.approval_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.approval_requests(id) ON DELETE CASCADE,
  decision text NOT NULL
    CHECK (decision IN ('approve', 'reject', 'request_changes')),
  decided_by uuid NOT NULL REFERENCES auth.users(id),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_approval_decisions_request_id
  ON public.approval_decisions(request_id);

ALTER TABLE public.approval_decisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS approval_decisions_auth_select ON public.approval_decisions;
CREATE POLICY approval_decisions_auth_select
  ON public.approval_decisions FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS approval_decisions_no_anon ON public.approval_decisions;
CREATE POLICY approval_decisions_no_anon
  ON public.approval_decisions FOR ALL TO anon
  USING (false) WITH CHECK (false);

DROP TRIGGER IF EXISTS tg_apply_approval_decision ON public.approval_decisions;
CREATE TRIGGER tg_apply_approval_decision
  AFTER INSERT ON public.approval_decisions
  FOR EACH ROW EXECUTE FUNCTION public.fn_apply_approval_decision();

GRANT ALL ON TABLE public.approval_decisions TO anon, authenticated, service_role;

-- 3. email_outbox
CREATE TABLE IF NOT EXISTS public.email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_run_id uuid,
  campaign_id uuid,
  post_id uuid,
  approval_id uuid,
  provider text NOT NULL DEFAULT 'resend',
  channel text NOT NULL DEFAULT 'email',
  to_email text NOT NULL,
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'dispatching', 'sent', 'failed', 'dead')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  external_id text,
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  last_error text
);

CREATE INDEX IF NOT EXISTS email_outbox_dispatch_idx
  ON public.email_outbox(status, next_attempt_at)
  WHERE status IN ('queued', 'failed');
CREATE UNIQUE INDEX IF NOT EXISTS email_outbox_idempotency_idx
  ON public.email_outbox((payload ->> 'idempotency_key'), provider)
  WHERE status IN ('queued', 'dispatching', 'sent');
CREATE INDEX IF NOT EXISTS idx_email_outbox_agent_run_id
  ON public.email_outbox(agent_run_id);

ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "email_outbox service_role" ON public.email_outbox;
CREATE POLICY "email_outbox service_role"
  ON public.email_outbox FOR ALL
  USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.email_outbox TO anon, authenticated, service_role;

-- 4. event_media_assets
CREATE TABLE IF NOT EXISTS public.event_media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  asset_type text NOT NULL
    CHECK (asset_type IN (
      'hero_photo', 'gallery_photo', 'flyer', 'sponsor_logo', 'speaker_photo',
      'venue_layout', 'stage_render', 'run_of_show', 'contract', 'other'
    )),
  storage_bucket text NOT NULL,
  storage_path text NOT NULL,
  public_url text,
  filename text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 52428800),
  caption text,
  alt_text text,
  display_order integer NOT NULL DEFAULT 0,
  uploaded_by uuid REFERENCES auth.users(id),
  copyright_owner text,
  sponsor_id uuid,
  is_public boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (storage_bucket, storage_path)
);

CREATE INDEX IF NOT EXISTS event_media_assets_event_idx
  ON public.event_media_assets(event_id);
CREATE INDEX IF NOT EXISTS event_media_assets_public
  ON public.event_media_assets(event_id) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS event_media_assets_type_idx
  ON public.event_media_assets(event_id, asset_type);
CREATE INDEX IF NOT EXISTS event_media_assets_uploaded_by_idx
  ON public.event_media_assets(uploaded_by) WHERE uploaded_by IS NOT NULL;

DROP TRIGGER IF EXISTS event_media_assets_set_updated_at ON public.event_media_assets;
CREATE TRIGGER event_media_assets_set_updated_at
  BEFORE UPDATE ON public.event_media_assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.event_media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS media_organizer_all ON public.event_media_assets;
CREATE POLICY media_organizer_all ON public.event_media_assets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_media_assets.event_id
        AND e.organizer_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_media_assets.event_id
        AND e.organizer_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS media_public_select ON public.event_media_assets;
CREATE POLICY media_public_select ON public.event_media_assets FOR SELECT
  USING (
    is_public = true
    AND EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_media_assets.event_id
        AND e.status IN ('published', 'live', 'closed')
    )
  );

GRANT ALL ON TABLE public.event_media_assets TO anon, authenticated, service_role;

-- 5. event_wait_list
CREATE TABLE IF NOT EXISTS public.event_wait_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_type_id uuid NOT NULL REFERENCES public.event_tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  phone text,
  position integer NOT NULL,
  status text NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'notified', 'claimed', 'expired', 'removed')),
  notified_at timestamptz,
  hold_expires_at timestamptz,
  claimed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ticket_type_id, position),
  UNIQUE (ticket_type_id, user_id)
);

CREATE INDEX IF NOT EXISTS event_wait_list_hold_expires
  ON public.event_wait_list(hold_expires_at) WHERE status = 'notified';
CREATE INDEX IF NOT EXISTS event_wait_list_ticket_status_pos
  ON public.event_wait_list(ticket_type_id, status, position) WHERE status = 'waiting';
CREATE INDEX IF NOT EXISTS idx_event_wait_list_event_id
  ON public.event_wait_list(event_id);

ALTER TABLE public.event_wait_list ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_blocked_wait_list ON public.event_wait_list;
CREATE POLICY anon_blocked_wait_list ON public.event_wait_list FOR ALL TO anon
  USING (false);

DROP POLICY IF EXISTS service_role_full_wait_list ON public.event_wait_list;
CREATE POLICY service_role_full_wait_list ON public.event_wait_list FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS users_join_wait_list ON public.event_wait_list;
CREATE POLICY users_join_wait_list ON public.event_wait_list FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS users_remove_themselves ON public.event_wait_list;
CREATE POLICY users_remove_themselves ON public.event_wait_list FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (status = 'removed');

DROP POLICY IF EXISTS users_see_own_wait_list ON public.event_wait_list;
CREATE POLICY users_see_own_wait_list ON public.event_wait_list FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

GRANT ALL ON TABLE public.event_wait_list TO anon, authenticated, service_role;

-- Deferred FKs (targets may not exist in replay path yet)
DO $$
BEGIN
  IF to_regclass('public.outbox') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_constraint WHERE conname = 'approval_requests_outbox_id_fkey'
     ) THEN
    ALTER TABLE public.approval_requests
      ADD CONSTRAINT approval_requests_outbox_id_fkey
      FOREIGN KEY (outbox_id) REFERENCES public.outbox(id);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('marketing.campaign_approvals') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_constraint WHERE conname = 'email_outbox_approval_id_fkey'
     ) THEN
    ALTER TABLE public.email_outbox
      ADD CONSTRAINT email_outbox_approval_id_fkey
      FOREIGN KEY (approval_id) REFERENCES marketing.campaign_approvals(id) ON DELETE SET NULL;
  END IF;

  IF to_regclass('marketing.marketing_campaigns') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_constraint WHERE conname = 'email_outbox_campaign_id_fkey'
     ) THEN
    ALTER TABLE public.email_outbox
      ADD CONSTRAINT email_outbox_campaign_id_fkey
      FOREIGN KEY (campaign_id) REFERENCES marketing.marketing_campaigns(id) ON DELETE CASCADE;
  END IF;

  IF to_regclass('marketing.campaign_posts') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_constraint WHERE conname = 'email_outbox_post_id_fkey'
     ) THEN
    ALTER TABLE public.email_outbox
      ADD CONSTRAINT email_outbox_post_id_fkey
      FOREIGN KEY (post_id) REFERENCES marketing.campaign_posts(id) ON DELETE CASCADE;
  END IF;
END $$;

COMMIT;
