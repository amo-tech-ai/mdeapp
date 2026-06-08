import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { listMock, retrieveMock, regionListMock, getLastSdkConfig, setLastSdkConfig } =
  vi.hoisted(() => {
    const listMock = vi.fn();
    const retrieveMock = vi.fn();
    const regionListMock = vi.fn();
    let lastConfig: { baseUrl: string; publishableKey?: string } | null = null;

    return {
      listMock,
      retrieveMock,
      regionListMock,
      getLastSdkConfig: () => lastConfig,
      setLastSdkConfig: (config: { baseUrl: string; publishableKey?: string }) => {
        lastConfig = config;
      },
    };
  });

vi.mock("@medusajs/js-sdk", () => {
  class MockMedusa {
    store: {
      product: { list: typeof listMock; retrieve: typeof retrieveMock };
      region: { list: typeof regionListMock };
    };

    constructor(config: { baseUrl: string; publishableKey?: string }) {
      setLastSdkConfig(config);
      this.store = {
        product: { list: listMock, retrieve: retrieveMock },
        region: { list: regionListMock },
      };
    }
  }

  return {
    default: MockMedusa,
    FetchError: class FetchError extends Error {
      status = 500;
      statusText = "Internal Server Error";
    },
  };
});

import {
  COMMERCE_PRODUCT_DETAIL_FIELDS,
  COMMERCE_PRODUCT_LIST_FIELDS,
  CommerceClientError,
  createCommerceClient,
  getCommerceClient,
  resetCommerceClientForTests,
} from "../medusa-client";

describe("createCommerceClient (ECOM-C-007)", () => {
  beforeEach(() => {
    listMock.mockReset();
    retrieveMock.mockReset();
    regionListMock.mockReset();
    setLastSdkConfig({ baseUrl: "", publishableKey: "" });
  });

  afterEach(() => {
    resetCommerceClientForTests();
  });

  it("builds SDK with correct base URL and publishable key", async () => {
    listMock.mockResolvedValue({ products: [], count: 0, offset: 0, limit: 20 });

    const client = createCommerceClient({
      apiUrl: "http://localhost:9000",
      publishableKey: "pk_test_publishable",
    });

    await client.listProducts({ limit: 5 });

    expect(getLastSdkConfig()).toEqual(
      expect.objectContaining({
        baseUrl: "http://localhost:9000",
        publishableKey: "pk_test_publishable",
      }),
    );
  });

  it("listProducts delegates to sdk.store.product.list", async () => {
    listMock.mockResolvedValue({
      products: [{ id: "prod_1", title: "Test" }],
      count: 1,
      offset: 0,
      limit: 20,
    });

    const client = createCommerceClient({
      apiUrl: "http://localhost:9000",
      publishableKey: "pk_test",
    });

    const result = await client.listProducts({ limit: 10 });
    expect(listMock).toHaveBeenCalledWith({
      limit: 10,
      fields: COMMERCE_PRODUCT_FIELDS,
    });
    expect(result.count).toBe(1);
  });

  it("COMMERCE_PRODUCT_FIELDS excludes seller.reviews", () => {
    expect(COMMERCE_PRODUCT_FIELDS).not.toMatch(/seller\.reviews/);
  });

  it("listProducts normalizes seller.reviews to empty array when absent", async () => {
    listMock.mockResolvedValue({
      products: [{ id: "prod_1", seller: { id: "sel_1", name: "mdeai" } }],
      count: 1,
      offset: 0,
      limit: 20,
    });

    const client = createCommerceClient({
      apiUrl: "http://localhost:9000",
      publishableKey: "pk_test",
    });

    const result = await client.listProducts();
    const seller = (result.products?.[0] as { seller?: { reviews?: unknown[] } })
      ?.seller;
    expect(seller).toEqual(expect.objectContaining({ reviews: [] }));
  });

  it("getProduct applies safe field mask and normalizes seller", async () => {
    retrieveMock.mockResolvedValue({
      product: { id: "prod_1", seller: { id: "sel_1" } },
    });

    const client = createCommerceClient({
      apiUrl: "http://localhost:9000",
      publishableKey: "pk_test",
    });

    const result = await client.getProduct("prod_1");
    expect(retrieveMock).toHaveBeenCalledWith("prod_1", {
      fields: COMMERCE_PRODUCT_FIELDS,
    });
    const seller = (result.product as { seller?: { reviews?: unknown[] } }).seller;
    expect(seller).toEqual(expect.objectContaining({ reviews: [] }));
  });

  it("getVariant resolves variant from product retrieve", async () => {
    retrieveMock.mockResolvedValue({
      product: {
        id: "prod_1",
        variants: [
          { id: "variant_a", title: "A" },
          { id: "variant_b", title: "B" },
        ],
      },
    });

    const client = createCommerceClient({
      apiUrl: "http://localhost:9000",
      publishableKey: "pk_test",
    });

    const variant = await client.getVariant("prod_1", "variant_b");
    expect(variant.id).toBe("variant_b");
    expect(retrieveMock).toHaveBeenCalledWith("prod_1", {
      fields: "id,*variants",
    });
  });

  it("getVariant throws CommerceClientError when variant missing", async () => {
    retrieveMock.mockResolvedValue({
      product: { id: "prod_1", variants: [{ id: "variant_a" }] },
    });

    const client = createCommerceClient({
      apiUrl: "http://localhost:9000",
      publishableKey: "pk_test",
    });

    await expect(client.getVariant("prod_1", "missing")).rejects.toBeInstanceOf(
      CommerceClientError,
    );
  });

  it("getCommerceClient fails safely when env is missing", () => {
    const prevUrl = process.env.COMMERCE_API_URL;
    const prevKey = process.env.COMMERCE_PUBLISHABLE_KEY;
    delete process.env.COMMERCE_API_URL;
    delete process.env.COMMERCE_PUBLISHABLE_KEY;

    expect(() => getCommerceClient()).toThrow(/COMMERCE_API_URL is required/i);

    process.env.COMMERCE_API_URL = prevUrl;
    process.env.COMMERCE_PUBLISHABLE_KEY = prevKey;
  });
});

describe("medusa-client source safety (ECOM-C-007)", () => {
  it("does not reference Stripe secret literals in the client module", () => {
    const source = readFileSync(
      resolve(import.meta.dirname, "../medusa-client.ts"),
      "utf8",
    );

    expect(source).not.toMatch(/STRIPE_API_KEY/);
    expect(source).not.toMatch(/STRIPE_WEBHOOK_SECRET/);
    expect(source).not.toMatch(/sk_test_/);
    expect(source).not.toMatch(/sk_live_/);
    expect(source).not.toMatch(/whsec_/);
    expect(source).not.toMatch(/NEXT_PUBLIC_COMMERCE/);
  });
});
