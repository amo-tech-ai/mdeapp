#!/usr/bin/env node
/**
 * CK-V2-012 · SAN-910 · Migration CI guardrails (audit dashboard + no-new-v1 gate) —
 * synthetic violation proof for no-new-v1 guardrail.
 * Pass: main allowlist scan succeeds · synthetic file fails.
 */
import { spawnSync } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SYNTHETIC_REL = "src/__fixtures__/ck-v2-synthetic-violation.tsx";
const SYNTHETIC_ABS = join(ROOT, SYNTHETIC_REL);

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", ...opts });
  return { status: r.status ?? 1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

const main = run("node", ["scripts/audit-copilotkit-v2-no-new-v1.mjs"]);
if (main.status !== 0) {
  console.error("FAIL: main allowlist scan should pass");
  console.error(main.stderr || main.stdout);
  process.exit(1);
}
console.log("✓ main allowlist scan passes");

await mkdir(join(ROOT, "src/__fixtures__"), { recursive: true });
await writeFile(
  SYNTHETIC_ABS,
  `import { useCoAgent } from "@copilotkit/react-core";\nexport const Bad = () => { useCoAgent({ name: "x" }); };\n`,
);

const violation = run("node", ["scripts/audit-copilotkit-v2-no-new-v1.mjs"]);
await rm(SYNTHETIC_ABS, { force: true });

if (violation.status === 0) {
  console.error("FAIL: synthetic v1 import should be rejected");
  console.error(violation.stdout || violation.stderr);
  process.exit(1);
}
console.log("✓ synthetic v1 violation correctly rejected");

const depcruise = run("npx", ["depcruise", "--config", ".dependency-cruiser.cjs", "src"], {
  env: { ...process.env, FORCE_COLOR: "0" },
});
if (depcruise.status !== 0) {
  console.error("FAIL: dependency-cruiser should pass on main src/");
  console.error(depcruise.stderr || depcruise.stdout);
  process.exit(1);
}
console.log("✓ dependency-cruiser passes on main src/");

console.log("\nSAN-910 depcruise proof: ALL PASS");
