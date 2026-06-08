#!/usr/bin/env node
/**
 * ECOM-C-007 — mdeapp commerce bridge env (no secret values printed).
 * Usage: node scripts/verify-commerce-mdeapp-env.mjs
 */
const errors = [];

const apiUrl = (process.env.COMMERCE_API_URL ?? "").trim();
const publishableKey = (process.env.COMMERCE_PUBLISHABLE_KEY ?? "").trim();

if (!apiUrl) errors.push("missing COMMERCE_API_URL");
else {
  try {
    const parsed = new URL(apiUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      errors.push(`COMMERCE_API_URL must use http or https (got ${parsed.protocol})`);
    }
  } catch {
    errors.push("COMMERCE_API_URL is not a valid URL");
  }
}

if (!publishableKey) errors.push("missing COMMERCE_PUBLISHABLE_KEY");

if (publishableKey.startsWith("sk_")) {
  errors.push("COMMERCE_PUBLISHABLE_KEY must not be sk_*");
}
if (publishableKey.startsWith("whsec_")) {
  errors.push("COMMERCE_PUBLISHABLE_KEY must not be whsec_*");
}
if (publishableKey && !publishableKey.startsWith("pk_")) {
  errors.push("COMMERCE_PUBLISHABLE_KEY must be pk_*");
}

for (const key of Object.keys(process.env)) {
  if (/^NEXT_PUBLIC_(STRIPE|MEDUSA|COMMERCE)_/i.test(key)) {
    errors.push(`${key} must not exist`);
  }
}

console.log("verify-commerce-mdeapp-env");
console.log(`  COMMERCE_API_URL: ${apiUrl || "(missing)"}`);
console.log(
  `  COMMERCE_PUBLISHABLE_KEY: ${
    publishableKey ? `${publishableKey.slice(0, 8)}…${publishableKey.slice(-4)}` : "(missing)"
  }`,
);

if (errors.length) {
  for (const e of errors) console.error(`FAIL: ${e}`);
  process.exit(1);
}

console.log("PASS: mdeapp commerce client env");
process.exit(0);
