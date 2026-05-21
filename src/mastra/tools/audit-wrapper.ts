import type { RiskLevel } from "./risk-levels";

export interface AuditContext {
  tool_name: string;
  risk: RiskLevel;
  user_id: string | null;
  org_id: string | null;
}

export interface AuditedTool<TInput, TOutput> {
  execute: (input: TInput, ctx: AuditContext) => Promise<TOutput>;
}

/**
 * Wraps a tool executor with pre/post audit logging (console until ai_tool_audit_events exists).
 */
export function withAudit<TInput, TOutput>(
  toolName: string,
  risk: RiskLevel,
  fn: (input: TInput) => Promise<TOutput>,
): (input: TInput, ctx?: Partial<AuditContext>) => Promise<TOutput> {
  return async (input: TInput, ctx?: Partial<AuditContext>) => {
    const started = Date.now();
    const auditCtx: AuditContext = {
      tool_name: toolName,
      risk,
      user_id: ctx?.user_id ?? null,
      org_id: ctx?.org_id ?? null,
    };

    console.info("[audit:pre]", auditCtx.tool_name, { risk: auditCtx.risk });

    try {
      const result = await fn(input);
      const duration = Date.now() - started;
      console.info("[audit:post]", auditCtx.tool_name, {
        duration_ms: duration,
        status: "ok",
      });
      return result;
    } catch (err) {
      const duration = Date.now() - started;
      console.error("[audit:error]", auditCtx.tool_name, {
        duration_ms: duration,
        error: String(err),
      });
      throw err;
    }
  };
}
