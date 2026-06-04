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

// Fail loudly at module load so the error shows in Vercel Function logs rather than
// as a cryptic "Agent not found" on the client.
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error(
    "[copilotkit] GOOGLE_GENERATIVE_AI_API_KEY is not set. " +
      "Set it in Vercel project settings (Settings → Environment Variables) " +
      "for Preview and Production environments. " +
      "Without it every /api/copilotkit call will fail with AI_APICallError.",
  );
}

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
    const isApiKeyError =
      error instanceof Error &&
      (error.message.includes("project has been denied access") ||
        error.message.includes("API_KEY_INVALID") ||
        error.message.includes("GOOGLE_GENERATIVE_AI_API_KEY"));
    if (isApiKeyError) {
      console.error(
        "[copilotkit] AI provider rejected the request. " +
          "Verify GOOGLE_GENERATIVE_AI_API_KEY is set and the Gemini API is enabled " +
          "for this project in Google Cloud Console.",
        error,
      );
      return new Response(
        "AI provider not configured — check server logs for GOOGLE_GENERATIVE_AI_API_KEY",
        { status: 503 },
      );
    }
    console.error("[copilotkit route failed]", error);
    return new Response("CopilotKit route failed", { status: 500 });
  }
}

/** Catch-all so GET /api/copilotkit/info and POST /api/copilotkit both reach the Hono handler. */
export const GET = handleCopilotKit;
export const POST = handleCopilotKit;
