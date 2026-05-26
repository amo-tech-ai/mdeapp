import { NextResponse } from "next/server";
import {
  attachWebGroundingForEventSearch,
  shouldChainWebGrounding,
} from "@/mastra/lib/attach-web-grounding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Body = {
  category?: string;
  neighborhood?: string;
  dateWindow?: "tonight" | "this_weekend" | "this_week" | "next_week" | "any";
  sqlEventCount?: number;
};

export async function POST(req: Request) {
  if (process.env.ENABLE_SEARCH_GROUNDING?.trim() !== "1") {
    return NextResponse.json(
      { webGrounding: { citations: [], metadata: { reason: "disabled" } } },
      { status: 200 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const input = {
    category: body.category,
    neighborhood: body.neighborhood,
    dateWindow: body.dateWindow ?? "any",
  };

  if (!shouldChainWebGrounding(input, body.sqlEventCount ?? 0)) {
    return NextResponse.json({ webGrounding: { citations: [] } });
  }

  const webGrounding = await attachWebGroundingForEventSearch(
    input,
    body.sqlEventCount ?? 0,
  );

  return NextResponse.json({ webGrounding: webGrounding ?? { citations: [] } });
}
