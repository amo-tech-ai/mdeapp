-- SAN-683 — partner schema sample data (seed)
-- ⚠️ DEV / BRANCH / LOCAL ONLY — do NOT run on production.
-- Idempotent: fixed UUIDs + ON CONFLICT DO NOTHING / guarded UPDATE.
-- Run AFTER migrations ptr001–ptr013 are applied.
-- Owner profile = the oldest existing profile (so FKs resolve on any seeded DB).
--
-- Demonstrates: one person owning multiple partner accounts (host·venue·broker·sponsor·agency),
-- org membership, an in-progress wizard draft, enabled services, a venue location pin,
-- revenue rows, and the EXTENDED leads/bookings columns.

begin;

-- ── org ───────────────────────────────────────────────────────────────────
insert into public.partner_organizations (id, legal_name, display_name) values
  ('00000000-0000-4000-a000-000000000001', 'Provenza Group S.A.S.', 'Provenza Group')
on conflict (id) do nothing;

-- ── partners (5 verticals, one owner; respects unique(profile_id,type)) ─────
insert into public.partners (id, organization_id, profile_id, type, status, completion_score, settings) values
  ('00000000-0000-4000-a000-000000000010', '00000000-0000-4000-a000-000000000001',
    (select id from public.profiles order by created_at asc limit 1), 'host',    'active',         90, '{}'::jsonb),
  ('00000000-0000-4000-a000-000000000011', '00000000-0000-4000-a000-000000000001',
    (select id from public.profiles order by created_at asc limit 1), 'venue',   'active',         85, '{"category":"nightclub","neighborhood":"Provenza"}'::jsonb),
  ('00000000-0000-4000-a000-000000000012', null,
    (select id from public.profiles order by created_at asc limit 1), 'broker',  'active',         80, '{}'::jsonb),
  ('00000000-0000-4000-a000-000000000013', null,
    (select id from public.profiles order by created_at asc limit 1), 'sponsor', 'pending_review', 60, '{}'::jsonb),
  ('00000000-0000-4000-a000-000000000014', null,
    (select id from public.profiles order by created_at asc limit 1), 'agency',  'draft',          40, '{}'::jsonb)
on conflict (id) do nothing;

-- ── members (owner of each) ────────────────────────────────────────────────
insert into public.partner_members (partner_id, profile_id, role)
select p.id, p.profile_id, 'owner'
from public.partners p
where p.id like '00000000-0000-4000-a000-0000000000%'
on conflict (partner_id, profile_id) do nothing;

-- ── wizard draft (in-progress, step 4) ─────────────────────────────────────
insert into public.partner_drafts (id, partner_id, profile_id, type, step, completion_score, payload) values
  ('00000000-0000-4000-a000-000000000020', null,
    (select id from public.profiles order by created_at asc limit 1), 'venue', 4, 40,
    '{"name":"Rooftop X","category":"nightclub","neighborhood":"Provenza","services":["ai_event_booking","postiz"]}'::jsonb)
on conflict (id) do nothing;

-- ── services per partner ───────────────────────────────────────────────────
insert into public.partner_services (partner_id, service_key, tier) values
  ('00000000-0000-4000-a000-000000000010', 'ai_event_booking', 'growth'),
  ('00000000-0000-4000-a000-000000000010', 'postiz',           'growth'),
  ('00000000-0000-4000-a000-000000000011', 'listing',          'free'),
  ('00000000-0000-4000-a000-000000000011', 'ai_event_booking', 'growth'),
  ('00000000-0000-4000-a000-000000000011', 'openclaw',         'pro'),
  ('00000000-0000-4000-a000-000000000012', 'ai_listing',       'growth'),
  ('00000000-0000-4000-a000-000000000012', 'lead_qualification','growth')
on conflict (partner_id, service_key) do nothing;

-- ── location pin (venue, Provenza) ─────────────────────────────────────────
insert into public.partner_locations (id, partner_id, label, neighborhood, lat, lng, is_primary) values
  ('00000000-0000-4000-a000-000000000030', '00000000-0000-4000-a000-000000000011',
    'Rooftop X', 'Provenza', 6.2092, -75.5690, true)
on conflict (id) do nothing;

-- ── revenue ledger (host ticket fee + broker lead fee) ─────────────────────
insert into public.revenue_ledger (id, partner_id, source_kind, amount_cents, currency, platform_fee_cents, idempotency_key) values
  ('00000000-0000-4000-a000-000000000040', '00000000-0000-4000-a000-000000000010', 'ticket',   5000000, 'cop', 250000, 'seed-ticket-1'),
  ('00000000-0000-4000-a000-000000000041', '00000000-0000-4000-a000-000000000012', 'lead_fee', 2000000, 'cop', 2000000, 'seed-lead-1')
on conflict (id) do nothing;

-- ── extend demo: attach a partner to one existing rental lead (no insert) ───
update public.leads
set partner_id = '00000000-0000-4000-a000-000000000012',  -- broker
    listing_kind = 'apartment',
    listing_id = apartment_id
where partner_id is null
  and id = (select id from public.leads where intent = 'rental' order by created_at asc limit 1);

-- ── bookings extend (template — bookings is empty; needs consumer cols) ─────
-- insert into public.bookings (user_id, booking_type, partner_id, partner_status)
--   values ((select id from public.profiles order by created_at asc limit 1), 'showing',
--           '00000000-0000-4000-a000-000000000012', 'pending');

commit;

-- Verify after seeding:
--   select type, status, completion_score from public.partners order by type;
--   select partner_id, service_key, tier from public.partner_services order by partner_id;
--   select source_kind, amount_cents, platform_fee_cents from public.revenue_ledger;
--   select count(*) from public.leads where partner_id is not null;
