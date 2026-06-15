import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { MASTRA_RESOURCE_ID_KEY, RequestContext } from "@mastra/core/request-context";
import { NextRequest, after } from "next/server";
import { assertCopilotKitAuthorized } from "@/lib/copilotkit-auth";
import {
  checkCopilotKitDistributedIpHardCeiling,
  checkCopilotKitDistributedRateLimit,
} from "@/lib/copilotkit-distributed-rate-limit";
import { createClient } from "@/lib/supabase/server";
import { mastra } from "@/mastra";
import { getLocalAgentsWithLogging } from "@/mastra/copilotkit/logging-mastra-agent";
import { setAuditUserId } from "@/mastra/lib/tool-audit-context";
import { HOST_SUPABASE_KEY } from "@/mastra/tools/hostops-read-tools";
import { logAgentRunForTurn } from "@/mastra/lib/log-agent-run";
import type { PersistTurnLog } from "@/mastra/copilotkit/logging-mastra-agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const serviceAdapter = new ExperimentalEmptyAdapter();

/** Keep ai_runs writes alive after the CopilotKit SSE response (Vercel serverless). */
const persistTurnLog: PersistTurnLog = (opts) => {
  after(async () => {
    try {
      await logAgentRunForTurn(opts);
    } catch (error) {
      const meta = opts.metadata ?? {};
      console.error("[copilotkit ai_runs persist failed]", {
        agentMapKey: opts.agentMapKey,
        status: opts.status,
        threadId:
          (typeof meta.thread_id === "string" ? meta.thread_id : null) ??
          (typeof meta.threadId === "string" ? meta.threadId : null),
        runId:
          (typeof meta.run_id === "string" ? meta.run_id : null) ??
          (typeof meta.runId === "string" ? meta.runId : null),
        error,
      });
    }
  });
};

/** Build per-request CopilotKit handler with Mastra agents and audit logging. */
function buildHandler(options: {
  userId: string | null;
  requestContext: RequestContext;
}) {
  const resourceId = options.userId ?? "anonymous";
  const runtime = new CopilotRuntime({
    agents: getLocalAgentsWithLogging({
      mastra,
      resourceId,
      userId: options.userId,
      requestContext: options.requestContext,
      persistTurnLog,
    }),
  });

  return copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  }).handleRequest;
}

/** Auth, distributed rate limits, then CopilotKit/Mastra runtime. */
async function handleCopilotKit(req: NextRequest) {
  const unauthorized = assertCopilotKitAuthorized(req);
  if (unauthorized) return unauthorized;

  try {
    const ipHardCeiling = await checkCopilotKitDistributedIpHardCeiling(req);
    if (ipHardCeiling) return ipHardCeiling;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id ?? null;

    const rateLimited = await checkCopilotKitDistributedRateLimit(req, userId);
    if (rateLimited) return rateLimited;

    const requestContext = new RequestContext();
    if (userId) {
      requestContext.set(MASTRA_RESOURCE_ID_KEY, userId);
      setAuditUserId(requestContext, userId);
      // SAN-760 · AIE-005 — hostOpsAgent + HostDashboardState — hand the agent's
      // tools the SAME user-scoped client (RLS-governed; never service-role).
      // getHostContext reads it back.
      requestContext.set(HOST_SUPABASE_KEY, supabase);
    }

    return await buildHandler({ userId, requestContext })(req);
  } catch (error) {
    console.error("[copilotkit route failed]", error);
    return new Response("CopilotKit route failed", { status: 500 });
  }
}

/** Catch-all so GET /api/copilotkit/info and POST /api/copilotkit both reach the Hono handler. */
export const GET = handleCopilotKit;
export const POST = handleCopilotKit;
