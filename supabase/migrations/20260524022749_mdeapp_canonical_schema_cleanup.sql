-- mdeapp canonical schema cleanup
-- Removes legacy chat, agent queue, duplicate rentals, trip planner, landlord marketplace,
-- sponsor/whatsapp stubs. Keeps Mastra + MVP inventory. Irreversible — backup remote first.

-- ── Triggers on tables we drop ─────────────────────────────────────────────
DROP TRIGGER IF EXISTS messages_realtime_broadcast ON public.messages;
DROP TRIGGER IF EXISTS trigger_messages_broadcast ON public.messages;
DROP TRIGGER IF EXISTS trg_update_conversation_on_message ON public.messages;
DROP TRIGGER IF EXISTS update_conversation_on_message ON public.messages;
DROP TRIGGER IF EXISTS auto_create_landlord_inbox_from_message ON public.messages;
DROP TRIGGER IF EXISTS conversations_updated_at ON public.conversations;
DROP TRIGGER IF EXISTS trigger_agent_jobs_broadcast ON public.agent_jobs;

-- ── Detach FKs before drops ───────────────────────────────────────────────
UPDATE public.ai_runs SET conversation_id = NULL WHERE conversation_id IS NOT NULL;
UPDATE public.leads SET conversation_id = NULL WHERE conversation_id IS NOT NULL;
UPDATE public.apartments SET landlord_id = NULL WHERE landlord_id IS NOT NULL;

-- ── Agent stack (replaced by mastra_* + ai_runs) ──────────────────────────
DROP TABLE IF EXISTS public.agent_tool_calls CASCADE;
DROP TABLE IF EXISTS public.agent_approvals CASCADE;
DROP TABLE IF EXISTS public.agent_errors CASCADE;
DROP TABLE IF EXISTS public.agent_runs CASCADE;
DROP TABLE IF EXISTS public.agent_jobs CASCADE;
DROP TABLE IF EXISTS public.agent_budgets CASCADE;
DROP TABLE IF EXISTS public.agent_audit_log CASCADE;

-- ── Legacy edge chat (replaced by mastra_messages) ──────────────────────
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.ai_context CASCADE;
DROP TABLE IF EXISTS public.chat_events CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;

-- ── Trip planner + misc verticals (not mdeapp) ────────────────────────────
DROP TABLE IF EXISTS public.trip_items CASCADE;
DROP TABLE IF EXISTS public.proactive_suggestions CASCADE;
DROP TABLE IF EXISTS public.saved_places CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.budget_tracking CASCADE;
DROP TABLE IF EXISTS public.conflict_resolutions CASCADE;
DROP TABLE IF EXISTS public.collections CASCADE;
DROP TABLE IF EXISTS public.trips CASCADE;

-- ── Duplicate / unused rental tables ──────────────────────────────────────
DROP TABLE IF EXISTS public.rentals CASCADE;
DROP TABLE IF EXISTS public.car_rentals CASCADE;

-- ── Legacy landlord marketplace (MVP = apartments + leads only) ───────────
DROP TABLE IF EXISTS public.landlord_inbox CASCADE;
DROP TABLE IF EXISTS public.landlord_inbox_events CASCADE;
DROP TABLE IF EXISTS public.showings CASCADE;
DROP TABLE IF EXISTS public.rental_applications CASCADE;
DROP TABLE IF EXISTS public.property_verifications CASCADE;
DROP TABLE IF EXISTS public.rental_freshness_log CASCADE;
DROP TABLE IF EXISTS public.rental_listing_images CASCADE;
DROP TABLE IF EXISTS public.rental_listing_sources CASCADE;
DROP TABLE IF EXISTS public.rental_search_sessions CASCADE;
DROP TABLE IF EXISTS public.verification_requests CASCADE;
DROP VIEW IF EXISTS public.landlord_profiles_public CASCADE;
DROP VIEW IF EXISTS public.landlord_response_metrics CASCADE;
DROP TABLE IF EXISTS public.landlord_profiles CASCADE;

-- ── Sponsor + WhatsApp stubs (Phase 3+, empty) ───────────────────────────
DROP TABLE IF EXISTS public.event_sponsor_placements CASCADE;
DROP TABLE IF EXISTS public.event_sponsors CASCADE;
DROP TABLE IF EXISTS public.whatsapp_subscriptions CASCADE;
DROP TABLE IF EXISTS public.whatsapp_messages CASCADE;
DROP TABLE IF EXISTS public.whatsapp_conversations CASCADE;
DROP TABLE IF EXISTS public.wa_outbox CASCADE;

-- ── Empty ops / analytics tied to dropped domains ───────────────────────
DROP TABLE IF EXISTS public.posts_outbox CASCADE;
DROP TABLE IF EXISTS public.outbound_clicks CASCADE;
DROP TABLE IF EXISTS public.analytics_events_daily CASCADE;

-- ── Column cleanup on kept tables ───────────────────────────────────────
ALTER TABLE public.ai_runs DROP COLUMN IF EXISTS conversation_id;
ALTER TABLE public.leads DROP COLUMN IF EXISTS conversation_id;
