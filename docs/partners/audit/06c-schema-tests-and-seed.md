---
title: "SAN-683 — how to prove the partner schema is correct (tests + seed)"
updated: 2026-06-06
linear: SAN-683
seed: mdeapp/supabase/seeds/partners.seed.sql
related: 06b-supabase-audit.md
---

# Proving SAN-683 is correct

> **Reading SQL ≠ correct.** Syntax review (done in 06b) only catches obvious errors. To *know* it's correct you must **apply it somewhere disposable and run assertions** — never assert on prod. This doc gives the gate, the ready-to-run SQL, and the seed.

## Where to run (pick one — never prod)
1. **Supabase branch** (preferred): `create_branch` → `apply_migration` ptr001–ptr013 → run §A–§E → discard. Costs a branch; confirm first.
2. **Local**: `supabase db reset` (replays migrations) → `supabase db execute < seeds/partners.seed.sql`.
3. **Dev project**: only if it's truly disposable.

## The "100% correct" gate (all must pass)
| # | Gate | How |
|---|---|---|
| 1 | Migrations apply cleanly in order | apply ptr001→ptr013, exit 0 |
| 2 | Schema shape matches spec | §A assertions = expected counts |
| 3 | RLS enabled + scoped (no leaks) | §B pen-tests |
| 4 | FK integrity + cascade/restrict | §C |
| 5 | Idempotent (re-run safe) | §D |
| 6 | Seed loads + reads back | run seed, then verify block |
| 7 | Advisors clean | `get_advisors` (security + performance) |
| 8 | Types generate | `generate_typescript_types` compiles |

---

## §A — Schema assertions (expect the commented result)
```sql
-- 8 new tables exist
select count(*) from information_schema.tables where table_schema='public'
 and table_name in ('partner_organizations','partners','partner_members','partner_drafts',
 'partner_services','partner_locations','partner_assets','revenue_ledger');           -- expect 8

-- leads/bookings EXTENDED (not duplicated)
select count(*) from information_schema.columns where table_schema='public' and table_name='leads'
 and column_name in ('partner_id','listing_kind','listing_id');                       -- expect 3
select count(*) from information_schema.columns where table_schema='public' and table_name='bookings'
 and column_name in ('partner_id','approved_by','approved_at','partner_notes','partner_status'); -- expect 5

-- enums
select count(*) from pg_type where typname in ('partner_type','partner_status');      -- expect 2

-- RLS enabled on every new table
select count(*) from pg_tables where schemaname='public'
 and tablename in ('partner_organizations','partners','partner_members','partner_drafts',
 'partner_services','partner_locations','partner_assets','revenue_ledger')
 and rowsecurity = true;                                                              -- expect 8

-- helper fns present
select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
 where n.nspname='public' and p.proname in ('partner_ids_for_user','is_admin','update_updated_at'); -- expect 3
```

## §B — RLS pen-tests (the security gate)
```sql
-- anon sees nothing
set role anon;
select count(*) from public.partners;           -- expect 0
select count(*) from public.revenue_ledger;     -- expect 0
reset role;

-- partner A sees only their own (simulate auth.uid via request.jwt.claims)
-- Run as authenticated with a seeded owner's uid:
select set_config('request.jwt.claims', json_build_object('sub',
  (select profile_id from public.partners limit 1))::text, true);
set role authenticated;
select count(*) from public.partners;           -- expect ≥1 (their rows)
select count(*) from public.partners
 where profile_id <> (select (current_setting('request.jwt.claims',true)::json->>'sub')::uuid); -- expect 0 (no leaks)
select count(*) from public.revenue_ledger;     -- expect only their partner_ids
reset role; select set_config('request.jwt.claims', null, true);

-- service_role bypasses (seed/edge path)
set role service_role; select count(*) from public.partners; reset role;  -- expect all
```

## §C — FK integrity + cascade/restrict
```sql
-- bad profile_id rejected
do $$ begin
  begin insert into public.partners (profile_id,type) values (gen_random_uuid(),'host');
        raise exception 'FK NOT enforced'; exception when foreign_key_violation then null; end;
end $$;

-- delete partner cascades members/services/locations/drafts...
-- ...but revenue_ledger is ON DELETE RESTRICT → delete must FAIL while ledger rows exist:
do $$ begin
  begin delete from public.partners where id='00000000-0000-4000-a000-000000000010';
        raise exception 'RESTRICT NOT enforced'; exception when foreign_key_violation then null; end;
end $$;
```

## §D — Idempotency
```sql
-- re-apply each migration (IF NOT EXISTS guards) → no error
-- re-run seeds/partners.seed.sql → no duplicate-key error (ON CONFLICT DO NOTHING)
```

## §E — Seed + read-back
Run `mdeapp/supabase/seeds/partners.seed.sql`, then:
```sql
select type,status,completion_score from public.partners order by type;          -- 5 rows
select partner_id,service_key,tier from public.partner_services order by 1;       -- 7 rows
select source_kind,amount_cents,platform_fee_cents from public.revenue_ledger;   -- 2 rows
select count(*) from public.leads where partner_id is not null;                  -- ≥1
```

## Automated option (CI)
Add `mdeapp/src/**/__tests__/partner-schema.test.ts` (Vitest) that runs §A + §B against the branch/local connection and fails CI on any mismatch — wire into `floor`. Keeps the gate enforced per PR, not just once.

## Verdict
SAN-683 is **"100% correct" only when §A–§E + advisors + types all pass on a branch.** Until then it's "syntax-reviewed, ready to apply." The seed (`partners.seed.sql`) is the §E fixture and the demo data for building SAN-665/690 against.
