-- migration: data049_advisor_remediation
-- purpose: remediate Supabase advisor findings from the 2026-05-31 forensic audit
--          (tasks/data/audit/05-supabase-audit.md). Three classes of fix, all
--          non-behavioral or purely additive:
--            1. drop redundant duplicate indexes (always keeping the
--               constraint-backed / unique index; only the redundant plain
--               index is dropped — no uniqueness guarantee is lost)
--            2. add covering indexes for public foreign keys that had none
--               (avoids seq-scan on joins / cascade deletes as data grows)
--            3. cache auth.uid() in the search_logs RLS policy + pin a stable
--               search_path on trigger_set_timestamps
-- affected: public schema only. no vendor mastra_* objects are dropped.
-- safety: no data is modified. dropping a redundant non-constraint index never
--         removes a uniqueness guarantee (the unique constraint index remains).
-- applied to remote: 2026-05-31 via MCP apply_migration (version 20260531215952).

-- ── 1. drop redundant duplicate indexes ──────────────────────────────────────
-- each line drops a plain index whose column set is already served by a
-- retained unique-constraint index on the same column(s). apartments pair is
-- advisor-confirmed byte-identical (neither backs a constraint → keep the
-- convention-named idx_apartments_landlord_id).
drop index if exists public.apartments_landlord_idx;                  -- keep idx_apartments_landlord_id
drop index if exists public.idx_bookings_confirmation;                -- keep bookings_confirmation_code_key (unique)
drop index if exists public.idx_budget_tracking_trip_id;              -- keep unique_budget_per_trip (unique)
drop index if exists public.idx_collections_share_token;              -- keep collections_share_token_key (unique)
drop index if exists public.event_order_refunds_stripe_idx;          -- keep event_order_refunds_stripe_refund_id_key (unique)
drop index if exists public.landlord_profiles_user_idx;               -- keep landlord_profiles_user_id_key (unique)
drop index if exists public.idx_payments_stripe_pi_unique;           -- keep payments_stripe_payment_intent_unique (constraint, unique)
drop index if exists public.idx_places_search_cache_query_hash;       -- keep places_search_cache_query_hash_key (unique)
drop index if exists public.idx_profiles_email;                       -- keep profiles_email_key (unique)
drop index if exists public.idx_property_verifications_apartment_id;  -- keep property_verifications_one_per_listing (unique)
drop index if exists public.idx_rental_listing_sources_key;           -- keep rental_listing_sources_source_key_key (unique)
drop index if exists public.idx_restaurants_google_place_id;          -- keep restaurants_google_place_id_key (unique)
drop index if exists public.suppression_lookup;                       -- keep suppression_list_channel_identifier_key (unique)
drop index if exists public.idx_tourist_destinations_google_place_id; -- keep locations_google_place_id_key (unique)
drop index if exists public.idx_user_preferences_user_id;             -- keep user_preferences_user_id_key (unique)
drop index if exists public.idx_whatsapp_conversations_phone_number;  -- keep whatsapp_conversations_phone_number_key (unique)
drop index if exists public.idx_whatsapp_messages_external_id;        -- keep uq_whatsapp_messages_external_id (unique)

-- ── 2. add covering indexes for unindexed public foreign keys ────────────────
create index if not exists idx_approval_decisions_decided_by on public.approval_decisions (decided_by);
create index if not exists idx_approval_requests_decided_by on public.approval_requests (decided_by);
create index if not exists idx_email_outbox_approval_id on public.email_outbox (approval_id);
create index if not exists idx_email_outbox_campaign_id on public.email_outbox (campaign_id);
create index if not exists idx_email_outbox_post_id on public.email_outbox (post_id);
create index if not exists idx_event_grounding_event_id on public.event_grounding (event_id);
create index if not exists idx_event_sponsor_placements_asset_id on public.event_sponsor_placements (asset_id);
create index if not exists idx_event_sponsors_approved_by on public.event_sponsors (approved_by);
create index if not exists idx_event_wait_list_user_id on public.event_wait_list (user_id);
create index if not exists idx_rental_grounding_apartment_id on public.rental_grounding (apartment_id);
create index if not exists idx_search_logs_user_id on public.search_logs (user_id);
create index if not exists idx_venue_booking_requests_restaurant_id on public.venue_booking_requests (restaurant_id);
create index if not exists idx_venue_booking_requests_venue_anchor_id on public.venue_booking_requests (venue_anchor_id);
create index if not exists idx_venue_source_evidence_restaurant_id on public.venue_source_evidence (restaurant_id);
create index if not exists idx_venue_source_evidence_venue_anchor_id on public.venue_source_evidence (venue_anchor_id);

-- ── 3a. fix search_logs RLS initplan: cache auth.uid() per-query ─────────────
-- behavioral-equivalent: (select auth.uid()) evaluates once per query instead
-- of once per row. paired select policy required for the own-row read.
drop policy if exists search_logs_authenticated_own_select on public.search_logs;
create policy search_logs_authenticated_own_select on public.search_logs
  for select to authenticated
  using (user_id = (select auth.uid()));

-- ── 3b. pin a stable search_path on trigger_set_timestamps ───────────────────
-- resolves advisor function_search_path_mutable. the body references only
-- NEW/OLD and now() (pg_catalog, always resolvable) so an empty search_path is
-- safe and removes the search-path-injection surface.
alter function public.trigger_set_timestamps() set search_path = '';
