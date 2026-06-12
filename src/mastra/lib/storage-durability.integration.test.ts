/**
 * VEB-MVP-010 / SAN-881 — proves Mastra suspend snapshots survive a cold start
 * when storage uses Supabase Postgres (same backing store as Vercel production).
 *
 * Run: VEB_MVP_010_INTEGRATION=1 infisical run --silent --env=dev --path=/ -- \
 *   npm test -- --run storage-durability.integration
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Mastra } from "@mastra/core/mastra";
import { PostgresStore } from "@mastra/pg";
import {
  closeMastraStorageForTests,
  getMastraStorage,
  resetMastraStorageForTests,
} from "./storage";
import { eventVenueBookingWorkflow } from "@/mastra/workflows/event-venue-booking-workflow";

const BOOKING_ID = "11111111-1111-4111-8111-111111111111";
const USER_ID = "22222222-2222-4222-8222-222222222222";
const ACTOR_ID = "33333333-3333-4333-8333-333333333333";
const WORKFLOW_NAME = "eventVenueBookingWorkflow";

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

function buildMastra() {
  return new Mastra({
    workflows: { eventVenueBookingWorkflow },
    storage: getMastraStorage(),
  });
}

async function deleteWorkflowSnapshot(runId: string): Promise<void> {
  const store = getMastraStorage();
  if (!(store instanceof PostgresStore)) return;
  const workflows = await store.getStore("workflows");
  if (!workflows?.deleteWorkflowRunById) return;
  try {
    await workflows.deleteWorkflowRunById({
      runId,
      workflowName: WORKFLOW_NAME,
    });
  } catch {
    // Best-effort — snapshot may already be gone after successful resume.
  }
}

const runIntegration =
  Boolean(process.env.DATABASE_URL) &&
  process.env.VEB_MVP_010_INTEGRATION === "1";

describe.runIf(runIntegration)("VEB-MVP-010 Postgres cold-start durability", () => {
  const runIdsToCleanup: string[] = [];

  beforeEach(() => {
    runIdsToCleanup.length = 0;
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("MASTRA_DEV_LIBSQL", "");
    resetMastraStorageForTests();
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

  afterEach(async () => {
    for (const runId of runIdsToCleanup) {
      await deleteWorkflowSnapshot(runId);
    }
    // Close any open Postgres pool(s) created during the test.
    await closeMastraStorageForTests();
    vi.unstubAllEnvs();
  });

  it(
    "uses PostgresStore and resumes suspended workflow after storage singleton reset",
    async () => {
      const info = vi.spyOn(console, "info").mockImplementation(() => {});

      const mastraBefore = buildMastra();
      const storageBefore = getMastraStorage();
      expect(storageBefore).toBeInstanceOf(PostgresStore);
      expect(info).toHaveBeenCalledWith("[mastra-storage] using Postgres");

      const workflowBefore = mastraBefore.getWorkflow(WORKFLOW_NAME);
      const run = await workflowBefore.createRun();
      const started = await run.start({
        inputData: { bookingId: BOOKING_ID, userId: USER_ID },
      });

      expect(started.status).toBe("suspended");
      const runId = run.runId;
      expect(runId).toBeTruthy();
      runIdsToCleanup.push(runId);

      // Simulate Vercel redeploy: drop singleton (new pool on next boot). Do not close
      // the first pool here — Mastra may still hold the store reference until resume.
      resetMastraStorageForTests();
      info.mockClear();

      const mastraAfter = buildMastra();
      expect(getMastraStorage()).toBeInstanceOf(PostgresStore);
      expect(info).toHaveBeenCalledWith("[mastra-storage] using Postgres");

      const workflowAfter = mastraAfter.getWorkflow(WORKFLOW_NAME);
      const reloaded = await workflowAfter.createRun({ runId });
      const resumed = await reloaded.resume({
        step: "suspend-for-admin-review",
        resumeData: { decision: "approved", actorId: ACTOR_ID },
      });

      expect(resumed.status).toBe("success");
      expect(applyEventBookingAdminDecision).toHaveBeenCalledWith(
        expect.anything(),
        BOOKING_ID,
        { decision: "approved", actorId: ACTOR_ID },
      );

      info.mockRestore();
    },
    120_000,
  );
});
