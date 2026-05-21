/**
 * Server-only Supabase credentials for privileged writes (e.g. ai_runs).
 * Never import from client components or expose via NEXT_PUBLIC_*.
 */
export function getSupabaseServiceEnv(): {
  url: string;
  serviceRoleKey: string;
} | null {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}
