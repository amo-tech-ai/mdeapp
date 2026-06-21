#!/usr/bin/env node
// check-docs-links.mjs — validate relative Markdown links in docs.
//
// Two modes:
//   node scripts/check-docs-links.mjs --all          Report-only scan of all docs (exits 0).
//   node scripts/check-docs-links.mjs --all --strict  Full scan, exits 1 if any active link is broken.
//   node scripts/check-docs-links.mjs <file.md> ...   Validate only the given files; exits 1 if any broken.
//
// The file-list mode is the PR gate: CI passes the markdown files changed in the PR, so the
// large legacy backlog in *untouched* files never blocks a merge — but no PR may add or keep a
// broken link in a file it touches. Links under any `archive/` segment are skipped (historical).
//
// Only inline links `[text](target)` are checked. External (http/https/mailto/tel), in-page
// anchors (#...), and protocol-relative links are ignored. A target that resolves to an existing
// file OR directory is valid; query strings and #anchors are stripped before resolving.

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const ALL = args.includes("--all");
const STRICT = args.includes("--strict");
const fileArgs = args.filter((a) => !a.startsWith("--"));

const LINK_RE = /\[[^\]]*\]\(([^)]+)\)/g;
const SKIP_PREFIX = ["http://", "https://", "mailto:", "tel:", "#", "//"];

function isArchive(p) {
  const norm = p.split(path.sep).join("/");
  return /(^|\/)archive\//.test(norm) || /(^|\/)_archive\//.test(norm);
}

function listAllDocs() {
  const out = [];
  const roots = ["docs"];
  // also root-level *.md (README, AGENTS, CLAUDE, etc.)
  for (const f of fs.readdirSync(".")) {
    if (f.endsWith(".md") && fs.statSync(f).isFile()) out.push(f);
  }
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules") continue;
        walk(full);
      } else if (entry.name.endsWith(".md")) {
        out.push(full);
      }
    }
  };
  for (const r of roots) if (fs.existsSync(r)) walk(r);
  return out;
}

function checkFile(file) {
  const broken = [];
  let txt;
  try {
    txt = fs.readFileSync(file, "utf8");
  } catch {
    return broken; // deleted/unreadable — skip
  }
  const dir = path.dirname(file);
  let m;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(txt)) !== null) {
    const target = m[1].trim();
    if (SKIP_PREFIX.some((p) => target.startsWith(p))) continue;
    const rel = target.split("#")[0].split("?")[0];
    if (!rel) continue; // pure anchor
    const resolved = path.normalize(path.join(dir, rel));
    if (!fs.existsSync(resolved)) broken.push({ target, resolved });
  }
  return broken;
}

let files;
if (fileArgs.length > 0) {
  files = fileArgs;
} else if (ALL) {
  files = listAllDocs();
} else {
  console.error("Usage: check-docs-links.mjs --all [--strict] | <file.md> ...");
  process.exit(2);
}

let active = 0;
let archived = 0;
let brokenActive = 0;
let brokenArchived = 0;
const report = [];

for (const file of files) {
  if (!file.endsWith(".md")) continue;
  const broken = checkFile(file);
  if (isArchive(file)) {
    archived++;
    brokenArchived += broken.length;
    continue; // historical — never gate on these
  }
  active++;
  if (broken.length) {
    brokenActive += broken.length;
    report.push({ file, broken });
  }
}

if (report.length) {
  console.log("\nBroken internal links in active docs:\n");
  for (const { file, broken } of report) {
    console.log(`  ${file}`);
    for (const b of broken) console.log(`     ✗ ${b.target}`);
  }
}

console.log(
  `\ncheck-docs-links: scanned ${active} active doc(s), ${brokenActive} broken link(s)` +
    (fileArgs.length ? "" : ` · skipped ${archived} archive doc(s) (${brokenArchived} broken, historical, ignored)`)
);

// Gate: file-list mode always fails on broken; --all only fails with --strict.
const shouldFail = brokenActive > 0 && (fileArgs.length > 0 || STRICT);
if (shouldFail) {
  console.error(`\n✗ ${brokenActive} broken link(s) in changed/active docs — fix or repoint them.`);
  process.exit(1);
}
console.log("✓ no blocking broken links.");
process.exit(0);
