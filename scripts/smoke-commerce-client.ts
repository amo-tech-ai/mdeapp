/**
 * ECOM-C-007 — Live smoke: list products via server commerce client (read-only).
 */
import { getCommerceClient } from "../src/lib/commerce/medusa-client";

const apiUrl = process.env.COMMERCE_API_URL ?? "";

async function main() {
  const health = await fetch(`${apiUrl.replace(/\/+$/, "")}/health`);
  if (!health.ok) {
    console.error(`FAIL: Mercur health ${health.status}`);
    process.exit(1);
  }

  const client = getCommerceClient();
  const { products, count } = await client.listProducts({ limit: 5 });

  console.log("smoke-commerce-client");
  console.log(`  health: ${health.status}`);
  console.log(`  products.count: ${count}`);
  console.log(`  products.sample: ${products?.[0]?.id ?? "(none)"}`);

  if (!count || count < 1) {
    console.error("FAIL: expected at least 1 product from Store API");
    process.exit(1);
  }

  console.log("PASS: commerce client listProducts");
}

main().catch((error) => {
  console.error("FAIL:", error instanceof Error ? error.message : error);
  process.exit(1);
});
