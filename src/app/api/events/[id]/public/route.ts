import { NextResponse } from "next/server";
import { getPublicEvent } from "@/lib/events/get-public-event";

type RouteContext = { params: Promise<{ id: string }> };

/** Public event detail for chat sheet checkout — same shape as /events/[slug] page. */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const event = await getPublicEvent(id);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  return NextResponse.json({ event });
}
