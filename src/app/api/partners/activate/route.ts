import { NextResponse } from "next/server";
import { activatePartnerInputSchema } from "@/lib/partners/activate-schema";
import { activatePartner } from "@/lib/partners/activate-partner";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

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
    const status =
      result.error.code === "draft_not_found"
        ? 404
        : result.error.code === "draft_forbidden"
          ? 403
          : 500;
    return NextResponse.json({ error: result.error.message }, { status });
  }

  const { created, ...payload } = result.data;
  return NextResponse.json(payload, { status: created ? 201 : 200 });
}
