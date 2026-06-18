#!/usr/bin/env node
/**
 * CK-V2-012 · SAN-910 · Migration CI guardrails (audit dashboard + no-new-v1 gate) —
 * fail new v1 CopilotKit hook/import usage outside allowlist.
 * Exempt: copilotkit-v2-allowlist.json · *-v1.tsx rollback twins · __tests__ · e2e/
 */
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const ALLOWLIST_PATH = join(ROOT, "scripts/copilotkit-v2-allowlist.json");

const FORBIDDEN = [
  { id: "useCoAgent", re: /\buseCoAgent\b/ },
  { id: "useCopilotAction", re: /\buseCopilotAction\b/ },
  { id: "renderAndWaitForResponse", re: /\brenderAndWaitForResponse\b/ },
  { id: "@copilotkit/react-ui", re: /@copilotkit\/react-ui/ },
  { id: "@copilotkit/react-core-v1", re: /@copilotkit\/react-core(?!\/v2)/ },
];

function isExemptPath(rel) {
  if (rel.includes("/__tests__///")) return true;
  if (/\.(test|spec)\.[jt]sx?$/.test(rel)) return true;
  if (/-v1\.tsx$/.test(rel)) return true;
  return false;
}

async function walk(dir, acc = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules") continue;
      await walk(p, acc);
    } else if (/\.(tsx?|jsx?)$/.test(ent.name)) {
      acc.push(p);
    }
  }
  return acc;
}

async function loadAllowlist() {
  const raw = await readFile(ALLOWLIST_PATH, "utf8");
  const data = JSON.parse(raw);
  return new Set(data.files);
}

async function scanForAllowlist() {
  const files = await walk(SRC);
  const offenders = [];
  for (const abs of files) {
    const rel = relative(ROOT, abs).replace(/\\/g, "/");
    if (isExemptPath(rel)) continue;
    const text = await readFile(abs, "utf8");
    const hits = FORBIDDEN.filter(({ re }) => re.test(text)).map((f) => f.id);
    if (hits.length) offenders.push(rel);
  }
  return offenders.sort();
}

async function writeAllowlistFromDisk() {
  const offenders = await scanForAllowlist();
  const payload = {
    description:
      "CK-V2-012 · SAN-910 · Migration CI guardrails (audit dashboard + no-new-v1 gate) — files allowed to use v1 CopilotKit hooks/imports until migrated. Regenerate via: node scripts/audit-copilotkit-v2-no-new-v1.mjs --write-allowlist",
    mainSha: process.env.MAIN_SHA ?? "fbcf8d3",
    files: offenders,
  };
  await writeFile(ALLOWLIST_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${offenders.length} paths to ${relative(ROOT, ALLOWLIST_PATH)}`);
}

async function audit(extraPaths = []) {
  const allowlist = await loadAllowlist();
  const files = [...(await walk(SRC)), ...extraPaths.map((p) => join(ROOT, p))];
  const violations = [];

  for (const abs of files) {
    const rel = relative(ROOT, abs).replace(/\\/g, "/");
    if (!rel.startsWith("src/") && !extraPaths.includes(rel)) continue;
    if (isExemptPath(rel)) continue;
    if (allowlist.has(rel)) continue;

    const text = await readFile(abs, "utf8");
    const hits = FORBIDDEN.filter(({ re }) => re.test(text)).map((f) => f.id);
    if (hits.length) violations.push({ file: rel, hits });
  }

  if (violations.length) {
    console.error("# CK-V2 no-new-v1 violations\n");
    for (const v of violations) {
      console.error(`- ${v.file}: ${v.hits.join(", ")}`);
    }
    console.error(
      `\n${violations.length} file(s) use v1 CopilotKit outside the allowlist. Add to scripts/copilotkit-v2-allowlist.json only when migrating an existing file — never for net-new v1 debt.`,
    );
    process.exit(1);
  }

  console.log(
    `CK-V2 no-new-v1: OK — ${allowlist.size} allowlisted · exempt *-v1.tsx + __tests__`,
  );
}

if (process.argv.includes("--write-allowlist")) {
  await writeAllowlistFromDisk();
} else {
  const extra = process.argv
    .filter((a) => a.startsWith("--file="))
    .map((a) => a.slice("--file=".length));
  await audit(extra);
}
