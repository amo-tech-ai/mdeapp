import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createSellersWorkflow,
  approveSellerWorkflow,
} from "@mercurjs/core/workflows";
import { SellerStatus } from "@mercurjs/types";
import {
  MDEAI_SELLER_EMAIL,
  MDEAI_SELLER_HANDLE,
  MDEAI_SELLER_NAME,
} from "./mdeai-catalog-data";

export type MdeaiSellerResult = {
  id: string;
  name: string;
  handle: string;
  status: string;
  created: boolean;
  approved: boolean;
};

export async function ensureMdeaiSeller({
  container,
}: ExecArgs): Promise<MdeaiSellerResult> {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: existing } = await query.graph({
    entity: "seller",
    fields: ["id", "name", "handle", "status", "email"],
    filters: { name: MDEAI_SELLER_NAME },
  });

  let seller = existing[0];
  let created = false;
  let approved = false;

  if (!seller) {
    logger.info(`Creating demo seller "${MDEAI_SELLER_NAME}"...`);
    const { result } = await createSellersWorkflow(container).run({
      input: {
        sellers: [
          {
            name: MDEAI_SELLER_NAME,
            handle: MDEAI_SELLER_HANDLE,
            email: MDEAI_SELLER_EMAIL,
            currency_code: "usd",
            description: "mdeai demo seller — Medellín lifestyle catalog (Phase 1).",
            member: { email: MDEAI_SELLER_EMAIL },
          },
        ],
      },
    });
    seller = result[0];
    created = true;
    logger.info(`Created seller ${seller.id} (${seller.name})`);
  } else {
    logger.info(`Seller "${MDEAI_SELLER_NAME}" already exists: ${seller.id}`);
  }

  if (seller.status !== SellerStatus.OPEN) {
    logger.info(`Approving seller ${seller.id} (was ${seller.status})...`);
    await approveSellerWorkflow(container).run({
      input: { seller_id: seller.id },
    });
    approved = true;
    seller = { ...seller, status: SellerStatus.OPEN };
    logger.info(`Seller ${seller.id} is now ${SellerStatus.OPEN}`);
  }

  return {
    id: seller.id,
    name: seller.name,
    handle: seller.handle,
    status: seller.status,
    created,
    approved,
  };
}

export default async function seedDemoSeller(execArgs: ExecArgs) {
  const seller = await ensureMdeaiSeller(execArgs);
  execArgs.container
    .resolve(ContainerRegistrationKeys.LOGGER)
    .info(
      `ECOM-C-005 complete — seller_id=${seller.id} status=${seller.status}`
    );
}
