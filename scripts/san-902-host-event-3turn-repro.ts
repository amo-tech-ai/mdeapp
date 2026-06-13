#!/usr/bin/env npx tsx
/**
 * SAN-902 · CK-V2-007b — Minimal 3-turn hostEventAgent repro (no browser).
 *
 * Documents turn1/turn2/turn3 behavior after SAN-903 workspace opt-out.
 * Writes JSON evidence under docs/tasks/testing/evidence/SAN-902/.
 *
 * Run:
 *   infisical run --silent --env=dev --path=/ -- npm run repro:san-902
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { mastra } from "../src/mastra/index";

const TURNS = [
  "Startup mixer March 15 in Provenza, 200 cap, GA free + VIP 50000 COP",
  "Set venue to Rooftop Provenza capacity 200",
  "Add a short description: evening networking for Medellín founders and investors",
] as const;

const WORKSPACE_TOOL_RE = /mastra_workspace/i;
const SIGNATURE_RE = /thought_signature|missing a thought_signature/i;
const INCOMPLETE_RE = /INCOMPLETE_STREAM/i;

function commitSha(): string {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function shortSha(sha: string): string {
  return sha.length >= 7 ? sha.slice(0, 7) : sha;
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

function classifyError(message: string): string {
  if (SIGNATURE_RE.test(message)) return "thought_signature";
  if (INCOMPLETE_RE.test(message)) return "INCOMPLETE_STREAM";
  if (/AGENT_STREAM_ERROR/i.test(message)) return "AGENT_STREAM_ERROR";
  return "other";
}

type TurnResult = {
  turn: number;
  prompt: string;
  ok: boolean;
  toolNames: string[];
  hasWorkspaceTools: boolean;
  textLength: number;
  error: string | null;
  errorClass: string | null;
  hasThoughtSignature: boolean;
};

async function runTurn(
  agent: ReturnType<typeof mastra.getAgent>,
  turn: number,
  prompt: string,
  threadId: string,
): Promise<TurnResult> {
  const base: TurnResult = {
    turn,
    prompt,
    ok: false,
    toolNames: [],
    hasWorkspaceTools: false,
    textLength: 0,
    error: null,
    errorClass: null,
    hasThoughtSignature: false,
  };

  try {
    const result = await agent.generate(prompt, {
      threadId,
      resourceId: "san-902-repro",
    });
    const toolNames =
      result.toolCalls?.map((t) => t.toolName).filter(Boolean) ?? [];
    base.toolNames = toolNames;
    base.hasWorkspaceTools = toolNames.some((n) => WORKSPACE_TOOL_RE.test(n));
    base.textLength = result.text?.length ?? 0;
    base.ok = true;
    return base;
  } catch (err) {
    const message = errorMessage(err);
    base.error = message;
    base.errorClass = classifyError(message);
    base.hasThoughtSignature = SIGNATURE_RE.test(message);
    return base;
  }
}

async function main() {
  const agent = mastra.getAgent("hostEventAgent");
  const threadId = `san-902-${Date.now()}`;
  const sha = commitSha();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");

  const turns: TurnResult[] = [];
  for (let i = 0; i < TURNS.length; i++) {
    const turn = await runTurn(agent, i + 1, TURNS[i], threadId);
    turns.push(turn);
    console.log(
      `turn${turn.turn}`,
      turn.ok ? "ok" : "fail",
      turn.ok
        ? { tools: turn.toolNames, textLen: turn.textLength }
        : { errorClass: turn.errorClass, snippet: turn.error?.slice(0, 120) },
    );
  }

  const summary = {
    turn1NoWorkspaceTools: turns[0]?.hasWorkspaceTools === false,
    turn2NoThoughtSignature:
      turns[1]?.ok === true && turns[1]?.hasThoughtSignature === false,
    turn3ReproducibleStreamError:
      turns[2]?.errorClass === "AGENT_STREAM_ERROR" ||
      turns[2]?.errorClass === "thought_signature" ||
      turns[2]?.errorClass === "INCOMPLETE_STREAM",
    anyThoughtSignature: turns.some((t) => t.hasThoughtSignature),
  };

  const evidence = {
    task: "SAN-902 · CK-V2-007b",
    parent: "SAN-895 · CK-V2-007",
    commitSha: sha,
    commitShort: shortSha(sha),
    threadId,
    ranAt: new Date().toISOString(),
    turns,
    summary,
    pass: summary.turn1NoWorkspaceTools && summary.turn2NoThoughtSignature,
  };

  const outDir = resolve(
    process.cwd(),
    "docs/tasks/testing/evidence/SAN-902",
  );
  mkdirSync(outDir, { recursive: true });
  const outFile = resolve(
    outDir,
    `SAN-902-3turn-repro-${shortSha(sha)}-${stamp}.json`,
  );
  writeFileSync(outFile, JSON.stringify(evidence, null, 2));

  console.log("\nSAN-902 summary:", summary);
  console.log("Evidence:", outFile);

  if (!evidence.pass) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
