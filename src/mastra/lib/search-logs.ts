import { createHash } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/service";

/** Truncate to 256 chars so raw PII-containing queries are never stored in full. */
function truncateQuery(s: string): string {
  return s.length > 256 ? `${s.slice(0, 256)}…` : s;
}

/** One-way SHA-256 prefix so session/user can still be correlated without storing raw IDs. */
function hashId(id: string | undefined): string | null {
  if (!id) return null;
  return createHash("sha256").update(id).digest("hex").slice(0, 16);
}

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
  embedStatus?: string;
  embedFailureReason?: string;
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
      query_text: truncateQuery(payload.queryText),
      intent: payload.intent ?? null,
      slots: {
        ...(payload.slots ?? {}),
        ...(payload.embedStatus ? { embedStatus: payload.embedStatus } : {}),
        ...(payload.embedFailureReason
          ? { embedFailureReason: payload.embedFailureReason }
          : {}),
      },
      tool_name: payload.toolName,
      results_count: payload.resultsCount,
      latency_ms: payload.latencyMs,
      hybrid_used: payload.hybridUsed ?? false,
      grounding_used: payload.groundingUsed ?? false,
      rank_explanation: payload.rankExplanation ?? [],
      session_id: hashId(payload.sessionId),
      user_id: hashId(payload.userId),
    } as never)
    .select("id")
    .single();

  if (error) {
    console.warn("[search-logs] insert failed:", error.message);
    return null;
  }

  return (data as { id?: string } | null)?.id ?? null;
}
