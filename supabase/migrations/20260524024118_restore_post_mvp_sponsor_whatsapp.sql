-- migration: restore_post_mvp_sponsor_whatsapp
-- Split (DATA-048) from combined 20260524140000_restore_post_mvp_landlord_sponsor_whatsapp.sql.
-- Matches remote supabase_migrations.schema_migrations version 20260524024118. SQL body verbatim; no content change.
BEGIN;
CREATE TABLE IF NOT EXISTS public.event_sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  sponsor_org_id uuid NOT NULL,
  tier text NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'premium', 'title')),
  amount_cents int NOT NULL CHECK (amount_cents >= 0),
  currency text NOT NULL DEFAULT 'COP',
  contract_start_at timestamptz,
  contract_end_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'completed', 'cancelled')),
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, sponsor_org_id, tier)
);

CREATE INDEX IF NOT EXISTS event_sponsors_event_idx ON public.event_sponsors(event_id);
CREATE INDEX IF NOT EXISTS event_sponsors_org_idx ON public.event_sponsors(sponsor_org_id);
CREATE INDEX IF NOT EXISTS event_sponsors_status_idx ON public.event_sponsors(event_id, status);

DROP TRIGGER IF EXISTS event_sponsors_set_updated_at ON public.event_sponsors;
CREATE TRIGGER event_sponsors_set_updated_at BEFORE UPDATE ON public.event_sponsors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sponsors_public_active_select ON public.event_sponsors;
CREATE POLICY sponsors_public_active_select ON public.event_sponsors FOR SELECT
  USING (status IN ('approved', 'active') AND EXISTS (
    SELECT 1 FROM public.events e WHERE e.id = event_sponsors.event_id AND e.status IN ('published', 'live')
  ));
DROP POLICY IF EXISTS sponsors_organizer_all ON public.event_sponsors;
CREATE POLICY sponsors_organizer_all ON public.event_sponsors FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_sponsors.event_id AND e.organizer_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_sponsors.event_id AND e.organizer_id = (SELECT auth.uid())));
DROP POLICY IF EXISTS event_sponsors_service_role ON public.event_sponsors;
CREATE POLICY event_sponsors_service_role ON public.event_sponsors TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.event_sponsors TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.event_sponsor_placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_sponsor_id uuid NOT NULL REFERENCES public.event_sponsors(id) ON DELETE CASCADE,
  surface text NOT NULL CHECK (surface IN (
    'event_hero', 'ticket_pdf', 'confirmation_email', 'recap_email',
    'in_app_banner', 'contest_header', 'venue_signage', 'stage_screen', 'other'
  )),
  asset_id uuid REFERENCES public.event_media_assets(id),
  position int NOT NULL DEFAULT 0,
  weight numeric(4,2) NOT NULL DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 10),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_sponsor_placements_sponsor_idx ON public.event_sponsor_placements(event_sponsor_id);
CREATE INDEX IF NOT EXISTS event_sponsor_placements_surface_idx ON public.event_sponsor_placements(surface) WHERE is_active = true;

DROP TRIGGER IF EXISTS event_sponsor_placements_set_updated_at ON public.event_sponsor_placements;
CREATE TRIGGER event_sponsor_placements_set_updated_at BEFORE UPDATE ON public.event_sponsor_placements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.event_sponsor_placements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS placements_public_active_select ON public.event_sponsor_placements;
CREATE POLICY placements_public_active_select ON public.event_sponsor_placements FOR SELECT
  USING (is_active = true AND EXISTS (
    SELECT 1 FROM public.event_sponsors s WHERE s.id = event_sponsor_placements.event_sponsor_id AND s.status IN ('approved', 'active')
  ));
DROP POLICY IF EXISTS placements_organizer_all ON public.event_sponsor_placements;
CREATE POLICY placements_organizer_all ON public.event_sponsor_placements FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.event_sponsors s JOIN public.events e ON e.id = s.event_id
    WHERE s.id = event_sponsor_placements.event_sponsor_id AND e.organizer_id = (SELECT auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.event_sponsors s JOIN public.events e ON e.id = s.event_id
    WHERE s.id = event_sponsor_placements.event_sponsor_id AND e.organizer_id = (SELECT auth.uid())
  ));
