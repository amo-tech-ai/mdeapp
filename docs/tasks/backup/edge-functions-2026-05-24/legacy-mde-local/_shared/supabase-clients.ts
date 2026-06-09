/**
 * Shared Supabase client factories for edge functions.
 *
 * TWO clients, TWO purposes:
 * - getUserClient(authHeader) — for user-scoped queries respecting RLS
 * - getServiceClient()        — for admin operations (logging, notifications, internal calls)
 *
 * NEVER use service client for user-facing data queries.
 * Pattern modeled on p1-crm (the only function with correct auth).
 */ import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
/**
 * Create a Supabase client scoped to the authenticated user.
 * Uses anon key + user's JWT → RLS policies enforced.
 */ export function getUserClient(authHeader) {
  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  return createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: authHeader
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
/**
 * Create a Supabase client with service role key.
 * Bypasses RLS — use ONLY for:
 * - Inserting ai_runs logs
 * - Creating notifications
 * - Internal edge-to-edge function calls
 * - Admin operations after explicit role check
 */ export function getServiceClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
/**
 * Extract user ID from a Bearer token.
 * Returns null if token is invalid or missing.
 */ export async function getUserId(authHeader, client) {
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const supabase = client || getUserClient(authHeader);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}
