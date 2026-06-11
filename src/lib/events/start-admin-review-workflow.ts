import type { AdminReviewResumeData } from "@/lib/events/event-venue-booking-workflow-core";
import { mastra } from "@/mastra/index";

export type StartAdminReviewInput = {
  bookingId: string;
  userId: string;
  threadId?: string;
};

export type StartAdminReviewResult = {
  runId: string;
  status: string;
  suspendedStepId?: string;
};

/** Start Patricia-review workflow after Camila's proposal row exists (Mode A). */
export async function startAdminReviewWorkflow(
  input: StartAdminReviewInput,
): Promise<StartAdminReviewResult | null> {
  try {
    const workflow = mastra.getWorkflow("eventVenueBookingWorkflow");
    const run = await workflow.createRun();
    const result = await run.start({ inputData: input });

    return {
      runId: run.runId,
      status: result.status,
      suspendedStepId:
        result.status === "suspended" ? "suspend-for-admin-review" : undefined,
    };
  } catch (error) {
    console.warn(
      "[startAdminReviewWorkflow] skipped:",
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

/** Resume a suspended admin-review run (SAN-502 admin PATCH will call this). */
export async function resumeEventVenueBookingWorkflow(
  runId: string,
  resumeData: AdminReviewResumeData,
): Promise<{ status: string } | null> {
  try {
    const workflow = mastra.getWorkflow("eventVenueBookingWorkflow");
    const run = await workflow.createRun({ runId });
    const result = await run.resume({
      step: "suspend-for-admin-review",
      resumeData,
    });
    return { status: result.status };
  } catch (error) {
    console.warn(
      "[resumeEventVenueBookingWorkflow] failed:",
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}
