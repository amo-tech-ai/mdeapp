import { withAudit } from "@/mastra/tools/audit-wrapper";
import { RiskLevel } from "@/mastra/tools/risk-levels";
import { getAuditUserId, recordToolSpan } from "./tool-audit-context";

/**
 * AGT-00C — record tool timing + success/failure on the shared RequestContext.
 * Used by tools that do not need the audit-wrapper input shape (e.g. grounded places).
 */
export async function runAuditedTool<TOutput>(
  toolName: string,
  fn: () => Promise<TOutput>,
  context?: unknown,
): Promise<TOutput> {
  const ts = Date.now();
  try {
    const result = await fn();
    recordToolSpan(context, {
      tool: toolName,
      ms: Date.now() - ts,
      status: "ok",
      ts,
    });
    return result;
  } catch (err) {
    recordToolSpan(context, {
      tool: toolName,
      ms: Date.now() - ts,
      status: "error",
      ts,
    });
    throw err;
  }
}

/**
 * MASTRA-004 — wrap search tool side-effects with pre/post audit logging.
 * AGT-00C — also records a tool-timing span onto the shared RequestContext so
 * the turn's `ai_runs.metadata` shows which tool was slow (no observability dep).
 */
export async function runAuditedSearch<TInput, TOutput>(
  toolName: string,
  fn: (input: TInput) => Promise<TOutput>,
  input: TInput,
  context?: unknown,
): Promise<TOutput> {
  const audited = withAudit(toolName, RiskLevel.low, fn);
  return runAuditedTool(
    toolName,
    () => audited(input, { user_id: getAuditUserId(context) }),
    context,
  );
}
