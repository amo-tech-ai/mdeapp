import { NextResponse } from "next/server";
import { z } from "zod";
import { prepareRestaurantSearchResults } from "@/lib/restaurant-place-photo";
import { searchRestaurants } from "@/mastra/tools/search-restaurants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z
  .object({
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
        "italian",
        "pizza",
        "street-food",
      ])
      .optional(),
    queryText: z.string().optional(),
    priceTier: z.enum(["$", "$$", "$$$", "$$$$"]).optional(),
    userLatitude: z.number().optional(),
    userLongitude: z.number().optional(),
    limit: z.number().int().min(1).max(20).optional().default(5),
  })
  .refine(
    (data) =>
      (data.userLatitude == null) === (data.userLongitude == null),
    {
      message: "userLatitude and userLongitude must be provided together",
      path: ["userLatitude"],
    },
  );

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

  const { neighborhood, cuisine, queryText, priceTier, userLatitude, userLongitude, limit } =
    parsed.data;
  const { results, total, source } = await searchRestaurants({
    neighborhood,
    cuisine,
    queryText,
    priceTier,
    userLatitude,
    userLongitude,
    limit,
  });

  const enriched = await prepareRestaurantSearchResults(results);

  return NextResponse.json({ results: enriched, total, source });
}
