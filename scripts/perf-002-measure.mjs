/**
 * PERF-002 — in-process conciergeAgent latency measurement.
 *
 * Times the agent turn through the SAME seam that writes production ai_runs
 * (LoggingMastraAgent.run subscribe → finalize → durationMs), so numbers are
 * directly comparable to the prod baseline (ai_runs.duration_ms).
 *
 * Controlled A/B of the dominant fix (the LLM PromptInjectionDetector):
 *   baseline:  MASTRA_PROMPT_INJECTION_GUARD=true  (detector ON  = old behavior)
 *   after:     (unset)                             (detector OFF = new behavior)
 * The injection detector is wired at agent-construction (module load), so the env
 * var must be set BEFORE this process imports the agent — i.e. per separate run.
 *
 * Does NOT forward to logAgentRunForTurn (no ai_runs pollution) — measure only.
 *
 * Run: infisical run --silent --env=dev --path=/ -- npx tsx scripts/perf-002-measure.mjs
 */
import { lastValueFrom } from "rxjs";
import { getLocalAgentsWithLogging } from "../src/mastra/copilotkit/logging-mastra-agent.ts";
import { mastra } from "../src/mastra/index.ts";

const PROMPT =
  "What neighborhoods do you recommend for a first-time visitor to Medellín?";
const ITERATIONS = 3;
const guardOn = process.env.MASTRA_PROMPT_INJECTION_GUARD === "true";

function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

async function main() {
  const samples = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const captured = [];
    const agents = getLocalAgentsWithLogging({
      mastra,
      resourceId: "perf-002",
      persistTurnLog: (opts) => captured.push(opts), // measure only, no DB write
    });
    const stamp = Date.now();
    const wallStart = stamp;
    await lastValueFrom(
      agents.conciergeAgent.run({
        threadId: `perf-002-${stamp}-${i}`,
        runId: `perf-002-${stamp}-${i}`,
        messages: [{ id: "1", role: "user", content: PROMPT }],
        tools: [],
        context: [],
        state: {},
      }),
    );
    const wallMs = Date.now() - wallStart;
    const t = captured[0] ?? {};
    samples.push({
      iter: i,
      durationMs: t.durationMs ?? wallMs,
      tool_count: t.metadata?.tool_count ?? 0,
      input_tokens: t.input_tokens ?? 0,
      output_tokens: t.output_tokens ?? 0,
      status: t.status,
    });
    process.stderr.write(
      `  iter ${i}: ${(samples[i].durationMs / 1000).toFixed(1)}s (tools=${samples[i].tool_count}, status=${samples[i].status})\n`,
    );
  }
  const durations = samples.map((s) => s.durationMs);
  const out = {
    condition: guardOn ? "injection_guard_ON (baseline)" : "injection_guard_OFF (after)",
    prompt: PROMPT,
    iterations: ITERATIONS,
    median_ms: median(durations),
    median_s: +(median(durations) / 1000).toFixed(1),
    min_s: +(Math.min(...durations) / 1000).toFixed(1),
    max_s: +(Math.max(...durations) / 1000).toFixed(1),
    samples,
  };
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error("MEASURE FAILED", e?.stack || e?.message || e);
  process.exit(1);
});
