-- Landlord V1 base tables stub — local dev only.
-- These tables exist in production (created via direct SQL in early sprints)
-- but were never committed as local migrations. Without them,
-- supabase db reset fails when later landlord_v1_* migrations try to create
-- views and functions that reference these tables.
--
-- These stubs contain the minimum schema required by:
--   - 20260501204538_landlord_v1_response_metrics.sql
--   - 20260501204754_landlord_v1_response_metrics_filter_orphans.sql
--
-- When the full landlord table migrations are added (from the production schema),
-- replace this file with the authoritative migrations.

-- 1. landlord_profiles — one row per landlord user
create table if not exists public.landlord_profiles (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade,
  display_name   text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
alter table public.landlord_profiles enable row level security;

create policy "service_role_manage_landlord_profiles"
  on public.landlord_profiles for all to service_role
  using (true) with check (true);

create policy "landlords_view_own_profile"
  on public.landlord_profiles for select to authenticated
  using ((select auth.uid()) = user_id);

-- 2. landlord_inbox — one row per renter inquiry routed to a landlord
create table if not exists public.landlord_inbox (
  id              uuid primary key default gen_random_uuid(),
  landlord_id     uuid references public.landlord_profiles(id) on delete set null,
  apartment_id    uuid references public.apartments(id) on delete set null,
  user_id         uuid references auth.users(id) on delete set null,
  status          text not null default 'new'
                  check (status in ('new','viewed','replied','archived')),
  created_at      timestamptz not null default now(),
  viewed_at       timestamptz,
  first_reply_at  timestamptz,
  archived_at     timestamptz
);
alter table public.landlord_inbox enable row level security;

create policy "service_role_manage_landlord_inbox"
  on public.landlord_inbox for all to service_role
  using (true) with check (true);

create index if not exists idx_landlord_inbox_landlord_id
  on public.landlord_inbox using btree (landlord_id);
create index if not exists idx_landlord_inbox_created_at
  on public.landlord_inbox using btree (created_at);

-- 3. analytics_events_daily — daily KPI snapshots per landlord
create table if not exists public.analytics_events_daily (
  landlord_id              uuid not null references public.landlord_profiles(id) on delete cascade,
  date                     date not null,
  logins                   int not null default 0,
  listings_created         int not null default 0,
  listings_edited          int not null default 0,
  leads_received           int not null default 0,
  leads_viewed             int not null default 0,
  whatsapp_clicks          int not null default 0,
  replies_marked           int not null default 0,
  affiliate_revenue_cents  int not null default 0,
  primary key (landlord_id, date)
);
alter table public.analytics_events_daily enable row level security;

create policy "service_role_manage_analytics_events_daily"
  on public.analytics_events_daily for all to service_role
  using (true) with check (true);

create policy "landlords_view_own_analytics"
  on public.analytics_events_daily for select to authenticated
  using (
    landlord_id in (
      select id from public.landlord_profiles
      where user_id = (select auth.uid())
    )
  );

-- 4. Add landlord_id to apartments (referenced by snapshot function)
alter table public.apartments
  add column if not exists landlord_id uuid references public.landlord_profiles(id) on delete set null;

create index if not exists idx_apartments_landlord_id
  on public.apartments using btree (landlord_id)
  where landlord_id is not null;
