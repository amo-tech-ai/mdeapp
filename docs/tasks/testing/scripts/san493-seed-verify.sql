-- SAN-493 · EVT-034 — seed verification (run after san493_event_venues.sql)
-- Run: PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres \
--        -v ON_ERROR_STOP=1 -f docs/tasks/testing/scripts/san493-seed-verify.sql

\set ON_ERROR_STOP on

drop table if exists public._san493_verify_results;
create table public._san493_verify_results (test_name text primary key, passed boolean, detail text);

-- V1: anon sees ≥6 SAN-493 event-capable verified locations (no partners join — anon cannot SELECT partners)
do $$
declare c bigint;
begin
  set local role anon;
  select count(*) into c
  from public.partner_locations pl
  where pl.id::text like '00000000-0000-4001-820%'
    and pl.accepts_event_bookings
    and pl.is_verified;
  reset role;
  insert into public._san493_verify_results values (
    'anon_sees_six_san493_venues', c >= 6, format('count=%s (expect >=6)', c)
  );
end $$;

-- V2: offerings visible to anon (≥3 from seed)
do $$
declare c bigint;
begin
  set local role anon;
  select count(*) into c
  from public.venue_event_offerings o
  join public.partner_locations pl on pl.id = o.partner_location_id
  where pl.id::text like '00000000-0000-4001-820%';
  reset role;
  insert into public._san493_verify_results values (
    'anon_sees_offerings', c >= 3, format('count=%s (expect >=3)', c)
  );
end $$;

-- V3: Mamacita has ≥1 package
insert into public._san493_verify_results
select 'mamacita_has_package', count(*) >= 1, format('packages=%s', count(*))
from public.venue_event_packages pkg
join public.partner_locations pl on pl.id = pkg.partner_location_id
where pl.id = '00000000-0000-4001-8201-000000000001';

-- V4: Mamacita proposal insert succeeds
do $$
begin
  insert into public.bookings (
    id, user_id, booking_type, resource_id, resource_title, partner_id,
    start_date, status, partner_status
  ) values (
    '00000000-0000-4001-8401-000000000001',
    '11111111-1111-4111-a111-111111111111',
    'event',
    '00000000-0000-4001-8201-000000000001',
    'Mamacita Birthday Inquiry',
    '00000000-0000-4001-8101-000000000001',
    current_date + 14,
    'pending',
    'pending'
  ) on conflict (id) do nothing;
  insert into public._san493_verify_results values ('mamacita_proposal_insert_ok', true, 'insert ok');
exception when others then
  insert into public._san493_verify_results values ('mamacita_proposal_insert_ok', false, sqlerrm);
end $$;

-- V5: draft partner location invisible to anon (uses existing SAN-492 fixture 032)
do $$
declare c bigint;
begin
  set local role anon;
  select count(*) into c from public.partner_locations
  where id = '00000000-0000-4000-a000-000000000032';
  reset role;
  insert into public._san493_verify_results values (
    'draft_partner_location_invisible', c = 0, format('visible=%s (expect 0)', c)
  );
end $$;

-- V6: draft partner proposal fails (fixture partner 014 + location 032)
do $$
begin
  begin
    insert into public.bookings (
      user_id, booking_type, resource_id, resource_title, partner_id, start_date
    ) values (
      '11111111-1111-4111-a111-111111111111',
      'event',
      '00000000-0000-4000-a000-000000000032',
      'Draft Hall Proposal',
      '00000000-0000-4000-a000-000000000014',
      current_date + 7
    );
    insert into public._san493_verify_results values ('draft_partner_proposal_fails', false, 'insert succeeded');
  exception when others then
    insert into public._san493_verify_results values ('draft_partner_proposal_fails', true, sqlerrm);
  end;
end $$;

-- V7: all six partners active + type venue
insert into public._san493_verify_results
select 'six_partners_active_venue', count(*) = 6, format('partners=%s', count(*))
from public.partners
where id::text like '00000000-0000-4001-810%'
  and type = 'venue'
  and status = 'active';

\echo ''
\echo '=== SAN-493 SEED VERIFY ==='
select test_name, case when passed then 'PASS' else 'FAIL' end as result, detail
from public._san493_verify_results
order by test_name;

\echo ''
select case when bool_and(passed) then 'ALL PASS' else 'SOME FAILURES' end as overall
from public._san493_verify_results;

drop table public._san493_verify_results;
