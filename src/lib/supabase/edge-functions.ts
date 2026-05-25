import { getSupabaseEnv } from "./env";

/** Supabase Edge Functions base URL (server-side proxy only). */
export function getSupabaseFunctionsBaseUrl(): string {
  const { url } = getSupabaseEnv();
  return `${url.replace(/\/$/, "")}/functions/v1`;
}

export function getSupabaseAnonAuthHeaders(accessToken?: string | null): Record<string, string> {
  const { anonKey } = getSupabaseEnv();
  return {
    apikey: anonKey,
    Authorization: `Bearer ${accessToken ?? anonKey}`,
    "Content-Type": "application/json",
  };
}
