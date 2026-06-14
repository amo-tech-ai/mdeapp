import { isSearchGroundingEnabled } from "@/lib/is-search-grounding-enabled";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_DAILY_CAP = 50;

export type SearchGroundingQuotaResult =
  | { allowed: true }
  | { allowed: false; reason: "quota" | "disabled" };

/** GS-003 — Search grounding bucket separate from Maps MCP (`search_grounding_quota_log`). */
export async function incrementAndCheckSearchGroundingQuota(): Promise<SearchGroundingQuotaResult> {
  if (!isSearchGroundingEnabled()) {
    return { allowed: false, reason: "disabled" };
  }

  const limitRaw = process.env.SEARCH_GROUNDING_DAILY_CAP;
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
    .from("search_grounding_quota_log")
    .select("count")
    .eq("date", today)
    .maybeSingle();

  if (readErr) {
    console.warn(
      "[search-grounding-quota] read failed, allowing call:",
      readErr.message,
    );
    return { allowed: true };
  }

  const current = existing?.count ?? 0;
  if (current >= dailyCap) {
    return { allowed: false, reason: "quota" };
  }

  const next = current + 1;
  const { error: writeErr } = await supabase
    .from("search_grounding_quota_log")
    .upsert({ date: today, count: next }, { onConflict: "date" });

  if (writeErr) {
    console.warn(
      "[search-grounding-quota] increment failed, allowing call:",
      writeErr.message,
    );
    return { allowed: true };
  }

  return { allowed: true };
}
