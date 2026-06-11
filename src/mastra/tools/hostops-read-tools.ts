import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { RequestContext } from "@mastra/core/request-context";
import type { Database } from "@/lib/supabase/database.types";
import { getAuditUserId } from "@/mastra/lib/tool-audit-context";
import {
  listHostEvents,
  getSalesSummary,
  hostEventSummarySchema,
  salesSummarySchema,
} from "@/lib/events/hostops-read-core";

/**
 * SAN-762 · AIE-006 — HostOps read tools (Mastra wrappers).
 * Thin wrappers over the core read functions. They read the per-request
 * RequestContext that the /api/copilotkit route already carries: the userId via
 * the established `getAuditUserId` helper, and the USER-SCOPED Supabase client via
 * `HOST_SUPABASE_KEY`. The route setting that client is SAN-760 · AIE-005 — until
 * then these tools are defined but dormant (execute throws a clear "sign in").
 * No service-role anywhere — RLS governs (see hostops-read-core.ts).
 */

/** RequestContext key the /api/copilotkit route uses to pass the user-scoped client (set by SAN-760 · AIE-005). */
export const HOST_SUPABASE_KEY = "hostSupabase";

type HostCtx = { supabase: SupabaseClient<Database>; userId: string };

/** Read userId + user-scoped client from the shared RequestContext (same carrier as the audit userId). */
export function getHostContext(context: unknown): HostCtx {
  const userId = getAuditUserId(context);
  const requestContext = (context as { requestContext?: RequestContext } | undefined)
    ?.requestContext;
  const supabase = requestContext?.get(HOST_SUPABASE_KEY) as
    | SupabaseClient<Database>
    | undefined;
  if (!userId || !supabase) {
    throw new Error("Sign in as a host to view your events and sales.");
  }
  return { supabase, userId };
}

export const listHostEventsTool = createTool({
  id: "list-host-events",
  description:
    "List the signed-in host's OWN events (drafts + published) with status and start time. Use for 'which events do I have?'.",
  inputSchema: z.object({
    status: z.string().optional().describe("Filter by event status, e.g. 'published' or 'draft'"),
    limit: z.number().int().min(1).max(100).optional(),
  }),
  outputSchema: z.object({ events: z.array(hostEventSummarySchema) }),
  execute: async (input: { status?: string; limit?: number }, context?: unknown) => {
    const { supabase, userId } = getHostContext(context);
    const r = await listHostEvents(supabase, userId, input);
    if (!r.ok) throw new Error(r.message);
    return { events: r.data };
  },
});

export const getSalesSummaryTool = createTool({
  id: "get-sales-summary",
  description:
    "Sales summary (paid/cancelled orders, gross revenue, tickets sold, per-tier breakdown) for ONE of the signed-in host's own events. Numbers come straight from the database.",
  inputSchema: z.object({ eventId: z.string().uuid() }),
  outputSchema: salesSummarySchema,
  execute: async (input: { eventId: string }, context?: unknown) => {
    const { supabase, userId } = getHostContext(context);
    const r = await getSalesSummary(supabase, userId, input.eventId);
    if (!r.ok) throw new Error(r.message);
    return r.data;
  },
});
