-- PTR-013 / SAN-683 — revenue_ledger (GMV attribution)
-- Purpose: ticket fees, lead fees, subscriptions attributed to partners (SAN-668)
-- Depends: ptr005

begin;

create table if not exists public.revenue_ledger (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners (id) on delete restrict,
  source_kind text not null,
  source_id uuid,
  amount_cents bigint not null,
  currency text not null default 'usd',
  platform_fee_cents bigint not null default 0,
  stripe_reference text,
  idempotency_key text unique,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint revenue_ledger_source_kind_check check (
    source_kind in ('ticket', 'lead_fee', 'booking', 'subscription', 'sponsorship')
  )
);

comment on table public.revenue_ledger is
  'Immutable revenue attribution rows for partner payouts and dashboard GMV.';

create index if not exists idx_revenue_ledger_partner_created
  on public.revenue_ledger (partner_id, created_at desc);

create index if not exists idx_revenue_ledger_source
  on public.revenue_ledger (source_kind, source_id)
  where source_id is not null;

alter table public.revenue_ledger enable row level security;

drop policy if exists revenue_ledger_select_member on public.revenue_ledger;
create policy revenue_ledger_select_member
  on public.revenue_ledger
  for select
  to authenticated
  using (
    partner_id in (select public.partner_ids_for_user())
    or (select public.is_admin())
  );

drop policy if exists revenue_ledger_insert_service on public.revenue_ledger;
create policy revenue_ledger_insert_service
  on public.revenue_ledger
  for insert
  to service_role
  with check (true);

drop policy if exists revenue_ledger_update_admin on public.revenue_ledger;
create policy revenue_ledger_update_admin
  on public.revenue_ledger
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists revenue_ledger_delete_admin on public.revenue_ledger;
create policy revenue_ledger_delete_admin
  on public.revenue_ledger
  for delete
  to authenticated
  using ((select public.is_admin()));

drop policy if exists revenue_ledger_service_role on public.revenue_ledger;
create policy revenue_ledger_service_role
  on public.revenue_ledger
  to service_role
  using (true)
  with check (true);

grant all on table public.revenue_ledger to authenticated, service_role;

commit;
