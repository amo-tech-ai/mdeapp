-- RLS Audit Fixes — 2026-05-16
-- Source: forensic RLS audit against live local Supabase (152 policies / 40 tables).
-- Addresses 3 critical findings:
--
--   C1 — outbound_clicks: RLS enabled, zero policies → silent data loss for affiliate analytics
--   C2 — proactive_suggestions: public role on SELECT/UPDATE → wasted per-row evaluation for anon
--   C3 — proactive_suggestions: no INSERT policy → authenticated users cannot create suggestions
--   W1 — agent_jobs: missing index on user_id → full table scan on every policy check
--   W2 — outbound_clicks: missing index on user_id (same pattern)
--
-- NOT in this migration (tracked separately):
--   C4 — profiles: missing DELETE policy (intentional soft-delete — needs PRD confirmation)
--   C5 — 44 policies with redundant profiles JOIN → separate refactor migration (no prod impact, perf only)
--   C6 — places_search_cache / place_details_cache / grounding_quota_log not in local DB
--          → fix supabase db reset blocker (COMMENT ON POLICY storage.objects error)

-- ─── C1: outbound_clicks — zero policies ─────────────────────────────────────
-- This table has RLS enabled but no policies: all queries are silently blocked.
-- Service role: full access for edge function writes (affiliate click logging).
-- Authenticated: insert own row + view own rows. No public read.

create policy "service_role_manage_outbound_clicks"
  on public.outbound_clicks
  for all to service_role
  using (true)
  with check (true);

create policy "authenticated_can_insert_own_clicks"
  on public.outbound_clicks
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "authenticated_can_view_own_clicks"
  on public.outbound_clicks
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- W2: index required by the SELECT/INSERT policies on outbound_clicks
create index if not exists idx_outbound_clicks_user_id
  on public.outbound_clicks using btree (user_id);

-- ─── W1: agent_jobs — missing index on user_id ───────────────────────────────
-- Three policies filter on user_id without an index → full scan per policy check.

create index if not exists idx_agent_jobs_user_id
  on public.agent_jobs using btree (user_id);

-- ─── C2: proactive_suggestions — service_role policy used {public} workaround ──
-- Original: FOR ALL TO public USING (auth.role() = 'service_role')
-- This runs qual check for all users instead of letting Postgres prune by role.
-- Replace with a proper service_role policy.

drop policy if exists "Service role can manage all suggestions" on public.proactive_suggestions;

create policy "service_role_manage_proactive_suggestions"
  on public.proactive_suggestions
  for all to service_role
  using (true)
  with check (true);

-- C2: change SELECT and UPDATE roles from {public} to {authenticated}.
-- auth.uid() returns null for anon users; evaluating these policies for anon
-- wastes CPU on a guaranteed-false check every row.

alter policy "Users can view their own suggestions"
  on public.proactive_suggestions
  to authenticated;

alter policy "Users can update their own suggestions"
  on public.proactive_suggestions
  to authenticated;

-- ─── C3: proactive_suggestions — INSERT policy missing ───────────────────────
-- Authenticated users could not insert their own suggestions. Adding the policy.

create policy "authenticated_can_insert_own_suggestions"
  on public.proactive_suggestions
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
