-- SECURITY: Revoke PUBLIC EXECUTE on SECURITY DEFINER functions that are
-- service_role-only callers (edge functions / Mastra backend).
--
-- These functions had the default PUBLIC grant (=X/postgres). The prior migration
-- (20260606112500) used REVOKE FROM anon/authenticated which only removes explicit
-- role grants — it does not affect the PUBLIC grant. REVOKE FROM PUBLIC is required.
--
-- After this migration ACL for affected functions: {postgres=X/postgres, service_role=X/postgres}
-- anon and authenticated lose access (PUBLIC inheritance removed).
-- service_role retains EXECUTE — all production callers use service_role.
--
-- record_check_in is excluded here — handled in 20260606112500 (had explicit anon
-- grant, not PUBLIC; authenticated is intentionally kept for the check-in scanner).

-- Outbox pipeline
REVOKE EXECUTE ON FUNCTION public.outbox_enqueue(text, text, text, jsonb, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.outbox_claim(text, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.outbox_mark_failed(uuid, text, timestamptz) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.outbox_mark_sent(uuid, text) FROM PUBLIC;

-- Agent telemetry
REVOKE EXECUTE ON FUNCTION public.fn_record_tool_call_start(uuid, text, integer, jsonb, text, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_record_tool_call_end(uuid, text, jsonb, text) FROM PUBLIC;

-- HITL approval system
REVOKE EXECUTE ON FUNCTION public.request_approval(text, text, text, jsonb, text, text, uuid, integer) FROM PUBLIC;

-- Waitlist backend
REVOKE EXECUTE ON FUNCTION public.fn_notify_next_in_line(uuid) FROM PUBLIC;

-- OpenClaw marketing integration
REVOKE EXECUTE ON FUNCTION public.fn_insert_conversation(jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_upsert_delivery_log(jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_update_conversation_intent(text, text, numeric, text) FROM PUBLIC;
