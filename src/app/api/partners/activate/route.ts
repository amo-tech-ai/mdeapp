import { NextResponse } from "next/server";
import { activatePartnerInputSchema } from "@/lib/partners/activate-schema";
import {
  activatePartner,
  type ActivatePartnerError,
} from "@/lib/partners/activate-partner";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

const CLIENT_ERROR_MESSAGES: Record<ActivatePartnerError["code"], string> = {
  draft_not_found: "Draft not found",
  draft_forbidden: "Draft does not belong to user",
  draft_type_mismatch: "Draft type does not match partner type",
  insert_failed: "Partner activation failed",
  member_failed: "Partner activation failed",
  draft_link_failed: "Partner activation failed",
};

function errorStatus(code: ActivatePartnerError["code"]): number {
  switch (code) {
    case "draft_not_found":
      return 404;
    case "draft_forbidden":
      return 403;
    case "draft_type_mismatch":
      return 400;
    default:
      return 500;
  }
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = activatePartnerInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const service = createServiceRoleClient();
  if (!service) {
    console.error("[/api/partners/activate] service role client unavailable");
    return NextResponse.json({ error: "Partner activation unavailable" }, { status: 503 });
  }

  const result = await activatePartner(service, user.id, parsed.data);
  if (!result.ok) {
    console.error(
      "[/api/partners/activate]",
      result.error.code,
      result.error.message,
    );
    return NextResponse.json(
      { error: CLIENT_ERROR_MESSAGES[result.error.code] },
      { status: errorStatus(result.error.code) },
    );
  }

  const { created, ...payload } = result.data;
  return NextResponse.json(payload, { status: created ? 201 : 200 });
}
