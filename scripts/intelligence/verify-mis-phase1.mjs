#!/usr/bin/env node
/**
 * MIS Phase 1 live DB smoke — DATA-041 venue_signals + signal plane tables.
 * Usage: cd mdeapp && npm run verify:mis-phase1
 * Expect: 10/10 PASS, exit 0
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
const anonKey =
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !serviceKey) {
  console.error("FAIL: missing SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** @type {{ id: string; label: string; run: () => Promise<void> }[]} */
const checks = [
  {
    id: "DATA-041-count",
    label: "venue_signals >= 30 (20 restaurant + 5 cafe + 5 nightclub)",
    run: async () => {
      const { data, error } = await admin.from("venue_signals").select("venue_kind, restaurant_id");
      if (error) throw new Error(error.message);
      const rows = data ?? [];
      if (rows.length < 30) throw new Error(`count=${rows.length}`);
      const restaurant = rows.filter((r) => r.restaurant_id).length;
      const cafe = rows.filter((r) => r.venue_kind === "cafe").length;
      const nightclub = rows.filter((r) => r.venue_kind === "nightclub").length;
      if (restaurant < 20) throw new Error(`restaurant=${restaurant}`);
      if (cafe < 5) throw new Error(`cafe=${cafe}`);
      if (nightclub < 5) throw new Error(`nightclub=${nightclub}`);
    },
  },
  {
    id: "GQ-S01-rooftop",
    label: "Provenza rooftop >= 0.7 conf >= 0.6 (Relato, Sambombi)",
    async run() {
      const { data: signals, error: sigErr } = await admin
        .from("venue_signals")
        .select("restaurant_id, rooftop_score, confidence")
        .gte("rooftop_score", 0.7)
        .gte("confidence", 0.6)
        .not("restaurant_id", "is", null);
      if (sigErr) throw new Error(sigErr.message);
      const ids = (signals ?? []).map((s) => s.restaurant_id).filter(Boolean);
      if (!ids.length) throw new Error("no rooftop signal rows");

      const { data: restaurants, error: restErr } = await admin
        .from("restaurants")
        .select("name, neighborhood")
        .in("id", ids)
        .ilike("neighborhood", "%Provenza%");
      if (restErr) throw new Error(restErr.message);

      const names = (restaurants ?? []).map((r) => r.name);
      if (names.length < 1) throw new Error("no Provenza rooftop rows");
      for (const n of ["Relato", "Sambombi"]) {
        if (!names.some((x) => x.includes(n))) {
          throw new Error(`missing ${n} in [${names.join(", ")}]`);
        }
      }
    },
  },
  {
    id: "DATA-041-low-conf",
    label: "venue_signals confidence < 0.6 count = 0",
    async run() {
      const { count, error } = await admin
        .from("venue_signals")
        .select("id", { count: "exact", head: true })
        .lt("confidence", 0.6);
      if (error) throw new Error(error.message);
      if ((count ?? 0) > 0) throw new Error(`low_conf=${count}`);
    },
  },
  {
    id: "DATA-041-evidence",
    label: "venue_signals evidence jsonb non-empty (all rows)",
    async run() {
      const { data, error } = await admin.from("venue_signals").select("id, evidence");
      if (error) throw new Error(error.message);
      const empty = (data ?? []).filter(
        (r) => !r.evidence || (typeof r.evidence === "object" && Object.keys(r.evidence).length === 0),
      );
      if (empty.length) throw new Error(`${empty.length} rows with empty evidence`);
    },
  },
  {
    id: "DATA-041-anon-rls",
    label: "anon SELECT venue_signals (public read policy)",
    async run() {
      if (!anonKey) throw new Error("missing SUPABASE_ANON_KEY — skip or set alias");
      const anon = createClient(url, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { count, error } = await anon
        .from("venue_signals")
        .select("id", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      if ((count ?? 0) < 30) throw new Error(`anon count=${count}`);
    },
  },
  {
    id: "DATA-041-R06-anchor-evidence",
    label: "venue_source_evidence >= 10 anchor rows (5 cafe + 5 nightclub)",
    async run() {
      const { data, error } = await admin
        .from("venue_source_evidence")
        .select("venue_kind, venue_anchor_id")
        .not("venue_anchor_id", "is", null);
      if (error) throw new Error(error.message);
      const rows = data ?? [];
      if (rows.length < 10) throw new Error(`anchor_evidence=${rows.length}`);
      const cafe = rows.filter((r) => r.venue_kind === "cafe").length;
      const nightclub = rows.filter((r) => r.venue_kind === "nightclub").length;
      if (cafe < 5) throw new Error(`cafe_evidence=${cafe}`);
      if (nightclub < 5) throw new Error(`nightclub_evidence=${nightclub}`);
    },
  },
  {
    id: "MIS-event-signals",
    label: "event_signals >= 40 (Phase 1 seed floor)",
    async run() {
      const { count, error } = await admin
        .from("event_signals")
        .select("*", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      if ((count ?? 0) < 40) throw new Error(`count=${count}`);
    },
  },
  {
    id: "MIS-rental-signals",
    label: "rental_signals >= 40 (Phase 1 seed floor)",
    async run() {
      const { count, error } = await admin
        .from("rental_signals")
        .select("*", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      if ((count ?? 0) < 40) throw new Error(`count=${count}`);
    },
  },
  {
    id: "MIS-neighborhood-profiles",
    label: "neighborhood_profiles >= 8",
    async run() {
      const { count, error } = await admin
        .from("neighborhood_profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      if ((count ?? 0) < 8) throw new Error(`count=${count}`);
    },
  },
  {
    id: "VEC-004-embed-cache",
    label: "query_embedding_cache table readable (service role)",
    async run() {
      const { error } = await admin.from("query_embedding_cache").select("cache_key").limit(1);
      if (error) throw new Error(error.message);
    },
  },
];

let failed = 0;
console.log("MIS Phase 1 verify (DATA-041 + signal plane)\n");

for (const check of checks) {
  try {
    await check.run();
    console.log(`PASS  ${check.id}: ${check.label}`);
  } catch (e) {
    failed += 1;
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`FAIL  ${check.id}: ${check.label} — ${msg}`);
  }
}

const passed = checks.length - failed;
console.log(`\n${passed}/${checks.length} passed`);

if (failed) process.exit(1);
console.log("PASS: verify:mis-phase1");
