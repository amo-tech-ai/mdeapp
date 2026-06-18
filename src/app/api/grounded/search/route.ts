import { NextResponse } from "next/server";
import { z } from "zod";
import { checkSearchFastPathRateLimit } from "@/lib/api-ip-rate-limit";
import { searchGroundedPlacesTool } from "@/mastra/tools/search-grounded-places";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

const bodySchema = z.object({
  query: z.string().min(1),
  neighborhood: z.string().optional(),
  limit: z.number().int().min(1).max(10).optional().default(5),
  intent: z.enum(["cafe", "nightlife", "general"]).optional(),
});

/** Fast path — grounded café search without relying on conciergeAgent tool calls. */
// skipcq: JS-0067, JS-R1005 - route handler; intentional validation branching, not a bug
export async function POST(req: Request) {
  const rateLimited = checkSearchFastPathRateLimit(req);
  if (rateLimited) return rateLimited;

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
    const execute = searchGroundedPlacesTool.execute;
    if (!execute) {
      return NextResponse.json(
        { error: "grounded search unavailable" },
        { status: 500 },
      );
    }
    const out = await execute(
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
