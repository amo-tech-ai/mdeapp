import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceEnv } from "./service-env";

let _serviceClient: ReturnType<typeof createClient> | null = null;

/** Service-role client — bypasses RLS. Server-only (ai_runs, admin jobs). */
export function createServiceRoleClient() {
  const env = getSupabaseServiceEnv();
  if (!env) return null;
  if (!_serviceClient) {
    _serviceClient = createClient(env.url, env.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _serviceClient;
}

/** @internal Vitest only */
export function resetServiceRoleClientForTests(): void {
  _serviceClient = null;
}
