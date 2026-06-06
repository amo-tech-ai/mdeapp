-- PTR-004 / SAN-683 — partner_members (team + RLS anchor)
-- Purpose: maps profiles to partners for multi-user supply accounts
-- Depends: ptr003
-- Note: partner_ids_for_user() created in ptr005; member policies extended there

begin;

create table if not exists public.partner_members (
  partner_id uuid not null references public.partners (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'owner'
    check (role in ('owner', 'staff', 'billing')),
  created_at timestamptz not null default now(),
  primary key (partner_id, profile_id)
);

comment on table public.partner_members is
  'Team membership for partner accounts. Drives partner_ids_for_user() RLS helper.';

create index if not exists idx_partner_members_profile_id
  on public.partner_members (profile_id);

alter table public.partner_members enable row level security;

drop policy if exists partner_members_select_own on public.partner_members;
create policy partner_members_select_own
  on public.partner_members
  for select
  to authenticated
  using (
    profile_id = (select auth.uid())
    or (select public.is_admin())
  );

drop policy if exists partner_members_insert_service on public.partner_members;
create policy partner_members_insert_service
  on public.partner_members
  for insert
  to service_role
  with check (true);

drop policy if exists partner_members_update_admin on public.partner_members;
create policy partner_members_update_admin
  on public.partner_members
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists partner_members_delete_admin on public.partner_members;
create policy partner_members_delete_admin
  on public.partner_members
  for delete
  to authenticated
  using ((select public.is_admin()));

drop policy if exists partner_members_service_role on public.partner_members;
create policy partner_members_service_role
  on public.partner_members
  to service_role
  using (true)
  with check (true);

grant all on table public.partner_members to authenticated, service_role;

commit;
