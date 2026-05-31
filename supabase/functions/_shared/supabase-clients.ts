import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export function getUserClient(authHeader: string): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  return createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function getServiceClient(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getUserId(
  authHeader: string | null,
  client?: SupabaseClient,
): Promise<string | null> {
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const supabase = client || getUserClient(authHeader);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}
