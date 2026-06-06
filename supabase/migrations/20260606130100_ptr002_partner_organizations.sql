-- PTR-002 / SAN-683 — partner_organizations (public; not sponsor.organizations)
-- Purpose: legal/display entity for supply-side partners
-- Depends: ptr001
-- Note: member-scoped SELECT/UPDATE policies added in ptr005 after RLS helpers exist

begin;

create table if not exists public.partner_organizations (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  display_name text not null,
  tax_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.partner_organizations is
  'Partner business entity (public). Distinct from sponsor.organizations (B2B sponsor stack).';

create index if not exists idx_partner_organizations_display_name
  on public.partner_organizations (display_name);

drop trigger if exists partner_organizations_updated_at on public.partner_organizations;
create trigger partner_organizations_updated_at
  before update on public.partner_organizations
  for each row
  execute function public.update_updated_at();

alter table public.partner_organizations enable row level security;

drop policy if exists partner_organizations_select_admin on public.partner_organizations;
create policy partner_organizations_select_admin
  on public.partner_organizations
  for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists partner_organizations_insert_service on public.partner_organizations;
create policy partner_organizations_insert_service
  on public.partner_organizations
  for insert
  to service_role
  with check (true);

drop policy if exists partner_organizations_update_admin on public.partner_organizations;
create policy partner_organizations_update_admin
  on public.partner_organizations
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists partner_organizations_delete_admin on public.partner_organizations;
create policy partner_organizations_delete_admin
  on public.partner_organizations
  for delete
  to authenticated
  using ((select public.is_admin()));

drop policy if exists partner_organizations_service_role on public.partner_organizations;
create policy partner_organizations_service_role
  on public.partner_organizations
  to service_role
  using (true)
  with check (true);

grant all on table public.partner_organizations to authenticated, service_role;

commit;
