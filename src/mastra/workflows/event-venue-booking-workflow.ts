import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/service";
import {
  applyEventBookingAdminDecision,
  attachWorkflowRunToBooking,
  validateEventBookingForWorkflow,
} from "@/lib/events/event-venue-booking-workflow-core";

const workflowInputSchema = z.object({
  bookingId: z.string().uuid(),
  userId: z.string().uuid(),
  threadId: z.string().optional(),
});

const validatedBookingSchema = z.object({
  bookingId: z.string().uuid(),
  userId: z.string().uuid(),
  summary: z.string(),
  venueTitle: z.string(),
  partySize: z.number().nullable(),
  startDate: z.string(),
});

const adminReviewResumeSchema = z.object({
  decision: z.enum(["approved", "declined"]),
  actorId: z.string().uuid(),
  declineReason: z.string().max(500).optional(),
});

const validateBookingStep = createStep({
  id: "validate-booking",
  description:
    "Loads the existing event proposal row and confirms it is pending review.",
  inputSchema: workflowInputSchema,
  outputSchema: validatedBookingSchema,
  execute: async ({ inputData, runId }) => {
    const supabase = createServiceRoleClient();
    if (!supabase) {
      throw new Error("Supabase service role unavailable for workflow validation");
    }

    const validated = await validateEventBookingForWorkflow(
      supabase,
      inputData.bookingId,
      inputData.userId,
    );
    if (!validated.ok) {
      throw new Error(validated.message);
    }

    if (runId) {
      const attached = await attachWorkflowRunToBooking(
        supabase,
        inputData.bookingId,
        runId,
      );
      if (!attached.ok) {
        throw new Error(attached.message);
      }
    }

    return validated.data;
  },
});

const suspendForAdminReviewStep = createStep({
  id: "suspend-for-admin-review",
  description: "Pauses until Patricia approves or declines in the admin queue.",
  inputSchema: validatedBookingSchema,
  resumeSchema: adminReviewResumeSchema,
  suspendSchema: z.object({
    reason: z.literal("admin_review"),
    bookingId: z.string().uuid(),
    summary: z.string(),
  }),
  outputSchema: z.object({
    bookingId: z.string().uuid(),
    decision: z.enum(["approved", "declined"]),
    actorId: z.string().uuid(),
    declineReason: z.string().optional(),
    partnerStatus: z.string(),
    notified: z.boolean(),
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    if (!resumeData) {
      return await suspend({
        reason: "admin_review",
        bookingId: inputData.bookingId,
        summary: inputData.summary,
      });
    }

    const supabase = createServiceRoleClient();
    if (!supabase) {
      throw new Error("Supabase service role unavailable for admin decision");
    }

    const applied = await applyEventBookingAdminDecision(
      supabase,
      inputData.bookingId,
      resumeData,
    );
    if (!applied.ok) {
      throw new Error(applied.message);
    }

    return {
      bookingId: applied.data.bookingId,
      decision: resumeData.decision,
      actorId: resumeData.actorId,
      declineReason: resumeData.declineReason,
      partnerStatus: applied.data.partnerStatus,
      notified: false,
    };
  },
});

const notifyAdminStep = createStep({
  id: "notify-admin",
  description: "Optional stub — Patricia ops notification lands in a later slice.",
  inputSchema: z.object({
    bookingId: z.string().uuid(),
    decision: z.enum(["approved", "declined"]),
    actorId: z.string().uuid(),
    declineReason: z.string().optional(),
    partnerStatus: z.string(),
    notified: z.boolean(),
  }),
  outputSchema: z.object({
    bookingId: z.string().uuid(),
    partnerStatus: z.string(),
    notified: z.boolean(),
  }),
  execute: async ({ inputData }) => ({
    bookingId: inputData.bookingId,
    partnerStatus: inputData.partnerStatus,
    notified: false,
  }),
});

const eventVenueBookingWorkflow = createWorkflow({
  id: "event-venue-booking-workflow",
  description:
    "Patricia admin review orchestration for event venue proposals (Mode A — no insert).",
  inputSchema: workflowInputSchema,
  outputSchema: z.object({
    bookingId: z.string().uuid(),
    partnerStatus: z.string(),
    notified: z.boolean(),
  }),
})
  .then(validateBookingStep)
  .then(suspendForAdminReviewStep)
  .then(notifyAdminStep);

eventVenueBookingWorkflow.commit();

export {
  eventVenueBookingWorkflow,
  validateBookingStep,
  suspendForAdminReviewStep,
  notifyAdminStep,
};
