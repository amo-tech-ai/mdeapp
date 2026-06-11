-- VEB-MVP-004 / SAN-869 — bookings.idempotency_key for event proposal dedupe
alter table public.bookings
  add column if not exists idempotency_key text;

create unique index if not exists idx_bookings_idempotency_user
  on public.bookings (user_id, idempotency_key)
  where idempotency_key is not null and booking_type = 'event';
