-- ============================================================================
-- SAN-492 · EVT-033 — Event Venue + Offerings Schema
-- Model: partner_locations reuse. SoT: mdeapp/docs/tasks/events/data/VENUE-DATA-MODEL.md (Appendix A)
--
-- ⚠️  STATUS: AUTHORED — NOT YET APPLIED to any environment.
--     Gate before apply: human ERD sign-off + `get_advisors(security)` clean + RLS smoke.
--     Apply via review/PR → `supabase db push` (or apply_migration) ONLY after sign-off.
--
-- Scope:
--   EXTEND  partner_locations  (event-capable venue identity)
--   CREATE  venue_event_offerings, venue_event_packages  (children of partner_locations)
--   REUSE   bookings           (booking_type='event' proposals — + is_admin() queue path + resource guard)
--   UNTOUCHED: event_venues (ticketed-event rooms), venue_booking_requests (café/table only)
--   DO NOT CREATE: partner_venues / venues / event_venue_bookings
--
-- Helpers used (verified live 2026-06-09): update_updated_at(), partner_ids_for_user(), is_admin(), partner_is_active().
-- Rollback: VENUE-DATA-MODEL.md §A.6.
-- ============================================================================

begin;

-- RLS-safe active check: anon cannot SELECT partners; public policies must not subquery it.
create or replace function public.partner_is_active(_partner_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.partners p
    where p.id = _partner_id and p.status = 'active'::partner_status
  );
$$;

-- ── A.1  partner_locations: extend (event-capable venue identity) ────────────
alter table public.partner_locations
  add column accepts_event_bookings boolean not null default false,
  add column is_verified            boolean not null default false,
  add column capacity_seated        integer,
  add column capacity_standing      integer,
  add constraint partner_locations_capacity_seated_check
    check (capacity_seated   is null or capacity_seated   >= 0),
  add constraint partner_locations_capacity_standing_check
    check (capacity_standing is null or capacity_standing >= 0);

-- dedupe (SAN-493 seed safety): one place per partner; global place uniqueness when present
create unique index partner_locations_partner_place_uniq
  on public.partner_locations (partner_id, google_place_id)
  where google_place_id is not null;

-- public CTA filter index
create index partner_locations_event_capable_idx
  on public.partner_locations (is_verified)
  where accepts_event_bookings;

-- public read: verified + event-capable + parent partner active (no leak of unready venues)
create policy partner_locations_public_event_select on public.partner_locations
  for select to anon, authenticated
  using (
    accepts_event_bookings
    and is_verified
    and (select public.partner_is_active(partner_id))
  );

-- ── A.2  venue_event_offerings (CREATE) ──────────────────────────────────────
create table public.venue_event_offerings (
  id                  uuid primary key default gen_random_uuid(),
  partner_location_id uuid not null references public.partner_locations(id) on delete cascade,
  offering_key        text not null,                       -- e.g. 'birthday','corporate','rooftop'
  event_types         text[] not null default '{}',
  amenities           text[] not null default '{}',
  minimum_spend         numeric check (minimum_spend         is null or minimum_spend         >= 0),
  price_per_person_from numeric check (price_per_person_from is null or price_per_person_from >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_location_id, offering_key)
);
create index venue_event_offerings_location_idx
  on public.venue_event_offerings (partner_location_id);
create trigger venue_event_offerings_updated_at
  before update on public.venue_event_offerings
  for each row execute function public.update_updated_at();

alter table public.venue_event_offerings enable row level security;

create policy veo_public_select on public.venue_event_offerings
  for select to anon, authenticated
  using (exists (
    select 1 from public.partner_locations pl
    where pl.id = partner_location_id
      and pl.accepts_event_bookings
      and pl.is_verified
      and (select public.partner_is_active(pl.partner_id))
  ));
create policy veo_service_write on public.venue_event_offerings
  for all to service_role using (true) with check (true);
create policy veo_member_write on public.venue_event_offerings
  for all to authenticated
  using (exists (
    select 1 from public.partner_locations pl
    where pl.id = partner_location_id
      and (pl.partner_id in (select partner_ids_for_user()) or (select is_admin()))
  ))
  with check (exists (
    select 1 from public.partner_locations pl
    where pl.id = partner_location_id
      and (pl.partner_id in (select partner_ids_for_user()) or (select is_admin()))
  ));

-- ── A.3  venue_event_packages (CREATE) ───────────────────────────────────────
create table public.venue_event_packages (
  id                  uuid primary key default gen_random_uuid(),
  partner_location_id uuid not null references public.partner_locations(id) on delete cascade,
  name        text not null,
  description text,
  price_from  numeric not null check (price_from >= 0),
  min_guests  integer not null check (min_guests > 0),
  max_guests  integer not null check (max_guests >= min_guests),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_location_id, name)
);
create index venue_event_packages_location_idx
  on public.venue_event_packages (partner_location_id);
create trigger venue_event_packages_updated_at
  before update on public.venue_event_packages
  for each row execute function public.update_updated_at();

alter table public.venue_event_packages enable row level security;

create policy vep_public_select on public.venue_event_packages
  for select to anon, authenticated
  using (exists (
    select 1 from public.partner_locations pl
    where pl.id = partner_location_id
      and pl.accepts_event_bookings
      and pl.is_verified
      and (select public.partner_is_active(pl.partner_id))
  ));
create policy vep_service_write on public.venue_event_packages
  for all to service_role using (true) with check (true);
create policy vep_member_write on public.venue_event_packages
  for all to authenticated
  using (exists (
    select 1 from public.partner_locations pl
    where pl.id = partner_location_id
      and (pl.partner_id in (select partner_ids_for_user()) or (select is_admin()))
  ))
  with check (exists (
    select 1 from public.partner_locations pl
    where pl.id = partner_location_id
      and (pl.partner_id in (select partner_ids_for_user()) or (select is_admin()))
  ));

-- ── A.3  bookings: Patricia admin queue path (is_admin) — proposals reuse bookings ──
-- (booking_type='event' + partner_status pending|approved|declined already live; no column change)
create policy bookings_admin_select on public.bookings
  for select to authenticated
  using ((select is_admin()));
create policy bookings_admin_update on public.bookings
  for update to authenticated
  using ((select is_admin())) with check ((select is_admin()));

-- ── A.5  bookings.resource_id integrity guard (no FK possible — polymorphic) ──
-- bookings.resource_id is polymorphic by booking_type; only booking_type='event' must
-- reference a verified, event-capable partner_locations row whose parent partner is active.
create or replace function public.bookings_validate_event_resource()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.booking_type = 'event' then
    if new.resource_id is null then
      raise exception 'event booking requires resource_id';
    end if;
    if new.partner_id is null then
      raise exception 'event booking requires partner_id';
    end if;
    if not exists (
      select 1
      from public.partner_locations pl
      join public.partners p on p.id = pl.partner_id
      where pl.id = new.resource_id
        and pl.accepts_event_bookings
        and pl.is_verified
        and p.status = 'active'
        and p.id = new.partner_id
    ) then
      raise exception
        'bookings.resource_id % must be a verified event-capable partner_location for active partner %',
        new.resource_id, new.partner_id;
    end if;
  end if;
  return new;
end;
$$;

create trigger bookings_event_resource_guard
  before insert or update of resource_id, booking_type on public.bookings
  for each row execute function public.bookings_validate_event_resource();

commit;
