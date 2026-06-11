-- SAN-502 / EVT-038 — guard booking partner-decision columns from self-approval
-- A booking's creator owns the row via RLS and can edit/cancel it, but must NOT
-- be able to approve/confirm their own booking. Only an admin or a member of the
-- venue's partner org may change partner_status / approved_by / approved_at, or
-- move status into confirmed/completed/no_show. The owner may still cancel.
-- service_role / migration connections (auth.uid() is null) are exempt (F13).
--
-- Depends: ptr011 (bookings.partner_id/partner_status/approved_*), is_admin(),
--          partner_members(partner_id, profile_id).

begin;

create or replace function public.guard_booking_partner_decision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := (select auth.uid());
  v_privileged boolean;
begin
  -- service_role / migrations have no JWT user — let them through
  if v_uid is null then
    return new;
  end if;

  v_privileged := (select public.is_admin())
    or exists (
      select 1 from public.partner_members pm
      where pm.profile_id = v_uid
        and pm.partner_id = old.partner_id
    );

  if v_privileged then
    return new;
  end if;

  -- non-privileged caller: block the partner-decision (approval) columns
  if new.partner_status is distinct from old.partner_status
     or new.approved_by is distinct from old.approved_by
     or new.approved_at is distinct from old.approved_at then
    raise exception
      'Only an admin or the venue partner may change a booking''s approval status'
      using errcode = 'check_violation';
  end if;

  -- non-privileged caller may cancel, but not confirm/complete/no_show
  if new.status is distinct from old.status
     and new.status <> 'cancelled'::booking_status then
    raise exception
      'Only an admin or the venue partner may confirm or complete a booking'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_booking_partner_decision on public.bookings;
create trigger guard_booking_partner_decision
  before update on public.bookings
  for each row
  execute function public.guard_booking_partner_decision();

commit;
