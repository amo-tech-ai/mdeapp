/**
 * SAN-883 · DEV-SEC — dist-leak-scan publishable Maps key allowlist.
 *
 * Spawns the real hook (.claude/hooks/dist-leak-scan.mjs) as a subprocess against
 * synthetic fixture bundles. NO real key is ever planted — the "approved" key is a
 * made-up AIzaSy-shaped string whose SHA-256 is written into a temp allowlist file
 * the hook reads via DIST_LEAK_SCAN_ALLOWLIST_FILE. Scan roots are redirected to a
 * temp dir via DIST_LEAK_SCAN_ROOTS, so the test never touches the real `.next`.
 *
 * All secret-shaped fixtures are built by concatenation so no literal secret
 * pattern lives in this source file (the repo's scan-secrets hook would block it).
 *
 * Exit 0 = allowed (deploy proceeds) · Exit 2 = blocked (leak suspected).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";

const HOOK = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../.claude/hooks/dist-leak-scan.mjs",
);

// Synthetic AIzaSy-shaped keys (39 chars) — built by concatenation, NOT real.
const mk = (tag: string) => ("AIzaSy" + tag.padEnd(33, "0")).slice(0, 39);
const APPROVED_MAPS_KEY = mk("MapsApproved");
const FAKE_MAPS_KEY = mk("FakeRogueKey");
const GEMINI_AIZA_KEY = mk("GeminiPrivate"); // legacy Gemini keys are AIzaSy-shaped
const GEMINI_AQ_KEY = "AQ.A" + "B".repeat(48); // new-format Google/Gemini key (AQ.A…)
const ARBITRARY_GOOGLE_KEY = mk("ArbitraryGoogl");
const MAP_ID = "8f1b2c3d4e5f6a7b"; // Map IDs are not key-shaped, not secret

// Other secret classes — concatenated so no literal pattern sits in source.
const STRIPE_LIVE = "sk_" + "live_" + "ABCDEFGHIJKLMNOPQRSTUVWX";
const SERVICE_ROLE_LINE =
  "SUPABASE_SERVICE_ROLE_KEY=" + "eyJhbGciOiJIUzI1NiJ9.body.sig";
const GEMINI_NAME_LINE =
  "GOOGLE_GENERATIVE_AI_API_KEY=" + '"' + "private-value-123" + '"';

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

let work: string;

beforeEach(() => {
  work = mkdtempSync(join(tmpdir(), "dls-"));
});
afterEach(() => {
  rmSync(work, { recursive: true, force: true });
});

/** Write a file inside a fresh `.next` tree and run the hook against it. */
function runHook(
  relPath: string,
  contents: string,
  opts: { command?: string; allow?: string[] } = {},
): number {
  const nextDir = join(work, ".next");
  const file = join(nextDir, relPath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents);

  const allowFile = join(work, "allowlist.json");
  writeFileSync(
    allowFile,
    JSON.stringify({
      publishableMapsKeySha256: opts.allow ?? [sha256(APPROVED_MAPS_KEY)],
    }),
  );

  const res = spawnSync("node", [HOOK], {
    input: JSON.stringify({
      tool_input: { command: opts.command ?? "git push origin main" },
    }),
    env: {
      ...process.env,
      DIST_LEAK_SCAN_ROOTS: nextDir,
      DIST_LEAK_SCAN_ALLOWLIST_FILE: allowFile,
      // Neutralise any real Infisical-injected Maps key in the test env.
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: "",
      VITE_GOOGLE_MAPS_API_KEY: "",
    },
    encoding: "utf8",
  });
  return res.status ?? -1;
}

const ALLOW = 0;
const BLOCK = 2;

describe("dist-leak-scan — directory scoping", () => {
  it(".next/dev is SKIPPED — a rogue key there does not block (still works)", () => {
    expect(runHook("dev/chunk.js", `const k="${FAKE_MAPS_KEY}"`)).toBe(ALLOW);
  });

  it(".next/static is SCANNED — rogue key blocks", () => {
    expect(runHook("static/chunk.js", `const k="${FAKE_MAPS_KEY}"`)).toBe(BLOCK);
  });

  it(".next/server is SCANNED — rogue key blocks", () => {
    expect(runHook("server/chunk.js", `const k="${FAKE_MAPS_KEY}"`)).toBe(BLOCK);
  });

  it("non-deploy command is ignored even with a real-looking leak", () => {
    expect(
      runHook("static/chunk.js", `const k="${FAKE_MAPS_KEY}"`, { command: "ls -la" }),
    ).toBe(ALLOW);
  });
});

describe("dist-leak-scan — publishable Maps key allowlist (by value hash)", () => {
  it("approved publishable Maps key PASSES in a scanned prod artifact", () => {
    expect(runHook("static/maps.js", `const k="${APPROVED_MAPS_KEY}"`)).toBe(ALLOW);
  });

  it("Map ID PASSES — not key-shaped, never a false positive", () => {
    expect(
      runHook("static/mapid.js", `const id="${MAP_ID}";const k="${APPROVED_MAPS_KEY}"`),
    ).toBe(ALLOW);
  });

  it("fake/rotated Maps key (not in allowlist) BLOCKS", () => {
    expect(runHook("static/maps.js", `const k="${FAKE_MAPS_KEY}"`)).toBe(BLOCK);
  });

  it("empty allowlist → even a publishable-shaped key BLOCKS (fail closed)", () => {
    expect(
      runHook("static/maps.js", `const k="${APPROVED_MAPS_KEY}"`, { allow: [] }),
    ).toBe(BLOCK);
  });
});

describe("dist-leak-scan — real secrets stay blocked", () => {
  it("Gemini API key (AIzaSy value, not allowlisted) BLOCKS", () => {
    expect(runHook("static/g.js", `const k="${GEMINI_AIZA_KEY}"`)).toBe(BLOCK);
  });

  it("new-format Gemini/Google key (AQ.A… value, not AIzaSy) BLOCKS", () => {
    expect(runHook("static/g2.js", `const k="${GEMINI_AQ_KEY}"`)).toBe(BLOCK);
  });

  it("Gemini key by NAME (GOOGLE_GENERATIVE_AI_API_KEY=...) BLOCKS", () => {
    expect(runHook("server/env.js", GEMINI_NAME_LINE)).toBe(BLOCK);
  });

  it("Supabase service-role key BLOCKS", () => {
    expect(runHook("server/env.js", SERVICE_ROLE_LINE)).toBe(BLOCK);
  });

  it("arbitrary GOOGLE_* key (AIzaSy value, not allowlisted) BLOCKS", () => {
    expect(
      runHook("static/g.js", `GOOGLE_API_KEY="${ARBITRARY_GOOGLE_KEY}"`),
    ).toBe(BLOCK);
  });

  it("allowed Maps key MUST NOT mask another secret in the same file (Stripe)", () => {
    expect(
      runHook("static/mixed.js", `const maps="${APPROVED_MAPS_KEY}";const s="${STRIPE_LIVE}"`),
    ).toBe(BLOCK);
  });
});

describe("dist-leak-scan — clean bundle", () => {
  it("no secrets present → ALLOWS", () => {
    expect(runHook("static/app.js", `export const x = 1; // nothing here`)).toBe(ALLOW);
  });
});
