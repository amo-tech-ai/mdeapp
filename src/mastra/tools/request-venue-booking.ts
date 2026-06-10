import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { insertVenueBookingRequest } from "@/lib/venues/venue-booking-core";
import {
  venueBookingKindSchema,
  venueBookingRequestSchema,
} from "@/lib/venues/venue-booking-form-schema";
import { getAuditUserId } from "@/mastra/lib/tool-audit-context";
import { withAudit } from "@/mastra/tools/audit-wrapper";
import { RiskLevel } from "@/mastra/tools/risk-levels";

const requestVenueBookingInputSchema = venueBookingRequestSchema;

const requestVenueBookingOutputSchema = z.object({
  success: z.boolean(),
  requestId: z.string().uuid().optional(),
  message: z.string(),
});

export type RequestVenueBookingInput = z.infer<
  typeof requestVenueBookingInputSchema
>;
export type RequestVenueBookingOutput = z.infer<
  typeof requestVenueBookingOutputSchema
>;

type AuditedVenueBookingInput = {
  booking: RequestVenueBookingInput;
  userId: string | null;
};

const executeRequestVenueBooking = withAudit(
  "request-venue-booking",
  RiskLevel.medium,
  async ({
    booking,
    userId,
  }: AuditedVenueBookingInput): Promise<RequestVenueBookingOutput> => {
    if (!userId) {
      return {
        success: false,
        message: "Sign in to request a booking.",
      };
    }

    const supabase = createServiceRoleClient();
    if (!supabase) {
      return {
        success: false,
        message: "Booking service is unavailable. Try again in a moment.",
      };
    }

    const result = await insertVenueBookingRequest(supabase, userId, booking);
    if (!result.ok) {
      return {
        success: false,
        message: result.message,
      };
    }

    return {
      success: true,
      requestId: result.data.requestId,
      message: result.data.message,
    };
  },
);

export const requestVenueBookingTool = createTool({
  id: "request-venue-booking",
  description:
    "Submit a table, café, or nightlife booking request after the user confirms details in the HITL card. Requires venueKind, placeId, requestedAt (ISO datetime), partySize, and contact fields. Never call before human confirmation — status stays pending until Patricia confirms by WhatsApp.",
  inputSchema: requestVenueBookingInputSchema,
  outputSchema: requestVenueBookingOutputSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: async (inputData: RequestVenueBookingInput, context?: any) => {
    const parsed = requestVenueBookingInputSchema.safeParse(inputData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed — check venue, date, party size, and contact fields.",
      };
    }

    const userId = getAuditUserId(context);
    return executeRequestVenueBooking(
      { booking: parsed.data, userId },
      { user_id: userId },
    );
  },
});

/** Re-export for agent prompts and tests. */
export { venueBookingKindSchema };
