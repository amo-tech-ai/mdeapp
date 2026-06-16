/**
 * COST-001 — end-to-end token + cost verification.
 *
 * Runs ONE real conciergeAgent turn through the exact production seam
 * (getLocalAgentsWithLogging → LoggingMastraAgent.run → wrapped Gemini model →
 * AsyncLocalStorage token sink → turn telemetry). Proves the ALS context
 * survives the AG-UI async subscribe and that real Gemini usage is captured.
 *
 * It injects a persistTurnLog spy that BOTH (a) captures the telemetry for an
 * immediate in-script assertion and (b) forwards to the real logger so a row
 * lands in public.ai_runs with a unique runId you can query afterwards.
 *
 * Run: infisical run --silent --env=dev --path=/ -- npx tsx scripts/verify-cost-tracking.mjs
 */
import { lastValueFrom } from "rxjs";
import { tap } from "rxjs/operators";
import { getLocalAgentsWithLogging } from "../src/mastra/copilotkit/logging-mastra-agent.ts";
import { logAgentRunForTurn } from "../src/mastra/lib/log-agent-run.ts";
import { calculateModelCost } from "../src/mastra/lib/model-cost.ts";
import { mastra } from "../src/mastra/index.ts";

async function main() {
  const stamp = Date.now();
  const runId = `cost-verify-${stamp}`;
  const threadId = `cost-verify-thread-${stamp}`;
  const captured = [];

  const agents = getLocalAgentsWithLogging({
    mastra,
    resourceId: "cost-verify",
    persistTurnLog: (opts) => {
      captured.push(opts);
      // Forward to the real logger so a verifiable ai_runs row is written.
      void logAgentRunForTurn(opts);
    },
  });

  const agent = agents.conciergeAgent;
  const input = {
    threadId,
    runId,
    messages: [
      { id: "1", role: "user", content: "Say hello in one short sentence." },
    ],
    tools: [],
    context: [],
    state: {},
  };

  const eventTypes = [];
  await lastValueFrom(agent.run(input).pipe(tap((e) => eventTypes.push(e.type))));

  if (captured.length === 0) {
    console.error("FAIL: persistTurnLog was never called — finalize() did not run.");
    process.exit(1);
  }

  const t = captured[0];
  const input_tokens = t.input_tokens ?? 0;
  const output_tokens = t.output_tokens ?? 0;
  const total = input_tokens + output_tokens;
  const cost = calculateModelCost({
    modelName: t.modelName,
    inputTokens: input_tokens,
    outputTokens: output_tokens,
  });

  console.log("--- COST-001 end-to-end verification ---");
  console.log("events            :", eventTypes.join(","));
  console.log("runId             :", runId);
  console.log("status            :", t.status);
  console.log("model             :", t.modelName);
  console.log("input_tokens      :", input_tokens);
  console.log("output_tokens     :", output_tokens);
  console.log("total_tokens      :", total);
  console.log("estimatedCostUsd  :", t.estimatedCostUsd);
  console.log("recomputed cost   :", cost.estimatedCostUsd, cost.rateFallback ? "(FALLBACK RATE)" : "");

  if (total <= 0) {
    console.error("\nFAIL: total_tokens is 0 — ALS sink did not capture model usage.");
    process.exit(1);
  }
  if (!(t.estimatedCostUsd > 0)) {
    console.error("\nFAIL: estimatedCostUsd is not > 0.");
    process.exit(1);
  }
  console.log(`\nPASS: tokens + cost captured. Query ai_runs for run_id='${runId}' to confirm the row.`);
}

main().catch((e) => {
  console.error("RUN FAILED", e?.stack || e?.message || e);
  process.exit(1);
});
