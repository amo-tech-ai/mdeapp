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

  const { category, neighborhood, dateWindow, limit } = parsed.data;
  const { results, total, source } = await searchEvents({
    category,
    neighborhood,
    dateWindow,
    limit,
  });

  return NextResponse.json({ results, total, source });
}
