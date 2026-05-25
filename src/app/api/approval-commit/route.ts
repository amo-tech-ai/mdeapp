import { NextResponse } from "next/server";
import { ApprovalCommitInputSchema } from "@/lib/events/approval-commit-schema";
import { createClient } from "@/lib/supabase/server";
import {
  getSupabaseAnonAuthHeaders,
  getSupabaseFunctionsBaseUrl,
} from "@/lib/supabase/edge-functions";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { message: "Invalid JSON" } },
      { status: 400 },
    );
  }

  const parsed = ApprovalCommitInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Validation failed", details: parsed.error.flatten() },
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: { message: "Sign in required" } },
      { status: 401 },
    );
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return NextResponse.json(
      { success: false, error: { message: "Sign in required" } },
      { status: 401 },
    );
  }

  const edgeRes = await fetch(`${getSupabaseFunctionsBaseUrl()}/approval-commit`, {
    method: "POST",
    headers: getSupabaseAnonAuthHeaders(session.access_token),
    body: JSON.stringify(parsed.data),
  });

  const edgeJson = (await edgeRes.json()) as {
    success?: boolean;
    eventId?: string;
    slug?: string;
    approvalRequestId?: string;
    decision?: string;
    error?: { message?: string; code?: string };
  };

  if (!edgeRes.ok) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: edgeJson.error?.message ?? "Approval commit failed",
          code: edgeJson.error?.code,
        },
      },
      { status: edgeRes.status >= 400 ? edgeRes.status : 502 },
    );
  }

  return NextResponse.json({
    success: true,
    eventId: edgeJson.eventId ?? null,
    slug: edgeJson.slug ?? null,
    approvalRequestId: edgeJson.approvalRequestId,
    decision: edgeJson.decision ?? parsed.data.decision,
  });
}
