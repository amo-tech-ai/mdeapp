import { describe, expect, it } from "vitest";

import { CommerceEnvError, readCommerceEnv } from "../commerce-env";

describe("readCommerceEnv (ECOM-C-007)", () => {
  it("returns normalized api URL and publishable key", () => {
    const env = readCommerceEnv({
      COMMERCE_API_URL: "http://localhost:9000/",
      COMMERCE_PUBLISHABLE_KEY: "pk_test_example",
    });

    expect(env.apiUrl).toBe("http://localhost:9000");
    expect(env.publishableKey).toBe("pk_test_example");
  });

  it("fails when COMMERCE_API_URL is missing", () => {
    expect(() =>
      readCommerceEnv({
        COMMERCE_PUBLISHABLE_KEY: "pk_test_example",
      }),
    ).toThrow(CommerceEnvError);
  });

  it("fails when COMMERCE_PUBLISHABLE_KEY is missing", () => {
    expect(() =>
      readCommerceEnv({
        COMMERCE_API_URL: "http://localhost:9000",
      }),
    ).toThrow(CommerceEnvError);
  });

  it("rejects Stripe secret keys as publishable key", () => {
    expect(() =>
      readCommerceEnv({
        COMMERCE_API_URL: "http://localhost:9000",
        COMMERCE_PUBLISHABLE_KEY: "sk_test_secret",
      }),
    ).toThrow(/publishable key/i);
  });

  it("rejects non-pk publishable keys", () => {
    expect(() =>
      readCommerceEnv({
        COMMERCE_API_URL: "http://localhost:9000",
        COMMERCE_PUBLISHABLE_KEY: "not_a_real_key",
      }),
    ).toThrow(/pk_\*/i);
  });

  it("allows mdeapp ticket Stripe vars alongside commerce publishable key", () => {
    const env = readCommerceEnv({
      COMMERCE_API_URL: "http://localhost:9000",
      COMMERCE_PUBLISHABLE_KEY: "pk_test_example",
      STRIPE_API_KEY: "sk_test_ticket_checkout",
    });
    expect(env.publishableKey).toBe("pk_test_example");
  });
});
