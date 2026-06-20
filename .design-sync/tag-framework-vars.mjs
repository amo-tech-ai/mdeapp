#!/usr/bin/env node
// Post-compile step for the design-sync CSS build.
//
// Tailwind v4's whole-app @source scan emits framework-INTERNAL custom
// properties (runtime vars + theme primitives) into the compiled stylesheet.
// Claude Design's `check_design_system` can't classify them as brand tokens and
// warns. They are NOT brand tokens and MUST NOT be removed — utilities
// reference them at runtime (e.g. `translate: var(--tw-translate-x) …`).
//
// This step ONLY appends a `/* @kind other */` marker to each such *declaration*
// so the checker treats them as intentionally uncategorized. It never deletes,
// reorders, or rewrites any value. @property registration blocks are left alone
// (the checker doesn't flag them). Idempotent — re-running tags nothing new.
//
// Usage: node .design-sync/tag-framework-vars.mjs <compiled.css>
import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: tag-framework-vars.mjs <compiled.css>");
  process.exit(1);
}

// Families to tag, per KNOWN_ISSUES.md: --tw-*, --animate-*, --ease-*,
// --default-transition-*, --aspect-*. Matches a value declaration
// (`--name: value;`) at line start; skips lines already carrying @kind so the
// step is idempotent. The value class `[^;{}]*` keeps it to a single
// declaration and never matches `@property --x {` (no `:`) or `var(--x)` refs.
const DECL =
  /^(\s*)(--(?:tw|animate|ease|default-transition|aspect)-[A-Za-z0-9-]+\s*:[^;{}]*;)(?![^\n]*@kind)/gm;

const css = readFileSync(file, "utf8");
let tagged = 0;
const out = css.replace(DECL, (_m, indent, decl) => {
  tagged++;
  return `${indent}${decl} /* @kind other */`;
});
writeFileSync(file, out);
console.error(`[tag-framework-vars] tagged ${tagged} framework-internal declaration(s) in ${file}`);
