import { withAudit } from "@/mastra/tools/audit-wrapper";
import { RiskLevel } from "@/mastra/tools/risk-levels";
import { getAuditUserId } from "./tool-audit-context";

/** MASTRA-004 — wrap search tool side-effects with pre/post audit logging. */
export async function runAuditedSearch<TInput, TOutput>(
  toolName: string,
  fn: (input: TInput) => Promise<TOutput>,
  input: TInput,
  context?: unknown,
): Promise<TOutput> {
  const audited = withAudit(toolName, RiskLevel.low, fn);
  return audited(input, { user_id: getAuditUserId(context) });
}
