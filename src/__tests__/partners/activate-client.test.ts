import { describe, expect, it, vi } from "vitest";
import {
  activateErrorMessage,
  activatePartnerRequest,
  assertSafeActivatePayload,
  buildActivatePayload,
  shouldDeferDashboardRedirect,
} from "@/lib/partners/activate-client";

const PARTNER_ID = "22222222-2222-4222-a222-222222222222";
const DRAFT_ID = "33333333-3333-4333-a333-333333333333";

describe("buildActivatePayload", () => {
  it("includes selected partner type and safe settings", () => {
    const payload = buildActivatePayload(
      "host",
      {
        businessName: "Roof Events",
        category: "nightlife",
        neighborhood: "Provenza",
      },
      DRAFT_ID,
    );

    expect(payload).toEqual({
      type: "host",
      draftId: DRAFT_ID,
      settings: {
        businessName: "Roof Events",
        category: "nightlife",
        neighborhood: "Provenza",
      },
    });
  });

  it("omits draftId when not provided", () => {
    const payload = buildActivatePayload("venue", {
      businessName: "Cafe Norte",
    });
    expect(payload.draftId).toBeUndefined();
  });

  it("does not send privileged settings keys", () => {
    const payload = buildActivatePayload("host", {
      businessName: "Safe Co",
      category: "events",
    });

    expect(payload.settings).toEqual({
      businessName: "Safe Co",
      category: "events",
    });
    expect(() => assertSafeActivatePayload(payload)).not.toThrow();
    expect(() =>
      assertSafeActivatePayload({
        type: "host",
        settings: { status: "active", tier: "pro", completion_score: 99 },
      }),
    ).toThrow(/Privileged setting key blocked/);
  });
});

describe("activatePartnerRequest", () => {
  it("handles 201 create success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          partnerId: PARTNER_ID,
          type: "host",
          status: "draft",
          redirectTo: "/dashboard",
        }),
        { status: 201 },
      ),
    );

    const result = await activatePartnerRequest(
      { type: "host", settings: { businessName: "Roof" } },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith("/api/partners/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "host",
        settings: { businessName: "Roof" },
      }),
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.status).toBe(201);
    expect(result.created).toBe(true);
    expect(result.data.partnerId).toBe(PARTNER_ID);
  });

  it("handles 200 duplicate success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          partnerId: PARTNER_ID,
          type: "host",
          status: "draft",
          redirectTo: "/dashboard",
        }),
        { status: 200 },
      ),
    );

    const result = await activatePartnerRequest({ type: "host" }, fetchMock);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.status).toBe(200);
    expect(result.created).toBe(false);
  });

  it("maps validation and auth errors", async () => {
    const fetch400 = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "Validation failed" }), {
        status: 400,
      }),
    );
    const bad400 = await activatePartnerRequest({ type: "host" }, fetch400);
    expect(bad400.ok).toBe(false);
    if (bad400.ok) return;
    expect(activateErrorMessage(bad400.status, bad400.message)).toBe(
      "Validation failed",
    );

    const fetch401 = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
    );
    const bad401 = await activatePartnerRequest({ type: "host" }, fetch401);
    expect(bad401.ok).toBe(false);
    if (bad401.ok) return;
    expect(activateErrorMessage(bad401.status, bad401.message)).toBe(
      "Sign in to activate your partner account.",
    );
  });
});

describe("shouldDeferDashboardRedirect", () => {
  it("defers /dashboard until shell ships", () => {
    expect(shouldDeferDashboardRedirect("/dashboard")).toBe(true);
    expect(shouldDeferDashboardRedirect("/host/events")).toBe(false);
  });
});