DROP POLICY IF EXISTS event_sponsor_placements_service_role ON public.event_sponsor_placements;
CREATE POLICY event_sponsor_placements_service_role ON public.event_sponsor_placements TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.event_sponsor_placements TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL UNIQUE,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  message_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_conversations_message_count_check CHECK (message_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_phone_number ON public.whatsapp_conversations(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_last_message_at ON public.whatsapp_conversations(last_message_at DESC);

DROP TRIGGER IF EXISTS update_whatsapp_conversations_updated_at ON public.whatsapp_conversations;
CREATE TRIGGER update_whatsapp_conversations_updated_at BEFORE UPDATE ON public.whatsapp_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_select_conversations ON public.whatsapp_conversations;
CREATE POLICY service_role_select_conversations ON public.whatsapp_conversations FOR SELECT TO service_role USING (true);
DROP POLICY IF EXISTS service_role_insert_conversations ON public.whatsapp_conversations;
CREATE POLICY service_role_insert_conversations ON public.whatsapp_conversations FOR INSERT TO service_role WITH CHECK (true);
DROP POLICY IF EXISTS service_role_update_conversations ON public.whatsapp_conversations;
CREATE POLICY service_role_update_conversations ON public.whatsapp_conversations FOR UPDATE TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_delete_conversations ON public.whatsapp_conversations;
CREATE POLICY service_role_delete_conversations ON public.whatsapp_conversations FOR DELETE TO service_role USING (true);

GRANT ALL ON TABLE public.whatsapp_conversations TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  direction text NOT NULL,
  message_type text DEFAULT 'text'::text,
  content text NOT NULL,
  sender text NOT NULL,
  external_id text,
  status text DEFAULT 'pending'::text,
  created_at timestamptz NOT NULL DEFAULT now(),
  to_number text,
  raw_payload jsonb,
  CONSTRAINT whatsapp_messages_direction_check CHECK (direction = ANY (ARRAY['inbound', 'outbound']::text[])),
  CONSTRAINT whatsapp_messages_sender_check CHECK (sender = ANY (ARRAY['user', 'assistant']::text[])),
  CONSTRAINT whatsapp_messages_status_check CHECK (status = ANY (ARRAY['pending', 'sent', 'delivered', 'read', 'failed']::text[]))
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone_number ON public.whatsapp_messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON public.whatsapp_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_external_id ON public.whatsapp_messages(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone_created ON public.whatsapp_messages(phone_number, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_whatsapp_messages_external_id ON public.whatsapp_messages(external_id) WHERE external_id IS NOT NULL;

ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_select_messages ON public.whatsapp_messages;
CREATE POLICY service_role_select_messages ON public.whatsapp_messages FOR SELECT TO service_role USING (true);
DROP POLICY IF EXISTS service_role_insert_messages ON public.whatsapp_messages;
CREATE POLICY service_role_insert_messages ON public.whatsapp_messages FOR INSERT TO service_role WITH CHECK (true);
DROP POLICY IF EXISTS service_role_update_messages ON public.whatsapp_messages;
CREATE POLICY service_role_update_messages ON public.whatsapp_messages FOR UPDATE TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_delete_messages ON public.whatsapp_messages;
CREATE POLICY service_role_delete_messages ON public.whatsapp_messages FOR DELETE TO service_role USING (true);

GRANT ALL ON TABLE public.whatsapp_messages TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.whatsapp_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_e164 text NOT NULL,
  opted_in boolean DEFAULT true,
  saved_search jsonb DEFAULT '{}'::jsonb,
  conversation_id uuid,
  last_notified_at timestamptz,
  notification_frequency text DEFAULT 'daily' CHECK (notification_frequency IN ('realtime', 'daily', 'weekly', 'never')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_wa_subs_opted_in ON public.whatsapp_subscriptions(opted_in, last_notified_at) WHERE opted_in = true;

DROP TRIGGER IF EXISTS whatsapp_subscriptions_updated_at ON public.whatsapp_subscriptions;
CREATE TRIGGER whatsapp_subscriptions_updated_at BEFORE UPDATE ON public.whatsapp_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.whatsapp_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS wa_subs_own_select ON public.whatsapp_subscriptions;
CREATE POLICY wa_subs_own_select ON public.whatsapp_subscriptions FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS wa_subs_own_insert ON public.whatsapp_subscriptions;
CREATE POLICY wa_subs_own_insert ON public.whatsapp_subscriptions FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS wa_subs_own_update ON public.whatsapp_subscriptions;
CREATE POLICY wa_subs_own_update ON public.whatsapp_subscriptions FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS wa_subs_service ON public.whatsapp_subscriptions;
CREATE POLICY wa_subs_service ON public.whatsapp_subscriptions FOR ALL TO service_role USING (true);

GRANT ALL ON TABLE public.whatsapp_subscriptions TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.wa_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text UNIQUE,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'dispatching', 'sent', 'dead')),
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  last_error text,
  to_e164 text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wa_outbox_status_next ON public.wa_outbox(status, next_attempt_at);
ALTER TABLE public.wa_outbox ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS wa_outbox_service_role ON public.wa_outbox;
CREATE POLICY wa_outbox_service_role ON public.wa_outbox TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.wa_outbox TO service_role;
COMMIT;
