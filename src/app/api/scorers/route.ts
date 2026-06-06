import { NextResponse } from "next/server";
import type { MastraScorer } from "@mastra/core/evals";
import { mastra } from "@/mastra";

/**
 * GET /api/scorers — lists the AI-quality scorers registered on the Mastra
 * instance (AGT-00A faithfulness, and future AGT-00B grounding-coverage).
 *
 * Before SAN-590 this route 404'd and nothing measured whether replies were
 * grounded. It now reports each scorer's id/name/description so ops (Patricia)
 * and CI can confirm the hallucination scorer is wired in production.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const registered = (mastra.listScorers() ?? {}) as Record<string, MastraScorer>;
  const scorers = Object.entries(registered).map(([key, scorer]) => ({
    key,
    id: scorer.id,
    name: scorer.name,
    description: scorer.description,
  }));
  return NextResponse.json({ count: scorers.length, scorers });
}
