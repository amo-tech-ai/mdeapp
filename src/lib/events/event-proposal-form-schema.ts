import { z } from "zod";

/** SAN-865 / SAN-496 — event venue proposal fields (bookings table, not venue_booking_requests). */
export const eventProposalSchema = z.object({
  partnerLocationId: z.string().uuid(),
  partnerId: z.string().uuid().optional(),
  eventType: z.string().trim().min(1).max(80),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/)
    .optional(),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/)
    .optional(),
  partySize: z.coerce.number().int().min(20).max(500),
  budgetCents: z.coerce.number().int().min(0).optional(),
  requirements: z.array(z.string().trim().max(120)).max(12).optional(),
  notes: z.string().trim().max(2000).optional(),
  contactName: z.string().trim().min(1).max(120),
  contactEmail: z.string().trim().email().max(120),
  contactPhone: z.string().trim().max(40).optional(),
  venueTitle: z.string().trim().max(200).optional(),
  idempotencyKey: z.string().trim().min(8).max(64).optional(),
});

export type EventProposalInput = z.infer<typeof eventProposalSchema>;

export type EventProposalSubmitResult = {
  bookingId: string;
  message: string;
};
