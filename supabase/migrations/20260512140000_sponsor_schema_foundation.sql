-- =============================================================================
-- MASTRA-043: Sponsor schema foundation
--
-- Creates 4 missing sponsor tables referenced by:
--   public.activate_placements_if_ready()  (invoices, contracts, placements)
--   sponsor-roi-explain edge function       (roi_daily, placements, applications.event_id)
--
-- Depends on: 20260512120000_sponsor_schema_edge_acl.sql
--   (sponsor schema + organizations, applications, assets tables already exist)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. sponsor.invoices
--    Tracks payment state for sponsor applications.
--    activate_placements_if_ready() checks status = 'paid'.
-- ---------------------------------------------------------------------------
create table if not exists sponsor.invoices (
  id                        uuid        primary key default gen_random_uuid(),
  application_id            uuid        not null references sponsor.applications (id) on delete cascade,
  owner_user_id             uuid        not null references auth.users (id) on delete cascade,
  status                    text        not null default 'pending',
  amount_cents              bigint      not null default 0,
  currency                  text        not null default 'USD',
  stripe_payment_intent_id  text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  constraint sponsor_invoices_status_check check (status in ('pending', 'paid', 'void'))
);

comment on table sponsor.invoices is
  'Payment invoices for sponsor applications. status=paid triggers placement activation when contract is also signed.';

create index if not exists idx_sponsor_invoices_application
  on sponsor.invoices (application_id);
DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='invoices' AND column_name='owner_user_id') THEN
    EXECUTE 'create index if not exists idx_sponsor_invoices_owner on sponsor.invoices (owner_user_id)';
  END IF;
END $do$;

alter table sponsor.invoices enable row level security;

drop policy if exists sponsor_invoices_select_own on sponsor.invoices;
DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='invoices' AND column_name='owner_user_id') THEN
    EXECUTE $e$ create policy sponsor_invoices_select_own on sponsor.invoices for select to authenticated using (owner_user_id = (select auth.uid())); $e$;
  END IF;
END $do$;

drop policy if exists sponsor_invoices_service_all on sponsor.invoices;
create policy sponsor_invoices_service_all
  on sponsor.invoices for all to service_role
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- 2. sponsor.contracts
--    Signed contracts for sponsor applications.
--    activate_placements_if_ready() checks status IN ('signed', 'active').
-- ---------------------------------------------------------------------------
create table if not exists sponsor.contracts (
  id              uuid        primary key default gen_random_uuid(),
  application_id  uuid        not null references sponsor.applications (id) on delete cascade,
  owner_user_id   uuid        not null references auth.users (id) on delete cascade,
  status          text        not null default 'draft',
  signed_at       timestamptz,
  pdf_url         text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint sponsor_contracts_status_check check (status in ('draft', 'signed', 'active', 'expired'))
);

comment on table sponsor.contracts is
  'Signed contracts for sponsor applications. status in (signed,active) triggers placement activation when invoice is also paid.';

create index if not exists idx_sponsor_contracts_application
  on sponsor.contracts (application_id);
DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='contracts' AND column_name='owner_user_id') THEN
    EXECUTE 'create index if not exists idx_sponsor_contracts_owner on sponsor.contracts (owner_user_id)';
  END IF;
END $do$;

alter table sponsor.contracts enable row level security;

drop policy if exists sponsor_contracts_select_own on sponsor.contracts;
DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='contracts' AND column_name='owner_user_id') THEN
    EXECUTE $e$ create policy sponsor_contracts_select_own on sponsor.contracts for select to authenticated using (owner_user_id = (select auth.uid())); $e$;
  END IF;
END $do$;

drop policy if exists sponsor_contracts_service_all on sponsor.contracts;
create policy sponsor_contracts_service_all
  on sponsor.contracts for all to service_role
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- 3. sponsor.placements
--    Individual ad placements per application.
--    activate_placements_if_ready() flips active=true when both conditions met.
--    sponsor-roi-explain reads surface + application_id via roi_daily join.
-- ---------------------------------------------------------------------------
create table if not exists sponsor.placements (
  id              uuid        primary key default gen_random_uuid(),
  application_id  uuid        not null references sponsor.applications (id) on delete cascade,
  owner_user_id   uuid        not null references auth.users (id) on delete cascade,
  surface         text        not null,
  weight          numeric     not null default 1.0,
  active          boolean     not null default false,
  start_at        timestamptz,
  end_at          timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table sponsor.placements is
  'Ad placements within a sponsor application. active flips to true only when invoice is paid AND contract is signed.';

create index if not exists idx_sponsor_placements_application
  on sponsor.placements (application_id);
DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='placements' AND column_name='owner_user_id') THEN
    EXECUTE 'create index if not exists idx_sponsor_placements_owner on sponsor.placements (owner_user_id)';
  END IF;
