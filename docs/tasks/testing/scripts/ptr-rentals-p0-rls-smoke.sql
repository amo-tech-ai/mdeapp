-- PTR-RENTALS-P0 / SAN-1104–1108 — two-user broker RLS + publish FSM smoke
-- Run (local Supabase): PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -v ON_ERROR_STOP=1 -f docs/tasks/testing/scripts/ptr-rentals-p0-rls-smoke.sql

\set ON_ERROR_STOP on

-- Force RLS even for table owner (postgres superuser otherwise bypasses policies)
ALTER TABLE public.apartments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;
ALTER TABLE public.showings FORCE ROW LEVEL SECURITY;

-- Fixture UUIDs (deterministic)
-- Broker A user/profile/listlord: ...a001 / ...a010 / ...a011
-- Broker B user/profile/landlord: ...b001 / ...b010 / ...b011
-- Draft apt A (inactive): ...a100 — only A owns
-- Active apt B (active): ...b100 — public catalog + B owns

DO $$
BEGIN
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES
    ('aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'broker-a@test.local', crypt('test', gen_salt('bf')), now(), now(), now()),
    ('bbbbbbbb-bbbb-4bbb-b001-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'broker-b@test.local', crypt('test', gen_salt('bf')), now(), now(), now())
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (id, email, full_name)
  VALUES
    ('aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa', 'broker-a@test.local', 'Broker A'),
    ('bbbbbbbb-bbbb-4bbb-b001-bbbbbbbbbbbb', 'broker-b@test.local', 'Broker B')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.landlord_profiles (id, user_id, display_name, kind)
  VALUES
    ('aaaaaaaa-aaaa-4aaa-a011-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa', 'Broker A Realty', 'agent'),
    ('bbbbbbbb-bbbb-4bbb-b011-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-4bbb-b001-bbbbbbbbbbbb', 'Broker B Realty', 'agent')
  ON CONFLICT (id) DO UPDATE SET user_id = EXCLUDED.user_id;

  INSERT INTO public.apartments (id, title, neighborhood, status, landlord_id, listing_workflow_status)
  VALUES
    ('aaaaaaaa-aaaa-4aaa-a100-aaaaaaaaaaaa', 'A Draft Loft', 'Laureles', 'inactive', 'aaaaaaaa-aaaa-4aaa-a011-aaaaaaaaaaaa', 'draft'),
    ('bbbbbbbb-bbbb-4bbb-b100-bbbbbbbbbbbb', 'B Active Flat', 'Provenza', 'active', 'bbbbbbbb-bbbb-4bbb-b011-bbbbbbbbbbbb', 'published')
  ON CONFLICT (id) DO UPDATE SET
    landlord_id = EXCLUDED.landlord_id,
    status = EXCLUDED.status,
    listing_workflow_status = EXCLUDED.listing_workflow_status;

  INSERT INTO public.leads (id, user_id, apartment_id, source, status)
  VALUES
    ('aaaaaaaa-aaaa-4aaa-a200-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-4aaa-a100-aaaaaaaaaaaa', 'web', 'new'),
    ('bbbbbbbb-bbbb-4bbb-b200-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-4bbb-b001-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-4bbb-b100-bbbbbbbbbbbb', 'web', 'new')
  ON CONFLICT (id) DO UPDATE SET apartment_id = EXCLUDED.apartment_id;

  INSERT INTO public.showings (id, lead_id, apartment_id, scheduled_at, status)
  VALUES
    ('aaaaaaaa-aaaa-4aaa-a300-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-4aaa-a200-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-4aaa-a100-aaaaaaaaaaaa', now() + interval '1 day', 'scheduled'),
    ('bbbbbbbb-bbbb-4bbb-b300-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-4bbb-b200-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-4bbb-b100-bbbbbbbbbbbb', now() + interval '1 day', 'scheduled')
  ON CONFLICT (id) DO NOTHING;
END $$;

DROP TABLE IF EXISTS public._ptr_rentals_smoke_results;
CREATE TABLE public._ptr_rentals_smoke_results (test_name text PRIMARY KEY, passed boolean, detail text);

-- Broker A sees own draft apartment
DO $$
DECLARE c bigint;
BEGIN
  PERFORM set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa', true);
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO c FROM public.apartments WHERE id = 'aaaaaaaa-aaaa-4aaa-a100-aaaaaaaaaaaa';
  RESET ROLE;
  INSERT INTO public._ptr_rentals_smoke_results VALUES ('broker_a_reads_own_draft', c = 1, format('rows=%s', c));
END $$;

-- Broker A cannot see Broker B draft-only path (B active is catalog-visible; test B's lead instead)
DO $$
DECLARE c bigint;
BEGIN
  PERFORM set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa', true);
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO c FROM public.leads WHERE id = 'bbbbbbbb-bbbb-4bbb-b200-bbbbbbbbbbbb';
  RESET ROLE;
  INSERT INTO public._ptr_rentals_smoke_results VALUES ('broker_a_cannot_read_b_lead', c = 0, format('rows=%s', c));
END $$;

-- Broker A reads own lead
DO $$
DECLARE c bigint;
BEGIN
  PERFORM set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa', true);
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO c FROM public.leads WHERE id = 'aaaaaaaa-aaaa-4aaa-a200-aaaaaaaaaaaa';
  RESET ROLE;
  INSERT INTO public._ptr_rentals_smoke_results VALUES ('broker_a_reads_own_lead', c = 1, format('rows=%s', c));
END $$;

-- Broker A reads own showing
DO $$
DECLARE c bigint;
BEGIN
  PERFORM set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa', true);
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO c FROM public.showings WHERE id = 'aaaaaaaa-aaaa-4aaa-a300-aaaaaaaaaaaa';
  RESET ROLE;
  INSERT INTO public._ptr_rentals_smoke_results VALUES ('broker_a_reads_own_showing', c = 1, format('rows=%s', c));
END $$;

-- Broker A cannot read Broker B showing (B apt is active but showing is broker-scoped)
DO $$
DECLARE c bigint;
BEGIN
  PERFORM set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa', true);
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO c FROM public.showings WHERE id = 'bbbbbbbb-bbbb-4bbb-b300-bbbbbbbbbbbb';
  RESET ROLE;
  INSERT INTO public._ptr_rentals_smoke_results VALUES ('broker_a_cannot_read_b_showing', c = 0, format('rows=%s', c));
END $$;

-- publish_listing from draft must fail (review gate — no single-call bypass)
DO $$
BEGIN
  PERFORM set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa', true);
  SET LOCAL ROLE authenticated;
  BEGIN
    PERFORM public.publish_listing('aaaaaaaa-aaaa-4aaa-a100-aaaaaaaaaaaa');
    RESET ROLE;
    INSERT INTO public._ptr_rentals_smoke_results VALUES ('publish_listing_rejects_draft', false, 'publish succeeded from draft');
  EXCEPTION WHEN OTHERS THEN
    RESET ROLE;
    INSERT INTO public._ptr_rentals_smoke_results VALUES ('publish_listing_rejects_draft', true, SQLERRM);
  END;
END $$;

-- Publish FSM: draft → ready_for_review → published writes audit cols
DO $$
DECLARE v_row public.apartments;
BEGIN
  PERFORM set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-a001-aaaaaaaaaaaa', true);
  SET LOCAL ROLE authenticated;
  SELECT * INTO v_row FROM public.request_listing_publish('aaaaaaaa-aaaa-4aaa-a100-aaaaaaaaaaaa');
  IF v_row.listing_workflow_status <> 'ready_for_review' THEN
    RAISE EXCEPTION 'expected ready_for_review, got %', v_row.listing_workflow_status;
  END IF;
  SELECT * INTO v_row FROM public.publish_listing('aaaaaaaa-aaaa-4aaa-a100-aaaaaaaaaaaa');
  IF v_row.listing_workflow_status <> 'published' OR v_row.published_at IS NULL OR v_row.published_by IS NULL THEN
    RAISE EXCEPTION 'publish audit missing';
  END IF;
  RESET ROLE;
  INSERT INTO public._ptr_rentals_smoke_results VALUES ('publish_fsm_audit', true, 'ready_for_review→published OK');
EXCEPTION WHEN OTHERS THEN
  RESET ROLE;
  INSERT INTO public._ptr_rentals_smoke_results VALUES ('publish_fsm_audit', false, SQLERRM);
END $$;

-- Broker B cannot publish Broker A apartment
DO $$
BEGIN
  PERFORM set_config('request.jwt.claim.sub', 'bbbbbbbb-bbbb-4bbb-b001-bbbbbbbbbbbb', true);
  SET LOCAL ROLE authenticated;
  BEGIN
    PERFORM public.publish_listing('aaaaaaaa-aaaa-4aaa-a100-aaaaaaaaaaaa');
    RESET ROLE;
    INSERT INTO public._ptr_rentals_smoke_results VALUES ('broker_b_cannot_publish_a', false, 'publish succeeded');
  EXCEPTION WHEN OTHERS THEN
    RESET ROLE;
    INSERT INTO public._ptr_rentals_smoke_results VALUES ('broker_b_cannot_publish_a', true, SQLERRM);
  END;
END $$;

-- Anon cannot update apartments (RLS: 0 rows affected or error)
DO $$
DECLARE
  v_title_before text;
  v_title_after text;
  v_rows int;
BEGIN
  SELECT title INTO v_title_before FROM public.apartments
  WHERE id = 'bbbbbbbb-bbbb-4bbb-b100-bbbbbbbbbbbb';

  SET LOCAL ROLE anon;
  UPDATE public.apartments
  SET title = 'hacked'
  WHERE id = 'bbbbbbbb-bbbb-4bbb-b100-bbbbbbbbbbbb';
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RESET ROLE;

  SELECT title INTO v_title_after FROM public.apartments
  WHERE id = 'bbbbbbbb-bbbb-4bbb-b100-bbbbbbbbbbbb';

  INSERT INTO public._ptr_rentals_smoke_results VALUES (
    'anon_cannot_update_apartments',
    v_rows = 0 AND v_title_after = v_title_before,
    format('rows=%s title_unchanged=%s', v_rows, v_title_after = v_title_before)
  );
END $$;

SELECT test_name, passed, detail FROM public._ptr_rentals_smoke_results ORDER BY test_name;

DO $$
DECLARE failed int;
BEGIN
  SELECT count(*) INTO failed FROM public._ptr_rentals_smoke_results WHERE NOT passed;
  IF failed > 0 THEN
    RAISE EXCEPTION 'PTR-RENTALS-P0 smoke: % test(s) failed', failed;
  END IF;
END $$;
