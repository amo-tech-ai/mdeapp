import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isListingWorkflowStatus } from "@/lib/rentals/listing-workflow";
import { runPublishRpc } from "@/lib/rentals/run-publish-rpc";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { apartmentId?: string; listingWorkflowStatus?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const apartmentId = body.apartmentId?.trim();
  if (!apartmentId) {
    return NextResponse.json({ error: "apartmentId is required" }, { status: 400 });
  }

  if (!isListingWorkflowStatus(body.listingWorkflowStatus)) {
    return NextResponse.json({ error: "Invalid listingWorkflowStatus" }, { status: 400 });
  }

  const result = await runPublishRpc(supabase, apartmentId, body.listingWorkflowStatus);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json({ transition: result.transition });
}
