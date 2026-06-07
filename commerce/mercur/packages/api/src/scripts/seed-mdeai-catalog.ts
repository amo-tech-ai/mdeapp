import {
  CreateInventoryLevelInput,
  ExecArgs,
} from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";
import { MercurModules } from "@mercurjs/types";
import { ensureMdeaiSeller } from "./seed-demo-seller";
import { MDEAI_CATALOG } from "./mdeai-catalog-data";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x600/png?text=mdeai";

const LEGACY_ORPHAN_HANDLES = ["t-shirt", "sweatshirt", "sweatpants", "shorts"];

async function linkProductToSeller(
  container: ExecArgs["container"],
  productId: string,
  sellerId: string
) {
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: existing } = await query.graph({
    entity: "product_seller",
    fields: ["product_id", "seller_id"],
    filters: { product_id: productId, seller_id: sellerId },
  });

  if (existing.length) {
    return false;
  }

  await link.create({
    [Modules.PRODUCT]: { product_id: productId },
    [MercurModules.SELLER]: { seller_id: sellerId },
  });

  const { data: variants } = await query.graph({
    entity: "variant",
    fields: ["id", "inventory_items.inventory_item_id"],
    filters: { product_id: productId },
  });

  const inventoryLinks = [];
  for (const variant of variants) {
    for (const item of variant.inventory_items || []) {
      if (!item.inventory_item_id) continue;
      inventoryLinks.push({
        [Modules.INVENTORY]: {
          inventory_item_id: item.inventory_item_id,
        },
        [MercurModules.SELLER]: { seller_id: sellerId },
      });
    }
  }

  if (inventoryLinks.length) {
    try {
      await link.create(inventoryLinks);
    } catch (error: unknown) {
      if (!(error instanceof Error && error.message.includes("already"))) {
        throw error;
      }
    }
  }

  return true;
}

export default async function seedMdeaiCatalog({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const seller = await ensureMdeaiSeller({ container });

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
    filters: { name: "Default Sales Channel" },
  });

  if (!salesChannels.length) {
    throw new Error(
      "Default Sales Channel missing — run `bun run seed` in packages/api first."
    );
  }
  const salesChannelId = salesChannels[0].id;

  const fulfillmentModule = container.resolve(Modules.FULFILLMENT);
  const shippingProfiles = await fulfillmentModule.listShippingProfiles({
    type: "default",
  });
  if (!shippingProfiles.length) {
    throw new Error(
      "Default shipping profile missing — run `bun run seed` in packages/api first."
    );
  }
  const shippingProfileId = shippingProfiles[0].id;

  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION);
  const stockLocations = await stockLocationModule.listStockLocations({
    name: "European Warehouse",
  });
  if (!stockLocations.length) {
    throw new Error(
      "Stock location missing — run `bun run seed` in packages/api first."
    );
  }
  const stockLocationId = stockLocations[0].id;

  // Link legacy Medusa demo products (no seller) so they also appear in Store API.
  const { data: orphanProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: LEGACY_ORPHAN_HANDLES },
  });

  let linkedOrphans = 0;
  for (const product of orphanProducts) {
    const linked = await linkProductToSeller(
      container,
      product.id,
      seller.id
    );
    if (linked) linkedOrphans++;
  }
  if (linkedOrphans) {
    logger.info(`Linked ${linkedOrphans} legacy demo product(s) to mdeai.`);
  }

  const handles = MDEAI_CATALOG.map((p) => p.handle);
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: handles },
  });
  const existingHandles = new Set(existingProducts.map((p) => p.handle));

  const toCreate = MDEAI_CATALOG.filter((p) => !existingHandles.has(p.handle));

  if (toCreate.length) {
    logger.info(`Creating ${toCreate.length} mdeai catalog product(s)...`);
    await createProductsWorkflow(container).run({
      input: {
        products: toCreate.map((item) => ({
          title: item.title,
          handle: item.handle,
          description: item.description,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfileId,
          images: [{ url: PLACEHOLDER_IMAGE }],
          options: [{ title: "Size", values: ["One Size"] }],
          variants: [
            {
              title: "One Size",
              sku: item.sku,
              manage_inventory: true,
              options: { Size: "One Size" },
              prices: [
                { amount: item.priceUsd, currency_code: "usd" },
                { amount: item.priceEur, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: salesChannelId }],
        })),
        additional_data: { seller_id: seller.id },
      },
    });
  } else {
    logger.info("All 20 mdeai catalog products already exist — skipping create.");
  }

  // Ensure inventory levels for any new inventory items at default location.
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryModule = container.resolve(Modules.INVENTORY);
  const existingLevels = await inventoryModule.listInventoryLevels({
    location_id: stockLocationId,
  });
  const existingItemIds = new Set(
    existingLevels.map((l) => l.inventory_item_id)
  );

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const item of inventoryItems) {
    if (!existingItemIds.has(item.id)) {
      inventoryLevels.push({
        location_id: stockLocationId,
        stocked_quantity: 1000,
        inventory_item_id: item.id,
      });
    }
  }

  if (inventoryLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryLevels },
    });
    logger.info(`Seeded ${inventoryLevels.length} inventory level(s).`);
  }

  const { data: mdeaiProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "title"],
    filters: { handle: handles },
  });

  logger.info(
    `ECOM-C-006 complete — seller_id=${seller.id} mdeai_products=${mdeaiProducts.length}`
  );
}
