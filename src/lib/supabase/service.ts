import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseServiceEnv } from "./service-env";

let _serviceClient: SupabaseClient<Database> | null = null;

/** Service-role client — bypasses RLS. Server-only (ai_runs, admin jobs). */
export function createServiceRoleClient() {
  const env = getSupabaseServiceEnv();
  if (!env) return null;
  if (!_serviceClient) {
    _serviceClient = createClient<Database>(env.url, env.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _serviceClient;
}

/** @internal Vitest only */
export function resetServiceRoleClientForTests(): void {
  _serviceClient = null;
}
