import { createClient } from "@supabase/supabase-js";

const DEFAULT_DAILY_CAP = 200;

export type GroundingQuotaResult =
  | { allowed: true }
  | { allowed: false; reason: "quota" | "disabled" };

/**
 * MAP-002B — durable daily cap via `grounding_quota_log` (legacy migration applied).
 * Fail-closed when at cap or MAPS_GROUNDING_DAILY_LIMIT=0.
 */
export async function incrementAndCheckGroundingQuota(): Promise<GroundingQuotaResult> {
  const limitRaw = process.env.MAPS_GROUNDING_DAILY_LIMIT;
  if (limitRaw === "0") {
    return { allowed: false, reason: "disabled" };
  }
  const dailyCap = limitRaw ? Number.parseInt(limitRaw, 10) : DEFAULT_DAILY_CAP;
  if (!Number.isFinite(dailyCap) || dailyCap <= 0) {
    return { allowed: false, reason: "disabled" };
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return { allowed: true };
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const today = new Date().toISOString().slice(0, 10);

  const { data: existing, error: readErr } = await supabase
    .from("grounding_quota_log")
    .select("count")
    .eq("date", today)
    .maybeSingle();

  if (readErr) {
    console.warn("[grounding-quota] read failed, allowing call:", readErr.message);
    return { allowed: true };
  }

  const current = existing?.count ?? 0;
  if (current >= dailyCap) {
    return { allowed: false, reason: "quota" };
  }

  const next = current + 1;
  const { error: writeErr } = await supabase.from("grounding_quota_log").upsert(
    { date: today, count: next },
    { onConflict: "date" },
  );

  if (writeErr) {
    console.warn("[grounding-quota] increment failed, allowing call:", writeErr.message);
    return { allowed: true };
  }

  return { allowed: true };
}
