import { NextResponse } from "next/server";
import { z } from "zod";
import { searchEvents } from "@/mastra/tools/search-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  category: z.enum(["music", "food", "culture", "sport", "nightlife"]).optional(),
  neighborhood: z.string().optional(),
  dateWindow: z
    .enum(["tonight", "this_weekend", "this_week", "next_week", "any"])
    .optional()
    .default("any"),
  limit: z.number().int().min(1).max(20).optional().default(10),
  queryText: z.string().optional(),
});

/** Fast path — Supabase event search without conciergeAgent (EVP-006 perf). */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { category, neighborhood, dateWindow, limit, queryText } = parsed.data;
  try {
    const { results, total, source, hybridUsed, rankExplanation } = await searchEvents({
      category,
      neighborhood,
      dateWindow,
      limit,
      queryText,
    });
    return NextResponse.json({ results, total, source, hybridUsed, rankExplanation });
  } catch (error) {
    console.error("[api/events/search]", error);
    return NextResponse.json(
      {
        error: "event_search_failed",
        message: "Unable to search events right now.",
      },
      { status: 500 },
    );
  }
}
