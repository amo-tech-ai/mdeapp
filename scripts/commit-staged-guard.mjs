#!/usr/bin/env node
/**
 * Pre-commit guard for C-012 / C-013 slice isolation.
 * Usage: node scripts/commit-staged-guard.mjs c012|c013
 */
import { execSync } from "node:child_process";

const slice = process.argv[2];
const staged = execSync("git diff --cached --name-only", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean);

if (staged.length === 0) {
  console.error("commit-staged-guard: nothing staged");
  process.exit(1);
}

const rules = {
  c012: {
    forbidden: /rentals|event-fast-path|event-fast-path-panel/i,
    requiredHint: /cafe|places\/detail|place-details|cafe-ask|use-place-details|SCREEN-021|search-grounded-places/i,
    label: "C-012 café",
  },
  c013: {
    forbidden: /cafe-booking|cafe-detail|cafe-result|places\/detail|place-details\.ts/i,
    requiredHint: /event-fast-path|SCREEN-006|event-card/i,
    label: "C-013 events",
  },
};

const rule = rules[slice];
if (!rule) {
  console.error("Usage: node scripts/commit-staged-guard.mjs c012|c013");
  process.exit(1);
}

const forbidden = staged.filter((p) => rule.forbidden.test(p));
if (forbidden.length > 0) {
  console.error(`${rule.label}: forbidden staged paths:\n${forbidden.join("\n")}`);
  process.exit(1);
}

const hasHint = staged.some((p) => rule.requiredHint.test(p));
if (!hasHint) {
  console.warn(`${rule.label}: WARN — no obvious slice paths in staged set`);
}

console.log(`${rule.label}: staged-path guard OK (${staged.length} files)`);
for (const p of staged) console.log(`  ${p}`);
