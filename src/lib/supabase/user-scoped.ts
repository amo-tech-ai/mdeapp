import { createClient } from "@supabase/supabase-js";

function getToolSupabaseEnv() {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_ANON_KEY for user-scoped client",
    );
  }
  return { url, anonKey };
}

/** AUTH-006 — RLS-scoped reads/writes using the user's access token (preferred over manual Authorization header). */
export function createUserScopedClient(accessToken: string) {
  const { url, anonKey } = getToolSupabaseEnv();
  return createClient(url, anonKey, {
    accessToken: async () => accessToken,
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
