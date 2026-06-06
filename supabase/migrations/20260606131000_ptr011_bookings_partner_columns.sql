-- PTR-011 / SAN-683 — extend public.bookings for partner HITL approval
-- Purpose: SAN-686 partner can approve/decline supply-side bookings
-- Depends: ptr003 (partners table)
-- Note: partner SELECT/UPDATE policies in ptr012

begin;

alter table public.bookings
  add column if not exists partner_id uuid references public.partners (id) on delete set null,
  add column if not exists approved_by uuid references public.profiles (id) on delete set null,
  add column if not exists approved_at timestamptz,
  add column if not exists partner_notes text,
  add column if not exists partner_status text not null default 'pending';

alter table public.bookings
  drop constraint if exists bookings_partner_status_check;

alter table public.bookings
  add constraint bookings_partner_status_check
  check (partner_status in ('pending', 'approved', 'declined'));

comment on column public.bookings.partner_id is
  'Supply-side partner fulfilling this booking (restaurant, tour, showing, etc.).';

comment on column public.bookings.partner_status is
  'Partner approval state for HITL flows (SAN-686).';

create index if not exists idx_bookings_partner_status
  on public.bookings (partner_id, partner_status)
  where partner_id is not null;

commit;
