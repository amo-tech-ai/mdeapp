/**
 * Best-effort ai_runs writer for the Mastra runtime (CopilotKit Pattern 1).
 * Never throws — failures are logged and swallowed so chat is never blocked.
 */
import {
  createServiceRoleClient,
  resetServiceRoleClientForTests,
} from "@/lib/supabase/service";

/** Postgres agent_type enum labels used by mdeapp agents (no `ping` until migration). */
export type AgentType =
  | "event_curator"
  | "local_scout"
  | "general_concierge"
  | "concierge"
  | "sponsor";

export type AiRunStatus = "success" | "error" | "timeout";

export interface MastraRunRecord {
  user_id: string | null;
  agent_name: string;
  agent_type: AgentType;
  input_data?: Record<string, unknown>;
  output_data?: Record<string, unknown>;
  status: AiRunStatus;
  error_message?: string | null;
  error_code?: string | null;
  /**
   * OBS-002 — coarse failure class. Folded into `metadata.error_type` (not a
   * dedicated column yet) so the insert stays compatible with the live `ai_runs`
   * schema; promote to a first-class column via migration when ready.
   */
  error_type?: string | null;
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  duration_ms?: number;
  model_name?: string;
  metadata?: Record<string, unknown>;
}

/** @internal Vitest only — clears singleton between tests */
export function resetAiRunsClientForTests(): void {
  resetServiceRoleClientForTests();
}

export async function recordMastraRun(record: MastraRunRecord): Promise<void> {
  const client = createServiceRoleClient();
  if (!client) {
    console.warn(
      "[ai-runs] Supabase URL/key missing (need SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, or NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY) — skipping insert",
    );
    return;
  }
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const deadline = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error("ai_runs insert timeout")),
        2500,
      );
    });
    type AiRunsInsertClient = {
      from: (table: string) => {
        insert: (
          row: Record<string, unknown>,
        ) => Promise<{ error: { message: string } | null }>;
      };
    };
    const { error } = await Promise.race([
      (client as unknown as AiRunsInsertClient).from("ai_runs").insert({
        user_id: record.user_id,
        agent_name: record.agent_name,
        agent_type: record.agent_type,
        input_data: record.input_data ?? {},
        output_data: record.output_data ?? {},
        status: record.status,
        error_message: record.error_message ?? record.error_code ?? null,
        input_tokens: record.input_tokens ?? 0,
        output_tokens: record.output_tokens ?? 0,
        total_tokens:
          record.total_tokens ??
          (record.input_tokens ?? 0) + (record.output_tokens ?? 0),
        duration_ms: record.duration_ms ?? 0,
        model_name: record.model_name ?? null,
        metadata: record.error_type
          ? { ...(record.metadata ?? {}), error_type: record.error_type }
          : (record.metadata ?? null),
      }),
      deadline,
    ]);
    if (error) {
      console.error("[ai-runs] insert failed:", error.message);
    }
  } catch (err) {
    console.warn(
      "[ai-runs] skipped:",
      err instanceof Error ? err.message : String(err),
    );
  } finally {
    // Release the timeout timer the moment the insert settles. Without this the
    // pending setTimeout keeps the Node event loop warm for up to 2500ms per call
    // even after a fast insert — harmless but wasteful under chat load.
    if (timeoutId) clearTimeout(timeoutId);
  }
}
