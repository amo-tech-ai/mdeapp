#!/usr/bin/env node
/**
 * Verify scr ↔ wire frontmatter pairing across tasks/** spec trees.
 * Run from repo root: node scripts/verify-scr-wire-pairing.mjs
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SCAN_DIRS = [
  "tasks/wireframes",
  "tasks/screens",
  "tasks/events/wireframes",
  "tasks/trips/wireframes",
  "tasks/trips",
  "tasks/real-estate/wireframes",
  "tasks/real-estate",
  "tasks/maps/wireframes",
  "tasks/venues/tasks/mvp/wireframes",
  "tasks/archive/events-A/wireframes",
];

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

function parseFrontmatter(text) {
  const m = text.match(FRONTMATTER);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, raw] = kv;
    if (raw.startsWith("[") && raw.endsWith("]")) {
      out[key] = raw
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
    } else if (raw.startsWith("- ")) {
      out[key] = [raw.slice(2).trim()];
    } else {
      out[key] = raw.replace(/^['"]|['"]$/g, "");
    }
  }
  // multiline wireframes:/screens: lists
  const yaml = m[1];
  for (const key of ["wireframes", "screens"]) {
    const block = yaml.match(new RegExp(`^${key}:\\s*\\n((?:  - .+\\n)+)`, "m"));
    if (block) {
      out[key] = block[1]
        .split("\n")
        .map((l) => l.replace(/^\s*-\s*/, "").trim())
        .filter(Boolean);
    }
  }
  return out;
}

async function walk(dir, acc = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, acc);
    else if (/\.md$/.test(e.name) && /(scr|wire)/.test(e.name)) acc.push(full);
  }
  return acc;
}

function basenameRef(ref) {
  return path.basename(ref.replace(/^\.\.\//, ""));
}

async function main() {
  const files = [];
  for (const d of SCAN_DIRS) await walk(path.join(ROOT, d), files);

  const byBase = new Map();
  for (const f of files) {
    const base = path.basename(f);
    if (!byBase.has(base)) byBase.set(base, []);
    byBase.get(base).push(f);
  }

  const docs = new Map();
  for (const f of files) {
    const text = await readFile(f, "utf8");
    const fm = parseFrontmatter(text);
    const kind = path.basename(f).includes("-scr-")
      ? "scr"
      : path.basename(f).includes("-wire-") || /wire/.test(path.basename(f))
        ? "wire"
        : "other";
    docs.set(f, { fm, kind, rel: path.relative(ROOT, f) });
  }

  let errors = 0;
  let warnings = 0;

  for (const [f, { fm, kind, rel }] of docs) {
    if (kind === "scr") {
      const wires = fm.wireframes;
      if (!wires || (Array.isArray(wires) && wires.length === 0)) {
        if (fm.primary_wire) continue;
        warnings++;
        console.warn(`WARN ${rel}: scr has no wireframes: frontmatter`);
        continue;
      }
      const list = Array.isArray(wires) ? wires : [wires];
      for (const w of list) {
        const wb = basenameRef(w);
        const matches = byBase.get(wb) ?? [];
        if (matches.length === 0) {
          errors++;
          console.error(`ERR  ${rel}: wireframes entry missing on disk: ${wb}`);
        }
      }
    }
  }

  // Duplicate scr specs with conflicting status
  for (const [base, paths] of byBase) {
    if (!base.includes("-scr-") || paths.length < 2) continue;
    const statuses = new Set();
    for (const p of paths) {
      const d = docs.get(p);
      if (d?.fm.status) statuses.add(d.fm.status);
    }
    if (statuses.size > 1) {
      errors++;
      console.error(
        `ERR  status drift for ${base}: ${[...statuses].join(" vs ")} in ${paths.map((p) => path.relative(ROOT, p)).join(", ")}`,
      );
    }
  }

  console.log(`\nScanned ${files.length} scr/wire files in ${SCAN_DIRS.length} trees.`);
  if (errors) {
    console.error(`FAILED: ${errors} error(s), ${warnings} warning(s)`);
    process.exit(1);
  }
  console.log(`OK: pairing check passed (${warnings} warning(s))`);
}

main();
