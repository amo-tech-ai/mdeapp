-- PTR-008 / SAN-683 — partner_locations (pins / addresses)
-- Purpose: venue/host/broker location rows for dashboard + map
-- Depends: ptr005

begin;

create table if not exists public.partner_locations (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners (id) on delete cascade,
  label text,
  address text,
  neighborhood text,
  lat double precision,
  lng double precision,
  google_place_id text,
  is_primary boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.partner_locations is
  'Partner-owned locations for map pins and address display.';

create index if not exists idx_partner_locations_partner_id
  on public.partner_locations (partner_id);

create index if not exists idx_partner_locations_primary
  on public.partner_locations (partner_id)
  where is_primary = true;

drop trigger if exists partner_locations_updated_at on public.partner_locations;
create trigger partner_locations_updated_at
  before update on public.partner_locations
  for each row
  execute function public.update_updated_at();

alter table public.partner_locations enable row level security;

drop policy if exists partner_locations_select_member on public.partner_locations;
create policy partner_locations_select_member
  on public.partner_locations
  for select
  to authenticated
  using (
    partner_id in (select public.partner_ids_for_user())
    or (select public.is_admin())
  );

drop policy if exists partner_locations_insert_member on public.partner_locations;
create policy partner_locations_insert_member
  on public.partner_locations
  for insert
  to authenticated
  with check (partner_id in (select public.partner_ids_for_user()));

drop policy if exists partner_locations_update_member on public.partner_locations;
create policy partner_locations_update_member
  on public.partner_locations
  for update
  to authenticated
  using (partner_id in (select public.partner_ids_for_user()) or (select public.is_admin()))
  with check (partner_id in (select public.partner_ids_for_user()) or (select public.is_admin()));

drop policy if exists partner_locations_delete_member on public.partner_locations;
create policy partner_locations_delete_member
  on public.partner_locations
  for delete
  to authenticated
  using (partner_id in (select public.partner_ids_for_user()) or (select public.is_admin()));

drop policy if exists partner_locations_service_role on public.partner_locations;
create policy partner_locations_service_role
  on public.partner_locations
  to service_role
  using (true)
  with check (true);

grant all on table public.partner_locations to authenticated, service_role;

commit;
