-- PTR-006 / SAN-683 — partner_drafts (signup wizard autosave)
-- Purpose: SAN-665 wizard persistence + Mastra thread_id link
-- Depends: ptr005

begin;

create table if not exists public.partner_drafts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type public.partner_type not null,
  step int not null default 1 check (step between 1 and 10),
  payload jsonb not null default '{}'::jsonb,
  completion_score smallint not null default 0
    check (completion_score between 0 and 100),
  thread_id text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.partner_drafts is
  'Partner signup wizard autosave. Source of truth for onboarding state (SAN-665).';

comment on column public.partner_drafts.thread_id is
  'Optional mastra_threads.id; resourceId convention partner-draft:{id}.';

create index if not exists idx_partner_drafts_profile_id
  on public.partner_drafts (profile_id);

create index if not exists idx_partner_drafts_partner_id
  on public.partner_drafts (partner_id)
  where partner_id is not null;

create unique index if not exists idx_partner_drafts_active_unique
  on public.partner_drafts (profile_id, type)
  where submitted_at is null;

drop trigger if exists partner_drafts_updated_at on public.partner_drafts;
create trigger partner_drafts_updated_at
  before update on public.partner_drafts
  for each row
  execute function public.update_updated_at();

alter table public.partner_drafts enable row level security;

drop policy if exists partner_drafts_select_own on public.partner_drafts;
create policy partner_drafts_select_own
  on public.partner_drafts
  for select
  to authenticated
  using (
    profile_id = (select auth.uid())
    or (select public.is_admin())
  );

drop policy if exists partner_drafts_insert_own on public.partner_drafts;
create policy partner_drafts_insert_own
  on public.partner_drafts
  for insert
  to authenticated
  with check (profile_id = (select auth.uid()));

drop policy if exists partner_drafts_update_own on public.partner_drafts;
create policy partner_drafts_update_own
  on public.partner_drafts
  for update
  to authenticated
  using (profile_id = (select auth.uid()) or (select public.is_admin()))
  with check (profile_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists partner_drafts_delete_own on public.partner_drafts;
create policy partner_drafts_delete_own
  on public.partner_drafts
  for delete
  to authenticated
  using (profile_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists partner_drafts_service_role on public.partner_drafts;
create policy partner_drafts_service_role
  on public.partner_drafts
  to service_role
  using (true)
  with check (true);

grant all on table public.partner_drafts to authenticated, service_role;

commit;
