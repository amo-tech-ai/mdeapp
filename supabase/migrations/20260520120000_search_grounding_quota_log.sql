-- GS-003 — separate daily cap for Google Search grounding (not MCP quota).

create table if not exists public.search_grounding_quota_log (
  date date primary key default current_date,
  count integer not null default 0
);

comment on table public.search_grounding_quota_log is
  'Daily tally of Search grounding sidecar invokes (SEARCH_GROUNDING_DAILY_CAP).';

alter table public.search_grounding_quota_log enable row level security;

drop policy if exists "service_role_write" on public.search_grounding_quota_log;
create policy "service_role_write" on public.search_grounding_quota_log
  for all
  using ((select auth.role()) = 'service_role')
  with check ((select auth.role()) = 'service_role');
