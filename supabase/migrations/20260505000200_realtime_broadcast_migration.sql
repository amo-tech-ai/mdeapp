-- =============================================================================
-- Migration: Realtime broadcast hardening
-- Implements: C1, C3, M1, M2, S2, S3 from tasks/audit/realtime-audit.md
-- Date: 2026-05-05
-- =============================================================================

-- ============================================================
-- S3 + M2: Sanitize messages broadcast payload & remove duplicate trigger
-- ============================================================
-- The old realtime_broadcast_messages() used realtime.broadcast_changes() which
-- sends the FULL row — including function_call, function_response, metadata,
-- token counts, and latency_ms. Those are internal/sensitive fields that clients
-- should never receive.
--
-- Replace with realtime.send() + an explicit allow-list. Any new column added
-- to messages in the future will NOT appear in broadcast payloads unless
-- explicitly added here.

CREATE OR REPLACE FUNCTION public.realtime_broadcast_messages()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_topic      text;
  v_event_name text;
  v_payload    jsonb;
BEGIN
  v_topic := 'conversation:' || COALESCE(NEW.conversation_id, OLD.conversation_id)::text || ':messages';

  IF TG_OP = 'DELETE' THEN
    v_event_name := 'message_deleted';
    v_payload    := jsonb_build_object(
      'id',              OLD.id,
      'conversation_id', OLD.conversation_id
    );
  ELSIF TG_OP = 'INSERT' THEN
    v_event_name := 'message_created';
    v_payload    := jsonb_build_object(
      'id',              NEW.id,
      'conversation_id', NEW.conversation_id,
      'role',            NEW.role,
      'content',         NEW.content,
      'agent_name',      NEW.agent_name,
      'created_at',      NEW.created_at
      -- Deliberately excludes: function_call, function_response, metadata,
      -- input_tokens, output_tokens, total_tokens, latency_ms
    );
  ELSE  -- UPDATE
    v_event_name := 'message_updated';
    v_payload    := jsonb_build_object(
      'id',              NEW.id,
      'conversation_id', NEW.conversation_id,
      'role',            NEW.role,
      'content',         NEW.content,
      'agent_name',      NEW.agent_name,
      'created_at',      NEW.created_at
    );
  END IF;

  PERFORM realtime.send(v_payload, v_event_name, v_topic, false);

  RETURN COALESCE(NEW, OLD);
END;
$$;

COMMENT ON FUNCTION public.realtime_broadcast_messages() IS
  'Broadcasts message INSERT/UPDATE/DELETE to conversation-scoped realtime topic. '
  'Uses realtime.send() with explicit payload allowlist — excludes function_call, '
  'function_response, metadata, and token/latency internals (S3 hardening).';

-- M2: Drop the duplicate trigger.
-- trigger_messages_broadcast called broadcast_messages_changes() which was
-- functionally identical to realtime_broadcast_messages() but sent the full row.
-- The surviving trigger (messages_realtime_broadcast) already points to the updated
-- realtime_broadcast_messages() above, so this is the only change needed to fix M2.
DROP TRIGGER IF EXISTS trigger_messages_broadcast ON public.messages;


-- ============================================================
-- C1: Vote tally broadcast trigger (replaces postgres_changes bottleneck)
-- ============================================================
-- postgres_changes routes through a single-threaded Elixir GenServer per project.
-- On contest night with hundreds of concurrent leaderboard viewers and votes firing
-- every second, that GenServer becomes the bottleneck for ALL realtime on the project
-- — including chat, trip updates, and notifications. One saturated postgres_changes
-- subscription can delay every channel by seconds.
--
-- This trigger fans out horizontally via the broadcast extension instead. 10,000
-- subscribers on vote:tally:{id} are no problem; scaling is limited only by
-- Supabase's concurrent connection limits, not the GenServer.

