#!/usr/bin/env node
/**
 * SAN-683 / PR #105 merge gate — 06c §A–§E + negative F1 pen-test.
 * Local disposable DB only. Never prod.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DB =
  process.env.SUPABASE_DB_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

async function expectCount(client, sql, expected, label) {
  const { rows } = await client.query(sql);
  const val = Number(rows[0].count ?? Object.values(rows[0])[0]);
  if (val === expected) pass(label, String(val));
  else fail(label, `expected ${expected}, got ${val}`);
}

async function main() {
  const client = new pg.Client({ connectionString: DB });
  await client.connect();

  const GATE_PROFILE = "11111111-1111-4111-a111-111111111111";
  await client.query(
    `insert into public.profiles (id, email, full_name)
     values ($1, 'san683-gate@test.local', 'SAN-683 Gate')
     on conflict (id) do nothing`,
    [GATE_PROFILE],
  );
  await client.query(
    `insert into public.leads (intent, source)
     select 'rental', 'gate-test'
     where not exists (select 1 from public.leads where intent = 'rental')`,
  );
  pass("bootstrap", "profile + rental lead");

  const seed = readFileSync(join(ROOT, "supabase/seeds/partners.seed.sql"), "utf8");
  await client.query(seed);
  pass("seed", "partners.seed.sql");

  // §A
  await expectCount(
    client,
    `select count(*) from information_schema.tables where table_schema='public'
      and table_name in ('partner_organizations','partners','partner_members','partner_drafts',
      'partner_services','partner_locations','partner_assets','revenue_ledger')`,
    8,
    "§A partner_tables",
  );
  await expectCount(
    client,
    `select count(*) from information_schema.columns where table_schema='public' and table_name='leads'
      and column_name in ('partner_id','listing_kind','listing_id')`,
    3,
    "§A leads_partner_cols",
  );
  await expectCount(
    client,
    `select count(*) from information_schema.columns where table_schema='public' and table_name='bookings'
      and column_name in ('partner_id','approved_by','approved_at','partner_notes','partner_status')`,
    5,
    "§A bookings_partner_cols",
  );
  await expectCount(
    client,
    `select count(*) from pg_type where typname in ('partner_type','partner_status')`,
    2,
    "§A partner_enums",
  );
  await expectCount(
    client,
    `select count(*) from pg_tables where schemaname='public'
      and tablename in ('partner_organizations','partners','partner_members','partner_drafts',
      'partner_services','partner_locations','partner_assets','revenue_ledger')
      and rowsecurity = true`,
    8,
    "§A partner_rls_tables",
  );
  await expectCount(
    client,
    `select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.proname in ('partner_ids_for_user','is_admin','update_updated_at')`,
    3,
    "§A partner_helpers",
  );

  // §B
  await client.query("set role anon");
  const anonPartners = await client.query("select count(*)::int as c from public.partners");
  const anonRev = await client.query("select count(*)::int as c from public.revenue_ledger");
  await client.query("reset role");
  if (anonPartners.rows[0].c === 0 && anonRev.rows[0].c === 0) pass("§B anon_denied");
  else fail("§B anon_denied", `partners=${anonPartners.rows[0].c} ledger=${anonRev.rows[0].c}`);

  const owner = await client.query(
    "select profile_id::text as pid from public.partners order by created_at asc limit 1",
  );
  const pid = owner.rows[0]?.pid;
  if (!pid) fail("§B member_scope", "no seeded partner");
  else {
    const claims = JSON.stringify({ sub: pid });
    await client.query("begin");
    await client.query(`select set_config('request.jwt.claims', $1, true)`, [claims]);
    await client.query("set local role authenticated");
    const mine = await client.query("select count(*)::int as c from public.partners");
    const leak = await client.query(
      `select count(*)::int as c from public.partners
       where profile_id <> ($1::uuid)`,
      [pid],
    );
    await client.query("rollback");
    if (mine.rows[0].c >= 1 && leak.rows[0].c === 0) pass("§B member_scope", `visible=${mine.rows[0].c}`);
    else fail("§B member_scope", `visible=${mine.rows[0].c} leak=${leak.rows[0].c}`);
  }

  await client.query("set role service_role");
  const sr = await client.query("select count(*)::int as c from public.partners");
  await client.query("reset role");
  if (sr.rows[0].c >= 5) pass("§B service_role_bypass", String(sr.rows[0].c));
  else fail("§B service_role_bypass", String(sr.rows[0].c));

  // §C
  try {
    await client.query(
      `insert into public.partners (profile_id, type) values (gen_random_uuid(), 'host')`,
    );
    fail("§C fk_profile_id");
  } catch (e) {
    if (String(e).match(/foreign_key|violates foreign key/i)) pass("§C fk_profile_id");
    else fail("§C fk_profile_id", String(e));
  }

  try {
    await client.query(`delete from public.partners where id='00000000-0000-4000-a000-000000000010'`);
    fail("§C revenue_restrict");
  } catch (e) {
    if (String(e).includes("foreign_key") || String(e).includes("violates")) pass("§C revenue_restrict");
    else fail("§C revenue_restrict", String(e));
  }

  // §D idempotent seed
  await client.query(seed);
  pass("§D seed_idempotent");

  // §E
  const p5 = await client.query("select count(*)::int as c from public.partners");
  const svc7 = await client.query("select count(*)::int as c from public.partner_services");
  const rev2 = await client.query("select count(*)::int as c from public.revenue_ledger");
  const leads1 = await client.query(
    "select count(*)::int as c from public.leads where partner_id is not null",
  );
  if (p5.rows[0].c === 5) pass("§E partners_rows", "5");
  else fail("§E partners_rows", String(p5.rows[0].c));
  if (svc7.rows[0].c === 7) pass("§E services_rows", "7");
  else fail("§E services_rows", String(svc7.rows[0].c));
  if (rev2.rows[0].c === 2) pass("§E revenue_rows", "2");
  else fail("§E revenue_rows", String(rev2.rows[0].c));
  if (leads1.rows[0].c >= 1) pass("§E leads_attributed", String(leads1.rows[0].c));
  else fail("§E leads_attributed", String(leads1.rows[0].c));

  // Negative F1 — member cannot self-activate
  const partnerId = "00000000-0000-4000-a000-000000000010";
  await client.query("begin");
  await client.query(`select set_config('request.jwt.claims', $1, true)`, [
    JSON.stringify({ sub: pid }),
  ]);
  await client.query("set local role authenticated");
  try {
    await client.query(
      `update public.partners set status = 'active', completion_score = 100 where id = $1`,
      [partnerId],
    );
    await client.query("rollback");
    fail("F1 negative pen-test", "UPDATE succeeded — privilege leak");
  } catch (e) {
    await client.query("rollback");
    const msg = String(e);
    if (msg.includes("permission denied") || msg.includes("42501")) {
      pass("F1 negative pen-test", "column privilege blocked");
    } else fail("F1 negative pen-test", msg);
  }

  await client.end();

  const failed = results.filter((r) => !r.ok);
  console.log(`\nGate summary: ${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
