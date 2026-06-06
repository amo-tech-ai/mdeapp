import { NextResponse } from "next/server";
import { z } from "zod";
import { searchGroundedPlacesTool } from "@/mastra/tools/search-grounded-places";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  query: z.string().min(1),
  neighborhood: z.string().optional(),
  limit: z.number().int().min(1).max(10).optional().default(5),
  intent: z.enum(["cafe", "nightlife", "general"]).optional(),
});

/** Fast path — grounded café search without relying on conciergeAgent tool calls. */
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

  const { query, neighborhood, limit, intent } = parsed.data;
  const searchQuery = neighborhood
    ? `${query.trim()} near ${neighborhood}`
    : query.trim();

  try {
    const out = await searchGroundedPlacesTool.execute!(
      {
        query: searchQuery,
        pageSize: limit,
        ...(intent ? { intent } : {}),
      },
      {} as never,
    );
    const results = (out as { results?: unknown[] }).results ?? [];
    if (results.length === 0) {
      console.warn("[api/grounded/search] empty results", {
        query: searchQuery.slice(0, 80),
        metadata: (out as { metadata?: unknown }).metadata,
      });
    }
    return NextResponse.json(out);
  } catch (err) {
    console.error("[api/grounded/search]", err);
    return NextResponse.json(
      { error: "grounded search failed" },
      { status: 500 },
    );
  }
}
