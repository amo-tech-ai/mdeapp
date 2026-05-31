import { NextResponse } from "next/server";
import { z } from "zod";
import { searchRentals } from "@/mastra/tools/search-rentals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  neighborhood: z.string().optional(),
  minBedrooms: z.number().int().min(0).optional(),
  maxPricePerNight: z.number().positive().optional(),
  limit: z.number().int().min(1).max(20).optional().default(8),
  queryText: z.string().optional(),
});

/** Fast path — rental search without conciergeAgent round-trip. */
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

  const { neighborhood, minBedrooms, maxPricePerNight, limit, queryText } = parsed.data;
  try {
    const { results, total, source, hybridUsed, rankExplanation } = await searchRentals({
      neighborhood,
      minBedrooms,
      maxPricePerNight,
      limit,
      queryText,
    });
    return NextResponse.json({ results, total, source, hybridUsed, rankExplanation });
  } catch (error) {
    console.error("[api/rentals/search]", error);
    return NextResponse.json(
      {
        error: "rental_search_failed",
        message: "Unable to search rentals right now.",
      },
      { status: 500 },
    );
  }
}
