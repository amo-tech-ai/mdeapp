/**
 * ECOM-C-007 — Live smoke: list products via server commerce client (read-only).
 */
import { getCommerceClient } from "../src/lib/commerce/medusa-client";

const apiUrl = process.env.COMMERCE_API_URL ?? "";
const MIN_PRODUCT_COUNT = 20;

async function main() {
  const health = await fetch(`${apiUrl.replace(/\/+$/, "")}/health`);
  if (!health.ok) {
    console.error(`FAIL: Mercur health ${health.status}`);
    process.exit(1);
  }

  const client = getCommerceClient();
  const { regions } = await client.listRegions({ limit: 1 });
  const regionId = regions?.[0]?.id;
  if (!regionId) {
    console.error("FAIL: no Store region available for pricing context");
    process.exit(1);
  }

  const { products, count } = await client.listProducts({
    limit: 5,
    region_id: regionId,
  });

  console.log("smoke-commerce-client");
  console.log(`  health: ${health.status}`);
  console.log(`  region_id: ${regionId}`);
  console.log(`  products.count: ${count}`);
  console.log(`  products.sample: ${products?.[0]?.id ?? "(none)"}`);

  if (!count || count < MIN_PRODUCT_COUNT) {
    console.error(
      `FAIL: expected at least ${MIN_PRODUCT_COUNT} products from Store API`,
    );
    process.exit(1);
  }

  const sampleId = products?.[0]?.id;
  if (sampleId) {
    const { product } = await client.getProduct(sampleId, { region_id: regionId });
    if (!product?.id) {
      console.error("FAIL: getProduct returned empty product");
      process.exit(1);
    }
    console.log(`  getProduct: ${product.id}`);
  }

  console.log("PASS: commerce client listProducts + getProduct");
}

main().catch((error) => {
  console.error("FAIL:", error instanceof Error ? error.message : error);
  process.exit(1);
});
