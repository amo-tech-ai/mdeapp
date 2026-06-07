-- PTR-003 / SAN-683 — partners (supply-side account)
-- Purpose: one row per profile+vertical; bridges events, apartments, sponsor, landlord
-- Depends: ptr001, ptr002, profiles, landlord_profiles, sponsor.organizations
-- Note: member-scoped policies added in ptr005 after RLS helpers exist

begin;

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.partner_organizations (id) on delete set null,
  profile_id uuid not null references public.profiles (id) on delete restrict,
  type public.partner_type not null,
  status public.partner_status not null default 'draft',
  completion_score smallint not null default 0
    check (completion_score between 0 and 100),
  sponsor_organization_id uuid references sponsor.organizations (id) on delete set null,
  landlord_profile_id uuid references public.landlord_profiles (id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.partners is
  'Supply-side partner account. profile_id = profiles.id (= auth.uid()). Reuse via type-specific bridges.';

comment on column public.partners.sponsor_organization_id is
  'When type=sponsor, links to sponsor.organizations without duplicating sponsor schema.';

comment on column public.partners.landlord_profile_id is
  'When type=broker, links to landlord_profiles rental supply stack.';

comment on column public.partners.settings is
  'M1 automation stubs (M4: partner_automations table).';

create unique index if not exists idx_partners_profile_type
  on public.partners (profile_id, type);

create index if not exists idx_partners_status
  on public.partners (status);

create index if not exists idx_partners_organization_id
  on public.partners (organization_id)
  where organization_id is not null;

create index if not exists idx_partners_sponsor_organization_id
  on public.partners (sponsor_organization_id)
  where sponsor_organization_id is not null;

create index if not exists idx_partners_landlord_profile_id
  on public.partners (landlord_profile_id)
  where landlord_profile_id is not null;

drop trigger if exists partners_updated_at on public.partners;
create trigger partners_updated_at
  before update on public.partners
  for each row
  execute function public.update_updated_at();

alter table public.partners enable row level security;

drop policy if exists partners_select_owner on public.partners;
create policy partners_select_owner
  on public.partners
  for select
  to authenticated
  using (
    profile_id = (select auth.uid())
    or (select public.is_admin())
  );

drop policy if exists partners_insert_service on public.partners;
create policy partners_insert_service
  on public.partners
  for insert
  to service_role
  with check (true);

drop policy if exists partners_update_admin on public.partners;
create policy partners_update_admin
  on public.partners
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists partners_delete_admin on public.partners;
create policy partners_delete_admin
  on public.partners
  for delete
  to authenticated
  using ((select public.is_admin()));

drop policy if exists partners_service_role on public.partners;
create policy partners_service_role
  on public.partners
  to service_role
  using (true)
  with check (true);

grant all on table public.partners to authenticated, service_role;

commit;
