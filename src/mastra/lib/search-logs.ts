import { createServiceRoleClient } from "@/lib/supabase/service";

export type RankExplanationEntry = {
  factor: string;
  score: number;
  note: string;
};

export type SearchLogPayload = {
  queryText: string;
  intent?: string;
  slots?: Record<string, unknown>;
  toolName: string;
  resultsCount: number;
  latencyMs: number;
  hybridUsed?: boolean;
  groundingUsed?: boolean;
  rankExplanation?: RankExplanationEntry[];
  sessionId?: string;
  userId?: string;
};

/** Server-only observability — service_role insert into search_logs. */
export async function writeSearchLog(payload: SearchLogPayload): Promise<string | null> {
  const client = createServiceRoleClient();
  if (!client) {
    console.warn("[search-logs] service role unavailable — skip insert");
    return null;
  }

  const { data, error } = await client
    .from("search_logs" as "restaurants")
    .insert({
      query_text: payload.queryText,
      intent: payload.intent ?? null,
      slots: payload.slots ?? {},
      tool_name: payload.toolName,
      results_count: payload.resultsCount,
      latency_ms: payload.latencyMs,
      hybrid_used: payload.hybridUsed ?? false,
      grounding_used: payload.groundingUsed ?? false,
      rank_explanation: payload.rankExplanation ?? [],
      session_id: payload.sessionId ?? null,
      user_id: payload.userId ?? null,
    } as never)
    .select("id")
    .single();

  if (error) {
    console.warn("[search-logs] insert failed:", error.message);
    return null;
  }

  return (data as { id?: string } | null)?.id ?? null;
}
