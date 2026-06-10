/* eslint-disable @typescript-eslint/no-explicit-any -- SupabaseClient<> generic matches createClient() from supabase-js@2 */
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

/** Matches `public.agent_type` enum. */
export type AgentTypeEnum =
  | "local_scout"
  | "dining_orchestrator"
  | "event_curator"
  | "itinerary_optimizer"
  | "budget_guardian"
  | "booking_assistant"
  | "general_concierge";

/** Matches `public.ai_run_status` enum. */
export type AiRunStatus =
  | "pending"
  | "running"
  | "success"
  | "error"
  | "timeout"
  | "cancelled";

/** Accept any `createClient()` instance (matches current 5-type-param SupabaseClient). */
export type AiRunsSupabaseClient = SupabaseClient<
  any,
  "public",
  "public",
  any,
  any
>;

/** Best-effort insert; logs on failure (never throws). */
export async function insertAiRun(
  supabase: AiRunsSupabaseClient,
  row: {
    user_id: string;
    agent_name: string;
    agent_type: AgentTypeEnum;
    input_data: Record<string, unknown>;
    output_data?: Record<string, unknown> | null;
    duration_ms: number;
    status: AiRunStatus;
    model_name?: string | null;
    input_tokens?: number | null;
    output_tokens?: number | null;
    total_tokens?: number | null;
    error_message?: string | null;
  },
): Promise<void> {
  const { error } = await supabase.from("ai_runs").insert({
    user_id: row.user_id,
    agent_name: row.agent_name,
    agent_type: row.agent_type,
    input_data: row.input_data,
    output_data: row.output_data ?? null,
    duration_ms: row.duration_ms,
    status: row.status,
    model_name: row.model_name ?? null,
    input_tokens: row.input_tokens ?? null,
    output_tokens: row.output_tokens ?? null,
    total_tokens: row.total_tokens ?? null,
    error_message: row.error_message ?? null,
  });
  if (error) console.error("insertAiRun:", error.message, error);
}

/**
 * Extract OpenAI-compatible usage from a Gemini response.
 * Safe against partial/missing usage blocks.
 */
export function extractUsage(
  body: unknown,
): {
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
} {
  const u = (body as { usage?: Record<string, unknown> } | null)?.usage;
  const n = (v: unknown): number | null =>
    typeof v === "number" && Number.isFinite(v) ? v : null;
  return {
    input_tokens: n(u?.prompt_tokens),
    output_tokens: n(u?.completion_tokens),
    total_tokens: n(u?.total_tokens),
  };
}
