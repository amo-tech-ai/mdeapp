/**
 * ECOM-C-007 — Server-side Mercur Store API client via @medusajs/js-sdk.
 * Read-only Phase 2 bridge; no cart/checkout writes until later tasks.
 *
 * @see https://docs.medusajs.com/resources/js-sdk
 */

import Medusa, { FetchError } from "@medusajs/js-sdk";
import type { HttpTypes } from "@medusajs/types";

import { CommerceEnvError, readCommerceEnv, type CommerceEnv } from "./commerce-env";

export { CommerceEnvError } from "./commerce-env";

export class CommerceClientError extends Error {
  readonly code: "COMMERCE_REQUEST_FAILED" | "COMMERCE_NOT_FOUND";
  readonly status?: number;
  readonly cause?: unknown;

  constructor(
    message: string,
    options: {
      code?: CommerceClientError["code"];
      status?: number;
      cause?: unknown;
    } = {},
  ) {
    super(message);
    this.name = "CommerceClientError";
    this.code = options.code ?? "COMMERCE_REQUEST_FAILED";
    this.status = options.status;
    this.cause = options.cause;
  }
}

const DEFAULT_TIMEOUT_MS = 15_000;
const VARIANT_FIELDS = "id,*variants";

/**
 * Slim list mask — ProductCards need price/seller/variants, not seller cross-sell graph.
 * Excludes `*seller.reviews*` and `*seller.products*` (SAN-725 / SAN-724).
 */
export const COMMERCE_PRODUCT_LIST_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*attribute_values,*attribute_values.attribute";

/**
 * Detail mask — includes seller cross-sells (matches B2C reference PDP).
 * Excludes `*seller.reviews*` — local Mercur returns 500 when reviews are not seeded.
 *
 * @see docs/ecommerce/evidence/2026-06-07/b2c-reference-storefront.md
 */
export const COMMERCE_PRODUCT_DETAIL_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.products.variants,*attribute_values,*attribute_values.attribute";

/** @deprecated Use LIST or DETAIL fields; kept for tests and SAN-725 policy doc. */
export const COMMERCE_PRODUCT_FIELDS = COMMERCE_PRODUCT_DETAIL_FIELDS;

export type ListProductsParams = HttpTypes.StoreProductListParams;
export type GetProductParams = HttpTypes.StoreProductParams;

type StoreProductWithSeller = HttpTypes.StoreProduct & {
  seller?: { reviews?: unknown[] | null; [key: string]: unknown };
};

function normalizeProduct<T extends StoreProductWithSeller>(product: T): T {
  if (!product.seller) return product;
  return {
    ...product,
    seller: {
      ...product.seller,
      reviews: product.seller.reviews ?? [],
    },
  };
}

function withProductFields(
  params: ListProductsParams | GetProductParams | undefined,
  defaultFields: string,
): ListProductsParams | GetProductParams {
  return {
    ...params,
    fields: params?.fields ?? defaultFields,
  };
}

export type CommerceMedusaClient = {
  listProducts: (
    params?: ListProductsParams,
  ) => Promise<HttpTypes.StoreProductListResponse>;
  getProduct: (
    id: string,
    params?: GetProductParams,
  ) => Promise<HttpTypes.StoreProductResponse>;
  listRegions: (
    params?: HttpTypes.StoreRegionFilters & { limit?: number; offset?: number },
  ) => Promise<HttpTypes.StoreRegionListResponse>;
  getVariant: (
    productId: string,
    variantId: string,
    params?: GetProductParams,
  ) => Promise<HttpTypes.StoreProductVariant>;
};

function normalizeCommerceError(error: unknown): CommerceClientError {
  if (error instanceof CommerceClientError) return error;
  if (error instanceof CommerceEnvError) {
    return new CommerceClientError(error.message, { cause: error });
  }
  if (error instanceof FetchError) {
    const code =
      error.status === 404 ? "COMMERCE_NOT_FOUND" : "COMMERCE_REQUEST_FAILED";
    return new CommerceClientError(
      error.message || `Medusa Store API error (${error.status})`,
      { code, status: error.status, cause: error },
    );
  }
  if (error instanceof Error) {
    return new CommerceClientError(error.message, { cause: error });
  }
  return new CommerceClientError("Unknown commerce client error", {
    cause: error,
  });
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(
        new CommerceClientError(
          `Medusa Store API request timed out after ${timeoutMs}ms`,
        ),
      );
    }, timeoutMs);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function createSdk(env: CommerceEnv): Medusa {
  return new Medusa({
    baseUrl: env.apiUrl,
    publishableKey: env.publishableKey,
    debug: process.env.NODE_ENV === "development",
  });
}

/**
 * Factory for tests and dependency injection. Production code uses `getCommerceClient()`.
 */
export function createCommerceClient(
  env: CommerceEnv,
  options: { timeoutMs?: number } = {},
): CommerceMedusaClient {
  const sdk = createSdk(env);
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  return {
    async listProducts(params) {
      try {
        const response = await withTimeout(
          sdk.store.product.list(
            withProductFields(params, COMMERCE_PRODUCT_LIST_FIELDS),
          ),
          timeoutMs,
        );
        return {
          ...response,
          products: response.products?.map((product) =>
            normalizeProduct(product as StoreProductWithSeller),
          ),
        };
      } catch (error) {
        throw normalizeCommerceError(error);
      }
    },

    async getProduct(id, params) {
      try {
        const response = await withTimeout(
          sdk.store.product.retrieve(
            id,
            withProductFields(params, COMMERCE_PRODUCT_DETAIL_FIELDS),
          ),
          timeoutMs,
        );
        return {
          ...response,
          product: normalizeProduct(response.product as StoreProductWithSeller),
        };
      } catch (error) {
        throw normalizeCommerceError(error);
      }
    },

    async listRegions(params) {
      try {
        return await withTimeout(sdk.store.region.list(params), timeoutMs);
      } catch (error) {
        throw normalizeCommerceError(error);
      }
    },

    async getVariant(productId, variantId, params) {
      try {
        const { product } = await withTimeout(
          sdk.store.product.retrieve(productId, {
            ...params,
            fields: params?.fields ?? VARIANT_FIELDS,
          }),
          timeoutMs,
        );
        const variant = product.variants?.find((v) => v.id === variantId);
        if (!variant) {
          throw new CommerceClientError(
            `Variant ${variantId} not found on product ${productId}`,
            { code: "COMMERCE_NOT_FOUND", status: 404 },
          );
        }
        return variant;
      } catch (error) {
        throw normalizeCommerceError(error);
      }
    },
  };
}

let cachedClient: CommerceMedusaClient | null = null;

/** Singleton read-only Store API client (server-side). */
export function getCommerceClient(): CommerceMedusaClient {
  if (!cachedClient) {
    cachedClient = createCommerceClient(readCommerceEnv());
  }
  return cachedClient;
}

/** @internal test helper */
export function resetCommerceClientForTests(): void {
  cachedClient = null;
}
