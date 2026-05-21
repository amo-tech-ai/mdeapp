import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@supabase/supabase-js";
import { recordMastraRun } from "./ai-runs";

describe("recordMastraRun", () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
    vi.mocked(createClient).mockReset();
  });

  it("returns void when env vars are missing (no throw)", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    await expect(
      recordMastraRun({
        user_id: null,
        agent_name: "ping-agent",
        agent_type: "general_concierge",
        status: "success",
      }),
    ).resolves.toBeUndefined();

    expect(createClient).not.toHaveBeenCalled();
  });

  it("does not throw when insert fails", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";

    vi.mocked(createClient).mockReturnValue({
      from: () => ({
        insert: () => Promise.resolve({ error: { message: "db down" } }),
      }),
    } as unknown as ReturnType<typeof createClient>);

    await expect(
      recordMastraRun({
        user_id: null,
        agent_name: "ping-agent",
        agent_type: "general_concierge",
        status: "success",
      }),
    ).resolves.toBeUndefined();
  });
});