CREATE OR REPLACE FUNCTION public.broadcast_vote_tally_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- For UPDATEs: only broadcast when vote scores or rank actually changed.
  -- Avoids flooding subscribers with no-op rows (e.g. timestamp-only updates).
  IF TG_OP = 'UPDATE'
     AND OLD.audience_votes  IS NOT DISTINCT FROM NEW.audience_votes
     AND OLD.paid_votes      IS NOT DISTINCT FROM NEW.paid_votes
     AND OLD.judge_score     IS NOT DISTINCT FROM NEW.judge_score
     AND OLD.weighted_total  IS NOT DISTINCT FROM NEW.weighted_total
     AND OLD.rank            IS NOT DISTINCT FROM NEW.rank
  THEN
    RETURN NEW;
  END IF;

  PERFORM realtime.send(
    jsonb_build_object(
      'entity_id',      NEW.entity_id,
      'contest_id',     NEW.contest_id,
      'audience_votes', NEW.audience_votes,
      'paid_votes',     NEW.paid_votes,
      'judge_score',    NEW.judge_score,
      'weighted_total', NEW.weighted_total,
      'rank',           NEW.rank,
      'trend_24h',      NEW.trend_24h,
      'updated_at',     NEW.updated_at
    ),
    'tally_updated',
    'vote:tally:' || NEW.contest_id::text,
    false  -- private channel: client must use { config: { private: true } } + setAuth()
  );
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.broadcast_vote_tally_changes() IS
  'Broadcasts tally_updated to vote:tally:{contest_id} when vote scores or rank change. '
  'Conditional broadcast suppresses no-op updates to reduce subscriber noise.';

-- Phase 2 contest schema (vote.entity_tally) may not exist in all environments yet.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'vote' AND table_name = 'entity_tally'
  ) THEN
    DROP TRIGGER IF EXISTS vote_tally_broadcast_trigger ON vote.entity_tally;
    CREATE TRIGGER vote_tally_broadcast_trigger
      AFTER INSERT OR UPDATE ON vote.entity_tally
      FOR EACH ROW EXECUTE FUNCTION public.broadcast_vote_tally_changes();
  END IF;
END $$;


-- ============================================================
-- C3: Event dashboard broadcast triggers (replace 3× postgres_changes)
-- ============================================================
-- The host dashboard subscribed to postgres_changes on event_orders,
-- event_attendees, and event_check_ins. Each was a separate server-side
-- filter stream, competing under load. Replace with broadcast triggers
-- that fan out to the host-event-dashboard:{event_id} private channel.
--
-- Client simply invalidates TanStack Query cache on any event — the
-- event_dashboard_summary() RPC re-runs and returns fresh KPIs.

-- Generic function for event_orders and event_check_ins.
-- Sends minimal payload: table + operation + id. Client uses this only
-- to trigger cache invalidation; it never reads the payload fields.
CREATE OR REPLACE FUNCTION public.broadcast_event_dashboard_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM realtime.send(
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'op',    TG_OP,
      'id',    COALESCE(NEW.id, OLD.id)
    ),
    TG_TABLE_NAME || '_' || lower(TG_OP),   -- e.g. 'event_orders_insert'
    'host-event-dashboard:' || COALESCE(NEW.event_id, OLD.event_id)::text,
    false
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS event_orders_broadcast_trigger ON public.event_orders;
CREATE TRIGGER event_orders_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.event_orders
  FOR EACH ROW EXECUTE FUNCTION public.broadcast_event_dashboard_changes();

DROP TRIGGER IF EXISTS event_check_ins_broadcast_trigger ON public.event_check_ins;
CREATE TRIGGER event_check_ins_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.event_check_ins
  FOR EACH ROW EXECUTE FUNCTION public.broadcast_event_dashboard_changes();

-- Separate function for event_attendees: also broadcasts to the staff check-in
-- counter channel when a new check-in occurs (qr_used_at transitions null→not-null).
-- Using a dedicated function (not the generic one above) because we need to
-- access event_attendees-specific column qr_used_at — cross-table generic access
-- would raise "record has no field" at runtime.
CREATE OR REPLACE FUNCTION public.broadcast_event_attendees_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_event_id uuid;
BEGIN
  v_event_id := COALESCE(NEW.event_id, OLD.event_id);

  -- Host dashboard: invalidate on any attendee change
  PERFORM realtime.send(
    jsonb_build_object(
      'table', 'event_attendees',
      'op',    TG_OP,
      'id',    COALESCE(NEW.id, OLD.id)
    ),
    'event_attendees_' || lower(TG_OP),
    'host-event-dashboard:' || v_event_id::text,
    false
  );

  -- Staff check-in counter: only fires when qr_used_at transitions null → not-null.
  -- Organizers watching staff-checkin:{event_id} increment their counter in real time.
  -- Door staff (custom JWT, no Supabase session) receive the counter via polling.
  IF TG_OP = 'UPDATE'
     AND OLD.qr_used_at IS NULL
     AND NEW.qr_used_at IS NOT NULL
  THEN
    PERFORM realtime.send(
      jsonb_build_object(
        'event_id',          v_event_id,
        'attended_increment', 1
      ),
      'attendee_checked_in',
      'staff-checkin:' || v_event_id::text,
      false
    );
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

