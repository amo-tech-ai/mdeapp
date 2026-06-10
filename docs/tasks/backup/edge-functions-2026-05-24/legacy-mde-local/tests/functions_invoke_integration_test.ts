/**
 * Integration tests: Functions gateway + `functions.invoke` (local or remote URL in env).
 * Pattern inspired by
 * https://blog.mansueli.com/testing-supabase-edge-functions-with-deno-test
 * (prefer `npm:` / `jsr:` in tests; handlers use `Deno.serve`, not `serve` from std).
 *
 * **Opt-in:** `SUPABASE_FUNCTIONS_INTEGRATION=1` plus `SUPABASE_URL` and anon/publishable key.
 *
 * **Local:** `supabase start` · Terminal A `supabase functions serve` · Terminal B e.g.
 * ```
 * SUPABASE_FUNCTIONS_INTEGRATION=1 \\
 * deno test --allow-all --env-file=.env.supabase.local \\
 * ./supabase/functions/tests/functions_invoke_integration_test.ts
 * ```
 */

import { assertEquals } from "jsr:@std/assert@1";
import { createClient } from "npm:@supabase/supabase-js@2";

const ENABLED = Deno.env.get("SUPABASE_FUNCTIONS_INTEGRATION") === "1";
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey =
  Deno.env.get("SUPABASE_ANON_KEY") ??
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
  "";

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
} as const;

Deno.test({
  name: "integration (opt-in): Supabase anon client reachable",
  ignore: !(ENABLED && supabaseUrl && supabaseAnonKey),
  async fn() {
    const client = createClient(supabaseUrl, supabaseAnonKey, clientOptions);
    const r = await client.auth.getSession();
    assertEquals(r.error?.message ?? "", "");
  },
});

Deno.test({
  name:
    "integration (opt-in): ai-router functions.invoke matches quick intent (needs functions serve)",
  ignore: !(ENABLED && supabaseUrl && supabaseAnonKey),
  async fn() {
    const client = createClient(supabaseUrl, supabaseAnonKey, clientOptions);
    const { data, error } = await client.functions.invoke<
      Record<string, unknown>
    >("ai-router", {
      body: { message: "hi" },
    });
    if (error) throw new Error(error.message);

    assertEquals(data?.success, true);
    const body = data as {
      success: boolean;
      data?: { intent?: string };
    };
    assertEquals(body.data?.intent, "general_greeting");
  },
});
