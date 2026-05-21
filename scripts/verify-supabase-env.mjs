#!/usr/bin/env node
/**
 * Live probe: anon auth + service-role ai_runs insert.
 * Usage: node --env-file=.env.local scripts/verify-supabase-env.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const errors = [];

if (!url) errors.push("missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL");
if (!serviceKey)
  errors.push(
    "missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY",
  );
if (!anonKey) errors.push("missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
if (
  process.env.SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.SUPABASE_URL !== process.env.NEXT_PUBLIC_SUPABASE_URL
) {
  errors.push("SUPABASE_URL !== NEXT_PUBLIC_SUPABASE_URL");
}

if (errors.length) {
  console.error("FAIL");
  errors.forEach((e) => console.error(" -", e));
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const probe = `verify-${Date.now()}`;
const { error: insertErr } = await admin.from("ai_runs").insert({
  user_id: null,
  agent_name: "ping-agent",
  agent_type: "general_concierge",
  input_data: { probe },
  output_data: {},
  status: "success",
  duration_ms: 1,
  model_name: "env-probe",
});
if (insertErr) errors.push(`service insert: ${insertErr.message}`);

const anon = createClient(url, anonKey);
const { error: authErr } = await anon.auth.getSession();
if (authErr) errors.push(`anon auth: ${authErr.message}`);

if (errors.length) {
  console.error("FAIL");
  errors.forEach((e) => console.error(" -", e));
  process.exit(1);
}

console.log("PASS: Supabase anon + service-role credentials OK");
