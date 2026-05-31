-- =============================================================================
-- MASTRA-057: Maps Grounding Lite — durable daily quota counter
--
-- One row per calendar date (UTC date from Postgres CURRENT_DATE at insert time).
-- Mastra / server-side callers with SUPABASE_SERVICE_ROLE_KEY increment via:
--   insert ... on conflict (date) do update set count = grounding_quota_log.count + 1
--           returning count;
--
-- RLS blocks anon/authenticated; backend uses service role (bypass or matching policy).
-- Depends on: prior migrations only (no table prerequisites).
-- See: tasks/prompts/mastra/tasks/057-mastra-grounding-quota-log-migration.md
-- =============================================================================

create table if not exists public.grounding_quota_log (
  date date primary key default current_date,
  count integer not null default 0
);

comment on table public.grounding_quota_log is
  'Daily tally of Maps Grounding Lite MCP attempts for MAPS_GROUNDING_DAILY_LIMIT enforcement (MASTRA-049).';

alter table public.grounding_quota_log enable row level security;

-- Restrict operations to service_role JWT context only (defense in depth).
drop policy if exists "service_role_write" on public.grounding_quota_log;
create policy "service_role_write" on public.grounding_quota_log
  for all
  using ((select auth.role()) = 'service_role')
  with check ((select auth.role()) = 'service_role');
