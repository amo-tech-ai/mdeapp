-- PTR-010 / SAN-683 — extend public.leads for partner attribution
-- Purpose: SAN-684 partner dashboard can scope inbound leads
-- Depends: ptr003 (partners table)
-- Note: partner SELECT/UPDATE policies in ptr012

begin;

alter table public.leads
  add column if not exists partner_id uuid references public.partners (id) on delete set null,
  add column if not exists listing_kind text,
  add column if not exists listing_id uuid;

comment on column public.leads.partner_id is
  'Supply-side partner receiving this lead (broker, host, venue, etc.).';

comment on column public.leads.listing_kind is
  'Generic listing discriminator: apartment, event, venue, etc.';

comment on column public.leads.listing_id is
  'UUID of listing row when listing_kind is set.';

create index if not exists idx_leads_partner_status
  on public.leads (partner_id, status, created_at desc)
  where partner_id is not null;

create index if not exists idx_leads_listing
  on public.leads (listing_kind, listing_id)
  where listing_id is not null;

commit;
