-- PTR-007 / SAN-683 — partner_services (enabled SKUs / tiers)
-- Purpose: dashboard services tab; Postiz/OpenClaw flags per partner
-- Depends: ptr005

begin;

create table if not exists public.partner_services (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners (id) on delete cascade,
  service_key text not null,
  tier text not null default 'free',
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_id, service_key)
);

comment on table public.partner_services is
  'Per-partner enabled services (ai_menu, postiz, lead_qual, etc.).';

create index if not exists idx_partner_services_partner_id
  on public.partner_services (partner_id);

drop trigger if exists partner_services_updated_at on public.partner_services;
create trigger partner_services_updated_at
  before update on public.partner_services
  for each row
  execute function public.update_updated_at();

alter table public.partner_services enable row level security;

drop policy if exists partner_services_select_member on public.partner_services;
create policy partner_services_select_member
  on public.partner_services
  for select
  to authenticated
  using (
    partner_id in (select public.partner_ids_for_user())
    or (select public.is_admin())
  );

drop policy if exists partner_services_insert_member on public.partner_services;
create policy partner_services_insert_member
  on public.partner_services
  for insert
  to authenticated
  with check (partner_id in (select public.partner_ids_for_user()));

drop policy if exists partner_services_update_member on public.partner_services;
create policy partner_services_update_member
  on public.partner_services
  for update
  to authenticated
  using (partner_id in (select public.partner_ids_for_user()) or (select public.is_admin()))
  with check (partner_id in (select public.partner_ids_for_user()) or (select public.is_admin()));

drop policy if exists partner_services_delete_member on public.partner_services;
create policy partner_services_delete_member
  on public.partner_services
  for delete
  to authenticated
  using (partner_id in (select public.partner_ids_for_user()) or (select public.is_admin()));

drop policy if exists partner_services_service_role on public.partner_services;
create policy partner_services_service_role
  on public.partner_services
  to service_role
  using (true)
  with check (true);

grant all on table public.partner_services to authenticated, service_role;

commit;
