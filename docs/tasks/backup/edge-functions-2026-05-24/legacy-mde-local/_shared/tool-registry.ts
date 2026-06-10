/**
 * Shared types for the tool registry pattern used by ai-chat.
 *
 * Registries live inside each edge function (e.g. ai-chat/index.ts exports
 * its own `TOOLS` const). This module just provides the TYPES so every
 * registry has the same shape — `Object.values(TOOLS)` always gives an
 * iterable of `ToolExecutor`s, and adding a new tool is one new entry.
 *
 * See: tasks/CHAT-CENTRAL-PLAN.md §3 — Architecture.
 */

import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

/**
 * JSON Schema fragment consumed by the LLM (OpenAI-compatible function spec).
 * Passed to Gemini as part of the `tools` array on the initial completion call.
 */
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/** Per-invocation context threaded from the HTTP handler into every tool. */
export interface ToolExecutorContext {
  params: Record<string, unknown>;
  /** User-scoped Supabase client (respects RLS). */
  supabase: SupabaseClient;
  /** Authenticated user id (null if anonymous — tools must handle). */
  userId: string | null;
  /** Raw Authorization header — forward to internal edge-fn calls. */
  authHeader: string | null;
  /** Chat thread id from request body (logged-in users). */
  conversationId?: string | null;
}

/**
 * A registered tool pairs an LLM-facing definition with a runtime executor.
 * Return values SHOULD conform to `ToolResponse` (tool-response.ts) so the
 * client can render them generically, but tools that don't return listings
 * (e.g. `get_user_trips` returning an array) still work — the envelope check
 * is a capability query, not a hard requirement.
 */
export interface ToolExecutor {
  definition: ToolDefinition;
  execute(ctx: ToolExecutorContext): Promise<unknown>;
}

/**
 * Helper: turn a registry into the array-of-{type:"function",function:def}
 * shape Gemini expects for the `tools` request parameter.
 */
export function toolsArrayFromRegistry(
  registry: Record<string, ToolExecutor>,
): Array<{ type: "function"; function: ToolDefinition }> {
  return Object.values(registry).map((t) => ({
    type: "function" as const,
    function: t.definition,
  }));
}

/**
 * Helper: dispatch a tool call by name. Returns a safe error object if the
 * name is not registered — never throws (swallowed errors would confuse the
 * LLM's tool-response handling).
 */
export async function dispatchTool(
  registry: Record<string, ToolExecutor>,
  toolName: string,
  ctx: ToolExecutorContext,
): Promise<unknown> {
  const tool = registry[toolName];
  if (!tool) {
    return { error: `Unknown tool: ${toolName}` };
  }
  try {
    return await tool.execute(ctx);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`tool ${toolName} threw:`, message);
    return { error: `Tool ${toolName} failed`, details: message };
  }
}
