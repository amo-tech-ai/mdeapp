import { describe, expect, it, vi, beforeEach } from "vitest";
import { Mastra } from "@mastra/core/mastra";
import { getMastraStorage } from "@/mastra/lib/storage";
import { eventVenueBookingWorkflow } from "@/mastra/workflows/event-venue-booking-workflow";

const BOOKING_ID = "11111111-1111-4111-8111-111111111111";
const USER_ID = "22222222-2222-4222-8222-222222222222";
const ACTOR_ID = "33333333-3333-4333-8333-333333333333";

vi.mock("@/lib/supabase/service", () => ({
  createServiceRoleClient: vi.fn(),
}));

vi.mock("@/lib/events/event-venue-booking-workflow-core", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("@/lib/events/event-venue-booking-workflow-core")
  >();
  return {
    ...actual,
    validateEventBookingForWorkflow: vi.fn(),
    attachWorkflowRunToBooking: vi.fn(),
    applyEventBookingAdminDecision: vi.fn(),
  };
});

import { createServiceRoleClient } from "@/lib/supabase/service";
import {
  validateEventBookingForWorkflow,
  attachWorkflowRunToBooking,
  applyEventBookingAdminDecision,
} from "@/lib/events/event-venue-booking-workflow-core";

function buildTestMastra() {
  return new Mastra({
    workflows: { eventVenueBookingWorkflow },
    storage: getMastraStorage(),
  });
}

describe("eventVenueBookingWorkflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createServiceRoleClient).mockReturnValue({} as never);
    vi.mocked(validateEventBookingForWorkflow).mockResolvedValue({
      ok: true,
      data: {
        bookingId: BOOKING_ID,
        userId: USER_ID,
        summary: "Birthday · 30 guests · 2026-07-15 · Mamacita",
        venueTitle: "Mamacita Provenza",
        partySize: 30,
        startDate: "2026-07-15",
      },
    });
    vi.mocked(attachWorkflowRunToBooking).mockResolvedValue({ ok: true });
    vi.mocked(applyEventBookingAdminDecision).mockResolvedValue({
      ok: true,
      data: { bookingId: BOOKING_ID, partnerStatus: "approved" },
    });
  });

  it("validates then suspends for admin review", async () => {
    const mastra = buildTestMastra();
    const workflow = mastra.getWorkflow("eventVenueBookingWorkflow");
    const run = await workflow.createRun();
    const result = await run.start({
      inputData: { bookingId: BOOKING_ID, userId: USER_ID },
    });

    expect(result.status).toBe("suspended");
    expect(validateEventBookingForWorkflow).toHaveBeenCalled();
    expect(attachWorkflowRunToBooking).toHaveBeenCalled();
    expect(applyEventBookingAdminDecision).not.toHaveBeenCalled();
  });

  it("resumes approve path and updates partner_status without a second insert", async () => {
    const mastra = buildTestMastra();
    const workflow = mastra.getWorkflow("eventVenueBookingWorkflow");
    const run = await workflow.createRun();

    await run.start({
      inputData: { bookingId: BOOKING_ID, userId: USER_ID },
    });

    const resumed = await run.resume({
      step: "suspend-for-admin-review",
      resumeData: { decision: "approved", actorId: ACTOR_ID },
    });

    expect(resumed.status).toBe("success");
    expect(applyEventBookingAdminDecision).toHaveBeenCalledWith(
      expect.anything(),
      BOOKING_ID,
      { decision: "approved", actorId: ACTOR_ID },
    );
  });

  it("resumes decline path", async () => {
    vi.mocked(applyEventBookingAdminDecision).mockResolvedValue({
      ok: true,
      data: { bookingId: BOOKING_ID, partnerStatus: "declined" },
    });

    const mastra = buildTestMastra();
    const workflow = mastra.getWorkflow("eventVenueBookingWorkflow");
    const run = await workflow.createRun();

    await run.start({
      inputData: { bookingId: BOOKING_ID, userId: USER_ID },
    });

    const resumed = await run.resume({
      step: "suspend-for-admin-review",
      resumeData: {
        decision: "declined",
        actorId: ACTOR_ID,
        declineReason: "Venue unavailable",
      },
    });

    expect(resumed.status).toBe("success");
    expect(applyEventBookingAdminDecision).toHaveBeenCalledWith(
      expect.anything(),
      BOOKING_ID,
      {
        decision: "declined",
        actorId: ACTOR_ID,
        declineReason: "Venue unavailable",
      },
    );
  });
});
