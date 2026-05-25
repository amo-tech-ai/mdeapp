import { describe, expect, it } from "vitest";
import { createUserScopedClient } from "../user-scoped";

describe("createUserScopedClient", () => {
  it("constructs without throwing when env is set", () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";
    const client = createUserScopedClient("test-access-token");
    expect(client).toBeDefined();
  });
});
