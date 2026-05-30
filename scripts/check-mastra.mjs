#!/usr/bin/env node
/**
 * MASTRA-005 — lightweight Mastra PR gate for mdeapp.
 * Usage: npm run check:mastra
 * Strict storage (post MASTRA-003 prod): MASTRA_REQUIRE_PG=1 npm run check:mastra
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const COPILOTKIT_PIN = "1.55.2";
const DEPRECATED_GEMINI = [
  "gemini-2.0",
  "gemini-2.5",
  "gemini-3-flash-preview",
];

const failures = [];
const warnings = [];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, acc);
    else if (/\.(tsx?|jsx?|mjs)$/.test(ent.name)) acc.push(full);
  }
  return acc;
}

function relFromRoot(abs) {
  return path.relative(ROOT, abs).replaceAll("\\", "/");
}

function isClientComponent(filePath, content) {
  return content.startsWith('"use client"') || content.startsWith("'use client'");
}

/** 1 — useCoAgent names ⊆ Mastra agent keys */
function checkAgentNames() {
  const mastraIndex = read("src/mastra/index.ts");
  const agentKeys = [...mastraIndex.matchAll(/^\s{4}(\w+),$/gm)].map((m) => m[1]);
  const keySet = new Set(agentKeys);

  const uiFiles = walk(path.join(SRC, "app")).concat(walk(path.join(SRC, "components")));
  const coAgentNames = new Set();

  for (const file of uiFiles) {
    const content = fs.readFileSync(file, "utf8");
    for (const m of content.matchAll(/useCoAgent(?:<[^>]+>)?\(\{\s*name:\s*["']([^"']+)["']/g)) {
      coAgentNames.add(m[1]);
    }
  }

  for (const name of coAgentNames) {
    if (!keySet.has(name)) {
      failures.push(
        `useCoAgent name "${name}" has no matching Mastra agents key (registered: ${[...keySet].join(", ")})`,
      );
    }
  }
}

/** 2 — CopilotKit pin + no v2 imports in app/components */
function checkCopilotKitPin() {
  const pkg = JSON.parse(read("package.json"));
  for (const [dep, ver] of Object.entries(pkg.dependencies ?? {})) {
    if (dep.startsWith("@copilotkit/") && ver !== COPILOTKIT_PIN) {
      failures.push(`${dep} pinned ${ver}, expected ${COPILOTKIT_PIN}`);
    }
  }

  const scanRoots = [path.join(SRC, "app"), path.join(SRC, "components")];
  for (const root of scanRoots) {
    if (!fs.existsSync(root)) continue;
    for (const file of walk(root)) {
      const content = fs.readFileSync(file, "utf8");
      if (content.includes("@copilotkit/react-core/v2")) {
        failures.push(`${relFromRoot(file)} imports @copilotkit/react-core/v2 (Phase 1 = v1 only)`);
      }
    }
  }
}

/** 3 — deprecated Gemini models in agents */
function checkGeminiModels() {
  const agentsDir = path.join(SRC, "mastra", "agents");
  for (const file of walk(agentsDir)) {
    const content = fs.readFileSync(file, "utf8");
    for (const bad of DEPRECATED_GEMINI) {
      if (content.includes(bad)) {
        failures.push(`${relFromRoot(file)} references deprecated model id "${bad}"`);
      }
    }
  }
}

/** 4 — service role in client app/components only */
function checkServiceRoleLeaks() {
  const scanRoots = [path.join(SRC, "app"), path.join(SRC, "components")];
  for (const root of scanRoots) {
    if (!fs.existsSync(root)) continue;
    for (const file of walk(root)) {
      const content = fs.readFileSync(file, "utf8");
      if (!isClientComponent(file, content)) continue;
      if (
        /SUPABASE_SERVICE_ROLE|service_role|createServiceRoleClient/i.test(content)
      ) {
        failures.push(`${relFromRoot(file)} client component references service-role Supabase`);
      }
    }
  }
}

/** 5 — Pattern 1 bridge in copilotkit route */
function checkCopilotRoute() {
  const route = read("src/app/api/copilotkit/[[...path]]/route.ts");
  if (!route.includes("getLocalAgentsWithLogging")) {
    failures.push(
      "api/copilotkit/[[...path]]/route.ts must use getLocalAgentsWithLogging",
    );
  }
}

/** 6 — catalog tools must not use DATABASE_URL (RLS bypass) */
function checkCatalogToolsRls() {
  const toolsDir = path.join(SRC, "mastra", "tools");
  for (const file of walk(toolsDir)) {
    if (!file.endsWith(".ts") || file.includes("__tests__")) continue;
    const content = fs.readFileSync(file, "utf8");
    if (/from\s+['"]pg['"]|new\s+Pool\(|connectionString:\s*process\.env\.DATABASE_URL/.test(content)) {
      failures.push(
        `${relFromRoot(file)} uses pg/DATABASE_URL — use anon Supabase JS (RLS) for catalog reads`,
      );
    }
    if (/SUPABASE_SERVICE_ROLE_KEY/.test(content)) {
      failures.push(
        `${relFromRoot(file)} references SUPABASE_SERVICE_ROLE_KEY — catalog tools must use SUPABASE_ANON_KEY only`,
      );
    }
  }
}

/** 7 — ephemeral LibSQL storage (optional strict) */
function checkStorage() {
  const storage = read("src/mastra/lib/storage.ts");
  const hasMemory = storage.includes(":memory:");
  if (process.env.MASTRA_REQUIRE_PG === "1" && hasMemory) {
    failures.push(
      "MASTRA_REQUIRE_PG=1 but storage.ts still allows LibSQL :memory: — set DATABASE_URL for Postgres",
    );
  } else if (hasMemory) {
    warnings.push(
      "storage.ts allows :memory: LibSQL (local dev OK; set MASTRA_REQUIRE_PG=1 on prod CI after MASTRA-003)",
    );
  }
}

checkAgentNames();
checkCopilotKitPin();
checkGeminiModels();
checkServiceRoleLeaks();
checkCopilotRoute();
checkCatalogToolsRls();
checkStorage();

console.log("check:mastra — mdeapp Mastra PR gate\n");
for (const w of warnings) console.log("WARN", w);
for (const f of failures) console.error("FAIL", f);

if (failures.length) {
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}

console.log("\nOK — all Mastra gate checks passed");
process.exit(0);