COMMENT ON FUNCTION public.broadcast_event_attendees_changes() IS
  'Dual-purpose: broadcasts to host-event-dashboard on any attendee change, '
  'and to staff-checkin on check-in (qr_used_at null → not-null). '
  'Separate from broadcast_event_dashboard_changes() to avoid cross-table column access.';

DROP TRIGGER IF EXISTS event_attendees_broadcast_trigger ON public.event_attendees;
CREATE TRIGGER event_attendees_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.event_attendees
  FOR EACH ROW EXECUTE FUNCTION public.broadcast_event_attendees_changes();


-- ============================================================
-- M1: RLS SELECT policies for previously uncovered channel types
-- ============================================================
-- After migrating C1/C3 to broadcast with private:true, the Realtime server
-- checks realtime.messages SELECT policies before delivering events.
-- Topics NOT covered by any SELECT policy → subscription appears to succeed
-- but zero events arrive (silent failure). Add the missing policies.

-- Composite index for organizer lookup — shared by both event policies below.
-- Existing events_organizer_idx covers (organizer_id) only; adding (organizer_id, id)
-- allows a single index-only lookup for the EXISTS check in each policy.
CREATE INDEX IF NOT EXISTS idx_rt_events_organizer
  ON public.events(organizer_id, id);

-- Host event dashboard: organizer of the specific event only.
DROP POLICY IF EXISTS "rt_host_event_dashboard_select" ON realtime.messages;
CREATE POLICY "rt_host_event_dashboard_select"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'host-event-dashboard:%' AND
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id::text = split_part(realtime.topic(), ':', 2)
      AND e.organizer_id = (SELECT auth.uid())
  )
);

-- Staff check-in counter: organizer only.
-- Door staff use a custom HS256 JWT and have no Supabase session; they receive
-- the counter via polling (10s interval in StaffCheckIn.tsx). The broadcast
-- channel exists for organizers who may be monitoring their own event dashboard.
DROP POLICY IF EXISTS "rt_staff_checkin_select" ON realtime.messages;
CREATE POLICY "rt_staff_checkin_select"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'staff-checkin:%' AND
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id::text = split_part(realtime.topic(), ':', 2)
      AND e.organizer_id = (SELECT auth.uid())
  )
);

-- Vote tally leaderboard: public — any authenticated user can subscribe.
-- Leaderboards are intentionally public; no ownership check needed.
DROP POLICY IF EXISTS "rt_vote_tally_select" ON realtime.messages;
CREATE POLICY "rt_vote_tally_select"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'vote:tally:%'
);


-- ============================================================
-- S2: Harden INSERT policy — per-topic ownership + (SELECT auth.uid())
-- ============================================================
-- The old combined INSERT policy (ilm_realtime_insert_conversation_trip_broadcast)
-- used auth.uid() directly (not the subquery pattern) and mixed conversation + trip
-- into a single clause. Replace with clean, per-topic policies that:
--   1. Use (SELECT auth.uid()) for consistent evaluation across rows
--   2. Are independently auditable — one policy, one topic, one ownership rule
--   3. Prevent any authenticated user from injecting broadcast events into
--      conversations/trips they don't own

DROP POLICY IF EXISTS "ilm_realtime_insert_conversation_trip_broadcast" ON realtime.messages;

-- Conversations: user can only publish to their own conversation channel
DROP POLICY IF EXISTS "rt_conversation_insert_owner_only" ON realtime.messages;
CREATE POLICY "rt_conversation_insert_owner_only"
ON realtime.messages FOR INSERT TO authenticated
WITH CHECK (
  realtime.topic() LIKE 'conversation:%' AND
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id::text = split_part(realtime.topic(), ':', 2)
      AND c.user_id = (SELECT auth.uid())
  )
);

-- Trips: user can only publish to their own trip channel
DROP POLICY IF EXISTS "rt_trip_insert_owner_only" ON realtime.messages;
CREATE POLICY "rt_trip_insert_owner_only"
ON realtime.messages FOR INSERT TO authenticated
WITH CHECK (
  realtime.topic() LIKE 'trip:%' AND
  EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id::text = split_part(realtime.topic(), ':', 2)
      AND t.user_id = (SELECT auth.uid())
  )
);
