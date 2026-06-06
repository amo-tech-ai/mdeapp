import { NextResponse } from "next/server";
import { z } from "zod";
import { listPublishedEvents } from "@/lib/events/list-published-events";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const querySchema = z.object({
  category: z.enum(["music", "food", "culture", "sport", "nightlife"]).optional(),
  neighborhood: z.string().min(1).optional(),
  dateWindow: z
    .enum(["tonight", "this_weekend", "this_week", "next_week", "any"])
    .optional()
    .default("any"),
  price: z.enum(["free", "paid"]).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(24),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

/** DATA-036 — public published-events catalog for `/events` browse (SAN-518). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    category: url.searchParams.get("category") ?? undefined,
    neighborhood: url.searchParams.get("neighborhood") ?? undefined,
    dateWindow: url.searchParams.get("dateWindow") ?? undefined,
    price: url.searchParams.get("price") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    offset: url.searchParams.get("offset") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid query", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { results, total, limit, offset, error } = await listPublishedEvents(
    supabase,
    parsed.data,
  );

  if (error) {
    return NextResponse.json({ error, results: [], total: 0, limit, offset }, {
      status: 500,
    });
  }

  return NextResponse.json({ results, total, limit, offset });
}
