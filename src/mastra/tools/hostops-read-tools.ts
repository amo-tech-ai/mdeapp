import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import {
  listHostEvents,
  getSalesSummary,
  hostEventSummarySchema,
  salesSummarySchema,
} from "@/lib/events/hostops-read-core";

/**
 * SAN-762 · AIE-006 — HostOps read tools (Mastra wrappers).
 * Thin wrappers over the core read functions. The USER-SCOPED Supabase client +
 * userId arrive on the Mastra runtime context (key "hostCtx"), set per request in
 * /api/copilotkit — that injection is SAN-760 · AIE-005. Until then these tools are
 * defined but dormant: execute throws a clear "sign in" error if no host context.
 * No service-role anywhere — RLS governs (see hostops-read-core.ts).
 */

type HostCtx = { supabase: SupabaseClient<Database>; userId: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function requireHostCtx(options: any): HostCtx {
  const ctx = options?.runtimeContext?.get?.("hostCtx") as HostCtx | undefined;
  if (!ctx?.userId || !ctx.supabase) {
    throw new Error("Sign in as a host to view your events and sales.");
  }
  return ctx;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: async (input: { status?: string; limit?: number }, options?: any) => {
    const { supabase, userId } = requireHostCtx(options);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: async (input: { eventId: string }, options?: any) => {
    const { supabase, userId } = requireHostCtx(options);
    const r = await getSalesSummary(supabase, userId, input.eventId);
    if (!r.ok) throw new Error(r.message);
    return r.data;
  },
});