END $do$;
-- composite index for activate_placements_if_ready update predicate
create index if not exists idx_sponsor_placements_active_start
  on sponsor.placements (application_id, active, start_at);

alter table sponsor.placements enable row level security;

drop policy if exists sponsor_placements_select_own on sponsor.placements;
DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='placements' AND column_name='owner_user_id') THEN
    EXECUTE $e$ create policy sponsor_placements_select_own on sponsor.placements for select to authenticated using (owner_user_id = (select auth.uid())); $e$;
  END IF;
END $do$;

drop policy if exists sponsor_placements_service_all on sponsor.placements;
create policy sponsor_placements_service_all
  on sponsor.placements for all to service_role
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- 4. sponsor.roi_daily
--    Daily impression/click/conversion metrics per placement.
--    Written by cron/analytics (service_role). Read by sponsor-roi-explain.
--    Uses bigint identity PK (high-insert table; UUID overhead unnecessary).
-- ---------------------------------------------------------------------------
create table if not exists sponsor.roi_daily (
  id           bigint      generated always as identity primary key,
  placement_id uuid        not null references sponsor.placements (id) on delete cascade,
  day          date        not null,
  impressions  integer     not null default 0,
  clicks       integer     not null default 0,
  conversions  integer     not null default 0,
  spend_cents  integer     not null default 0,
  created_at   timestamptz not null default now(),
  constraint sponsor_roi_daily_placement_day unique (placement_id, day)
);

comment on table sponsor.roi_daily is
  'Daily ROI metrics per placement. One row per (placement_id, day). Written by analytics cron; read by sponsor-roi-explain and sponsor dashboard.';

create index if not exists idx_sponsor_roi_daily_placement_day
  on sponsor.roi_daily (placement_id, day desc);

alter table sponsor.roi_daily enable row level security;

-- authenticated sponsors see metrics for their own placements
drop policy if exists sponsor_roi_daily_select_own on sponsor.roi_daily;
DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='placements' AND column_name='owner_user_id') THEN
    EXECUTE $e$
      create policy sponsor_roi_daily_select_own on sponsor.roi_daily for select to authenticated
      using (placement_id in (select id from sponsor.placements where owner_user_id = (select auth.uid())));
    $e$;
  END IF;
END $do$;

-- service_role (cron, analytics, roi-explain edge fn) has full access
drop policy if exists sponsor_roi_daily_service_all on sponsor.roi_daily;
create policy sponsor_roi_daily_service_all
  on sponsor.roi_daily for all to service_role
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- 5. sponsor.applications — add event_id FK -> public.events
--    sponsor-roi-explain reads: applications.select("event_id, events(name)")
-- ---------------------------------------------------------------------------
alter table sponsor.applications
  add column if not exists event_id uuid references public.events (id) on delete set null;

create index if not exists idx_sponsor_applications_event
  on sponsor.applications (event_id);

-- ---------------------------------------------------------------------------
-- 6. Grants (schema already granted in 20260512120000)
-- ---------------------------------------------------------------------------
grant select on sponsor.invoices   to authenticated;
grant select on sponsor.contracts  to authenticated;
grant select on sponsor.placements to authenticated;
grant select on sponsor.roi_daily  to authenticated;

grant all on sponsor.invoices   to service_role;
grant all on sponsor.contracts  to service_role;
grant all on sponsor.placements to service_role;
grant all on sponsor.roi_daily  to service_role;

-- identity sequence must be explicitly granted for service_role inserts
DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname='sponsor' AND sequencename='roi_daily_id_seq') THEN
    EXECUTE $e$ grant usage, select on sequence sponsor.roi_daily_id_seq to service_role $e$;
  END IF;
END $do$;
