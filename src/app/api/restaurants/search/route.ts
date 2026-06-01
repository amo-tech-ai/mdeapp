import { NextResponse } from "next/server";
import { z } from "zod";
import { searchRestaurants } from "@/mastra/tools/search-restaurants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  neighborhood: z.string().optional(),
  cuisine: z
    .enum([
      "colombian",
      "paisa",
      "seafood",
      "steakhouse",
      "vegetarian",
      "cafe",
      "international",
      "street-food",
    ])
    .optional(),
  queryText: z.string().optional(),
  limit: z.number().int().min(1).max(20).optional().default(5),
});

/** Fast path — Supabase restaurant search without conciergeAgent. */
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

  const { neighborhood, cuisine, queryText, limit } = parsed.data;
  const { results, total, source } = await searchRestaurants({
    neighborhood,
    cuisine,
    queryText,
    limit,
  });

  return NextResponse.json({ results, total, source });
}
