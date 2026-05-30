import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { MASTRA_RESOURCE_ID_KEY, RequestContext } from "@mastra/core/request-context";
import { NextRequest } from "next/server";
import { assertCopilotKitAuthorized } from "@/lib/copilotkit-auth";
import { createClient } from "@/lib/supabase/server";
import { mastra } from "@/mastra";
import { getLocalAgentsWithLogging } from "@/mastra/copilotkit/logging-mastra-agent";
import { setAuditUserId } from "@/mastra/lib/tool-audit-context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const serviceAdapter = new ExperimentalEmptyAdapter();

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
    }),
  });

  return copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  }).handleRequest;
}

async function handleCopilotKit(req: NextRequest) {
  const unauthorized = assertCopilotKitAuthorized(req);
  if (unauthorized) return unauthorized;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const requestContext = new RequestContext();
    const userId = user?.id ?? null;
    if (userId) {
      requestContext.set(MASTRA_RESOURCE_ID_KEY, userId);
      setAuditUserId(requestContext, userId);
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
