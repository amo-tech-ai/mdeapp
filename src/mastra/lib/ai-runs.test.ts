import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@supabase/supabase-js";
import { recordMastraRun, resetAiRunsClientForTests } from "./ai-runs";

describe("recordMastraRun", () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
    resetAiRunsClientForTests();
    vi.mocked(createClient).mockReset();
  });

  it("returns void when env vars are missing (no throw)", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;

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

  it("uses Vercel-style fallbacks (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY)", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SECRET_KEY = "sb_secret_test";

    const insert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(createClient).mockReturnValue({
      from: () => ({ insert }),
    } as unknown as ReturnType<typeof createClient>);

    await recordMastraRun({
      user_id: null,
      agent_name: "ping-agent",
      agent_type: "general_concierge",
      status: "success",
    });

    expect(createClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "sb_secret_test",
      expect.objectContaining({ auth: expect.any(Object) }),
    );
    expect(insert).toHaveBeenCalled();
  });

  it("clears the timeout timer after a successful insert (no leaked timer)", async () => {
    vi.useFakeTimers();
    try {
      process.env.SUPABASE_URL = "https://example.supabase.co";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";

      const insert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(createClient).mockReturnValue({
        from: () => ({ insert }),
      } as unknown as ReturnType<typeof createClient>);

      await recordMastraRun({
        user_id: null,
        agent_name: "ping-agent",
        agent_type: "general_concierge",
        status: "success",
      });

      expect(insert).toHaveBeenCalled();
      // The insert deadline timer must be cleared in `finally`; otherwise it
      // stays pending and keeps the Node event loop warm
      // under chat load.
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
