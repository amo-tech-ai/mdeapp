#!/usr/bin/env node
/**
 * ECOM-C-003 — Verify commerce env contract (no secret values printed).
 * Usage: node scripts/verify-commerce-env.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const commerceEnv = resolve(root, "commerce/.env");
const apiEnv = resolve(root, "commerce/mercur/packages/api/.env");
const template = resolve(root, "commerce/mercur/packages/api/.env.template");

const errors = [];
const warnings = [];

function parseEnv(path) {
  if (!existsSync(path)) return null;
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

function mask(v) {
  if (!v) return "(missing)";
  if (v.length < 12) return `(${v.length} chars)`;
  return `${v.slice(0, 8)}…${v.slice(-4)}`;
}

const requiredCommerce = [
  "MEDUSA_PUBLISHABLE_KEY",
  "SELLER_ID",
  "STRIPE_API_KEY",
  "STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
];

const requiredApi = [
  "DATABASE_URL",
  "REDIS_URL",
  "JWT_SECRET",
  "COOKIE_SECRET",
  "STRIPE_API_KEY",
  "STRIPE_WEBHOOK_SECRET",
];

const forbiddenCommerceKeys = [
  "STRIPE_SPONSOR_WEBHOOK_SECRET",
  "STRIPE_EVENTS_WEBHOOK_SECRET",
  "STRIPE_SPONSOR_CHECKOUT_KEY",
];

if (!existsSync(template)) {
  errors.push("missing commerce/mercur/packages/api/.env.template");
}

const c = parseEnv(commerceEnv);
const a = parseEnv(apiEnv);

if (!c) errors.push("missing commerce/.env (create from docs/ecommerce/docs/env-commerce.md)");
if (!a) errors.push("missing commerce/mercur/packages/api/.env");

if (c) {
  for (const k of requiredCommerce) {
    if (!c[k]) errors.push(`commerce/.env missing ${k}`);
  }
  if (c.STRIPE_API_KEY?.startsWith("sk_live_")) {
    errors.push("commerce/.env must not use sk_live_ in Phase 1");
  }
  if (c.STRIPE_PUBLISHABLE_KEY?.startsWith("pk_live_")) {
    errors.push("commerce/.env must not use pk_live_ in Phase 1");
  }
  const dupPk = (readFileSync(commerceEnv, "utf8").match(/^STRIPE_PUBLISHABLE_KEY=/gm) || []).length;
  if (dupPk > 1) errors.push("commerce/.env has duplicate STRIPE_PUBLISHABLE_KEY lines");
  for (const k of forbiddenCommerceKeys) {
    if (c[k]) errors.push(`commerce/.env must not contain events key ${k}`);
  }
  if (c.STRIPE_WEBHOOK_SECRET && !c.STRIPE_WEBHOOK_SECRET.startsWith("whsec_")) {
    warnings.push("STRIPE_WEBHOOK_SECRET does not look like whsec_");
  }
}

if (a) {
  for (const k of requiredApi) {
    if (!a[k]) errors.push(`packages/api/.env missing ${k}`);
  }
  const cors = a.STORE_CORS || "";
  if (!cors.includes("3000") || !cors.includes("3001")) {
    warnings.push("STORE_CORS should include localhost:3000 and :3001 for Phase 2 bridge");
  }
}

if (c && a) {
  for (const k of ["STRIPE_API_KEY", "STRIPE_WEBHOOK_SECRET"]) {
    if (c[k] && a[k] && c[k] !== a[k]) {
      errors.push(`${k} mismatch between commerce/.env and packages/api/.env`);
    }
  }
}

console.log("verify-commerce-env");
console.log(`  commerce/.env: ${existsSync(commerceEnv) ? "ok" : "MISSING"}`);
console.log(`  packages/api/.env: ${existsSync(apiEnv) ? "ok" : "MISSING"}`);
if (c?.STRIPE_API_KEY) console.log(`  STRIPE_API_KEY: ${mask(c.STRIPE_API_KEY)}`);
if (c?.STRIPE_WEBHOOK_SECRET) console.log(`  STRIPE_WEBHOOK_SECRET: ${mask(c.STRIPE_WEBHOOK_SECRET)}`);

for (const w of warnings) console.warn(`WARN: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`FAIL: ${e}`);
  process.exit(1);
}
console.log("PASS: commerce env contract");
process.exit(0);
