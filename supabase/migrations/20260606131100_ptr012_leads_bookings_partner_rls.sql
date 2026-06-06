-- PTR-012 / SAN-683 — partner-member RLS on leads and bookings
-- Purpose: partners see/update their inbound leads and approval queue
-- Depends: ptr005, ptr010, ptr011

begin;

drop policy if exists leads_select_partner_member on public.leads;
create policy leads_select_partner_member
  on public.leads
  for select
  to authenticated
  using (partner_id in (select public.partner_ids_for_user()));

drop policy if exists leads_update_partner_member on public.leads;
create policy leads_update_partner_member
  on public.leads
  for update
  to authenticated
  using (partner_id in (select public.partner_ids_for_user()))
  with check (partner_id in (select public.partner_ids_for_user()));

drop policy if exists bookings_select_partner_member on public.bookings;
create policy bookings_select_partner_member
  on public.bookings
  for select
  to authenticated
  using (partner_id in (select public.partner_ids_for_user()));

drop policy if exists bookings_update_partner_member on public.bookings;
create policy bookings_update_partner_member
  on public.bookings
  for update
  to authenticated
  using (partner_id in (select public.partner_ids_for_user()))
  with check (partner_id in (select public.partner_ids_for_user()));

commit;
