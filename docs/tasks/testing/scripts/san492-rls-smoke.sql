-- SAN-492 · EVT-033 — RLS + trigger smoke (disposable local :54322)
-- Run: PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -v ON_ERROR_STOP=1 -f docs/tasks/testing/scripts/san492-rls-smoke.sql

\set ON_ERROR_STOP on

-- ── Seed fixtures (idempotent) ─────────────────────────────────────────────
DO $$
BEGIN
  UPDATE public.partner_locations
  SET accepts_event_bookings = true, is_verified = true, capacity_seated = 80
  WHERE id = '00000000-0000-4000-a000-000000000030';

  INSERT INTO public.partner_locations (id, partner_id, label, accepts_event_bookings, is_verified)
  VALUES ('00000000-0000-4000-a000-000000000031', '00000000-0000-4000-a000-000000000011', 'Unverified Room', true, false)
  ON CONFLICT (id) DO UPDATE SET accepts_event_bookings = true, is_verified = false;

  INSERT INTO public.partner_locations (id, partner_id, label, accepts_event_bookings, is_verified)
  VALUES ('00000000-0000-4000-a000-000000000032', '00000000-0000-4000-a000-000000000014', 'Draft Agency Hall', true, true)
  ON CONFLICT (id) DO UPDATE SET accepts_event_bookings = true, is_verified = true;

  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES (
    '22222222-2222-4222-a222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'san492-admin@test.local',
    crypt('test', gen_salt('bf')), now(), now(), now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (id, email, full_name)
  VALUES ('22222222-2222-4222-a222-222222222222', 'san492-admin@test.local', 'SAN492 Admin')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES ('22222222-2222-4222-a222-222222222222', 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.venue_event_offerings (partner_location_id, offering_key, event_types)
  VALUES ('00000000-0000-4000-a000-000000000030', 'corporate', ARRAY['corporate'])
  ON CONFLICT (partner_location_id, offering_key) DO NOTHING;
END $$;

DROP TABLE IF EXISTS public._san492_smoke_results;
CREATE TABLE public._san492_smoke_results (test_name text PRIMARY KEY, passed boolean, detail text);

-- ── 1. anon SELECT verified active event locations only ─────────────────────
DO $$
DECLARE c bigint;
BEGIN
  SET LOCAL ROLE anon;
  SELECT count(*) INTO c FROM public.partner_locations
  WHERE id IN (
    '00000000-0000-4000-a000-000000000030',
    '00000000-0000-4000-a000-000000000031',
    '00000000-0000-4000-a000-000000000032'
  );
  RESET ROLE;
  INSERT INTO public._san492_smoke_results VALUES (
    'anon_select_verified_active_only', c = 1,
    format('visible rows=%s (expect 1: loc 030 only)', c)
  );
END $$;

-- ── 2. anon cannot write ────────────────────────────────────────────────────
DO $$
BEGIN
  SET LOCAL ROLE anon;
  BEGIN
    INSERT INTO public.venue_event_offerings (partner_location_id, offering_key)
    VALUES ('00000000-0000-4000-a000-000000000030', 'anon-hack');
    RESET ROLE;
    INSERT INTO public._san492_smoke_results VALUES ('anon_cannot_insert_offering', false, 'insert succeeded');
  EXCEPTION WHEN insufficient_privilege OR OTHERS THEN
    RESET ROLE;
    INSERT INTO public._san492_smoke_results VALUES ('anon_cannot_insert_offering', true, SQLERRM);
  END;
END $$;

DO $$
DECLARE rows_affected int;
BEGIN
  SET LOCAL ROLE anon;
  UPDATE public.venue_event_offerings SET offering_key = 'hack' WHERE offering_key = 'corporate';
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RESET ROLE;
  INSERT INTO public._san492_smoke_results VALUES (
    'anon_cannot_update_offering', rows_affected = 0, format('rows_affected=%s', rows_affected)
  );
END $$;

DO $$
DECLARE rows_affected int;
BEGIN
  SET LOCAL ROLE anon;
  DELETE FROM public.venue_event_offerings WHERE offering_key = 'corporate';
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RESET ROLE;
  INSERT INTO public._san492_smoke_results VALUES (
    'anon_cannot_delete_offering', rows_affected = 0, format('rows_affected=%s', rows_affected)
  );
  IF rows_affected > 0 THEN
    INSERT INTO public.venue_event_offerings (partner_location_id, offering_key, event_types)
    VALUES ('00000000-0000-4000-a000-000000000030', 'corporate', ARRAY['corporate'])
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ── 3. partner member manage own offerings/packages ─────────────────────────
DO $$
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', '11111111-1111-4111-a111-111111111111', true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  INSERT INTO public.venue_event_offerings (partner_location_id, offering_key, event_types)
  VALUES ('00000000-0000-4000-a000-000000000030', 'birthday', ARRAY['birthday'])
  ON CONFLICT (partner_location_id, offering_key) DO NOTHING;

  INSERT INTO public.venue_event_packages (partner_location_id, name, price_from, min_guests, max_guests)
  VALUES ('00000000-0000-4000-a000-000000000030', 'Gold Package', 500, 10, 50)
  ON CONFLICT (partner_location_id, name) DO NOTHING;

  UPDATE public.venue_event_packages SET price_from = 550
  WHERE partner_location_id = '00000000-0000-4000-a000-000000000030' AND name = 'Gold Package';

  RESET ROLE;
  INSERT INTO public._san492_smoke_results
  SELECT 'partner_member_crud_offerings_packages', true, 'insert/update ok'
  WHERE EXISTS (
    SELECT 1 FROM public.venue_event_packages
    WHERE partner_location_id = '00000000-0000-4000-a000-000000000030'
      AND name = 'Gold Package' AND price_from = 550
  );
  IF NOT FOUND THEN
    INSERT INTO public._san492_smoke_results VALUES ('partner_member_crud_offerings_packages', false, 'package row missing');
  END IF;
END $$;

-- seed valid event booking (postgres)
INSERT INTO public.bookings (
  id, user_id, booking_type, resource_id, resource_title, partner_id,
  start_date, status, partner_status
) VALUES (
  '00000000-0000-4000-a000-000000000040',
  '11111111-1111-4111-a111-111111111111',
  'event',
  '00000000-0000-4000-a000-000000000030',
  'Corporate Night',
  '00000000-0000-4000-a000-000000000011',
  current_date + 30,
  'pending',
  'pending'
) ON CONFLICT (id) DO NOTHING;

-- ── 4. admin read/update event bookings ─────────────────────────────────────
DO $$
DECLARE c bigint;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', '22222222-2222-4222-a222-222222222222', true);
  SELECT count(*) INTO c FROM public.bookings WHERE id = '00000000-0000-4000-a000-000000000040';
  INSERT INTO public._san492_smoke_results VALUES (
    'admin_select_event_bookings', c = 1, format('rows=%s', c)
  );
  UPDATE public.bookings SET partner_status = 'approved'
  WHERE id = '00000000-0000-4000-a000-000000000040';
  RESET ROLE;
  INSERT INTO public._san492_smoke_results
  SELECT 'admin_update_event_bookings', true, 'partner_status=approved'
  WHERE EXISTS (
    SELECT 1 FROM public.bookings
    WHERE id = '00000000-0000-4000-a000-000000000040' AND partner_status = 'approved'
  );
  IF NOT FOUND THEN
    INSERT INTO public._san492_smoke_results VALUES ('admin_update_event_bookings', false, 'update failed');
  END IF;
END $$;

-- ── 5–8. trigger negatives (INSERT) ─────────────────────────────────────────
DO $$
BEGIN
  BEGIN
    INSERT INTO public.bookings (user_id, booking_type, resource_id, resource_title, partner_id, start_date)
    VALUES ('11111111-1111-4111-a111-111111111111', 'event', '00000000-0000-4000-a000-000000000099', 'Bad', '00000000-0000-4000-a000-000000000011', current_date);
    INSERT INTO public._san492_smoke_results VALUES ('invalid_resource_id_fails', false, 'insert succeeded');
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public._san492_smoke_results VALUES ('invalid_resource_id_fails', true, SQLERRM);
  END;
END $$;

DO $$
BEGIN
  BEGIN
    INSERT INTO public.bookings (user_id, booking_type, resource_id, resource_title, partner_id, start_date)
    VALUES ('11111111-1111-4111-a111-111111111111', 'event', '00000000-0000-4000-a000-000000000031', 'Unverified', '00000000-0000-4000-a000-000000000011', current_date);
    INSERT INTO public._san492_smoke_results VALUES ('unverified_location_fails', false, 'insert succeeded');
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public._san492_smoke_results VALUES ('unverified_location_fails', true, SQLERRM);
  END;
END $$;

DO $$
BEGIN
  BEGIN
    INSERT INTO public.bookings (user_id, booking_type, resource_id, resource_title, partner_id, start_date)
    VALUES ('11111111-1111-4111-a111-111111111111', 'event', '00000000-0000-4000-a000-000000000032', 'Draft', '00000000-0000-4000-a000-000000000014', current_date);
    INSERT INTO public._san492_smoke_results VALUES ('inactive_partner_fails', false, 'insert succeeded');
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public._san492_smoke_results VALUES ('inactive_partner_fails', true, SQLERRM);
  END;
END $$;

DO $$
BEGIN
  BEGIN
    INSERT INTO public.bookings (user_id, booking_type, resource_id, resource_title, partner_id, start_date)
    VALUES ('11111111-1111-4111-a111-111111111111', 'event', '00000000-0000-4000-a000-000000000030', 'Mismatch', '00000000-0000-4000-a000-000000000010', current_date);
    INSERT INTO public._san492_smoke_results VALUES ('partner_id_mismatch_fails', false, 'insert succeeded');
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public._san492_smoke_results VALUES ('partner_id_mismatch_fails', true, SQLERRM);
  END;
END $$;

-- ── E12. UPDATE partner_id on event booking to mismatched partner must fail ─
DO $$
BEGIN
  BEGIN
    UPDATE public.bookings
    SET partner_id = '00000000-0000-4000-a000-000000000010'
    WHERE id = '00000000-0000-4000-a000-000000000040';
    INSERT INTO public._san492_smoke_results VALUES ('partner_id_update_mismatch_fails', false, 'update succeeded');
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public._san492_smoke_results VALUES ('partner_id_update_mismatch_fails', true, SQLERRM);
  END;
END $$;

\echo ''
\echo '=== SAN-492 RLS SMOKE RESULTS ==='
SELECT test_name, CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS result, detail
FROM public._san492_smoke_results ORDER BY test_name;

\echo ''
SELECT CASE WHEN bool_and(passed) THEN 'ALL PASS' ELSE 'SOME FAILURES' END AS overall
FROM public._san492_smoke_results;

DROP TABLE public._san492_smoke_results;
