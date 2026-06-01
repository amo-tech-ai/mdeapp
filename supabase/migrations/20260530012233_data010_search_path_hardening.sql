-- DATA-010 — Pin search_path on advisor-flagged public functions (lint 0011)
-- Project: zkwcbyxiwklihegjhuql
-- Canonical copy: supabase/migrations/20260530012233_data010_search_path_hardening.sql
-- Remote-applied version: 20260530012233 (DATA-010b aligns repo to live history)
-- Standard: SET search_path = '' + fully qualified public.* (mde-supabase)

-- P0 — Andrés ticket / guest order path
CREATE OR REPLACE FUNCTION public.get_anonymous_order(p_order_id uuid, p_access_token text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_order public.event_orders%ROWTYPE;
BEGIN
  SELECT * INTO v_order FROM public.event_orders
   WHERE id = p_order_id AND access_token = p_access_token AND status IN ('paid','refunded','partial_refund');
  IF NOT FOUND THEN RETURN NULL; END IF;
  RETURN jsonb_build_object(
    'order',     row_to_json(v_order),
    'event',     (SELECT row_to_json(e) FROM public.events e WHERE e.id = v_order.event_id),
    'attendees', (SELECT jsonb_agg(row_to_json(a)) FROM public.event_attendees a WHERE a.order_id = p_order_id)
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.ticket_payment_finalize_response(
  v_event public.events,
  v_order public.event_orders,
  v_ticket public.event_tickets
)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT jsonb_build_object(
    'event',     row_to_json(v_event),
    'order',     row_to_json(v_order),
    'ticket',    row_to_json(v_ticket),
    'attendees', (SELECT jsonb_agg(row_to_json(a)) FROM public.event_attendees a WHERE a.order_id = v_order.id)
  );
$function$;

CREATE OR REPLACE FUNCTION public.ticket_payment_refund(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_order public.event_orders%ROWTYPE;
BEGIN
  SELECT * INTO v_order FROM public.event_orders WHERE id = p_order_id FOR UPDATE;
  IF v_order.status NOT IN ('paid','partial_refund') THEN
    RAISE EXCEPTION 'ORDER_NOT_REFUNDABLE: %', v_order.status;
  END IF;

  UPDATE public.event_attendees SET status = 'refunded' WHERE order_id = p_order_id AND status = 'active';
  UPDATE public.event_orders    SET status = 'refunded' WHERE id = p_order_id;

  UPDATE public.event_tickets
     SET qty_sold = GREATEST(0, qty_sold - v_order.quantity)
   WHERE id = v_order.ticket_id;
END;
$function$;

-- P1 — lead + messaging + check-in
CREATE OR REPLACE FUNCTION public.record_check_in(
  p_event_id uuid,
  p_attendee_id uuid,
  p_qr_token text,
  p_scanned_by uuid,
  p_scanner_device text,
  p_ip_address inet,
  p_result text,
  p_details jsonb
)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  INSERT INTO public.event_check_ins
    (event_id, attendee_id, qr_token, scanned_by, scanner_device, ip_address, result, details)
  VALUES
    (p_event_id, p_attendee_id, p_qr_token, p_scanned_by, p_scanner_device, p_ip_address, p_result, p_details)
  RETURNING id;
$function$;

CREATE OR REPLACE FUNCTION public.compute_lead_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  s  int  := 0;
  bd jsonb := '{}'::jsonb;
BEGIN
  IF NEW.email IS NOT NULL THEN
    s := s + 30; bd := bd || '{"email":30}'::jsonb;
  END IF;
  IF NEW.phone IS NOT NULL THEN
    s := s + 40; bd := bd || '{"phone":40}'::jsonb;
  END IF;
  IF NEW.budget_min IS NOT NULL OR NEW.budget_max IS NOT NULL THEN
    s := s + 20; bd := bd || '{"budget":20}'::jsonb;
  END IF;
  IF (NEW.metadata->>'move_in_date') IS NOT NULL THEN
    s := s + 20; bd := bd || '{"move_in_date":20}'::jsonb;
  END IF;
  IF (NEW.metadata->>'ready_to_apply') = 'true' THEN
    s := s + 50; bd := bd || '{"ready_to_apply":50}'::jsonb;
  END IF;
  NEW.score          := s;
  NEW.score_breakdown := bd;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      message_count   = message_count + 1,
      updated_at      = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$function$;

-- P2 — FTS helpers + timestamp triggers
CREATE OR REPLACE FUNCTION public.fts_spanish(content text)
RETURNS tsvector
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $function$
  SELECT to_tsvector('spanish', content);
$function$;

CREATE OR REPLACE FUNCTION public.fts_array_to_text(arr text[])
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $function$
  SELECT coalesce(array_to_string(arr, ' '), '');
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamps()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW."createdAt" = NOW();
    NEW."updatedAt" = NOW();
    NEW."createdAtZ" = NOW();
    NEW."updatedAtZ" = NOW();
  ELSIF TG_OP = 'UPDATE' THEN
    NEW."updatedAt" = NOW();
    NEW."updatedAtZ" = NOW();
    NEW."createdAt" = OLD."createdAt";
    NEW."createdAtZ" = OLD."createdAtZ";
  END IF;
  RETURN NEW;
END;
$function$;
