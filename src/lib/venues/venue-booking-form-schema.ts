import { z } from "zod";

export const venueBookingKindSchema = z.enum([
  "cafe",
  "restaurant",
  "nightclub",
]);

export type VenueBookingKind = z.infer<typeof venueBookingKindSchema>;

export const venueBookingRequestSchema = z.object({
  venueKind: venueBookingKindSchema,
  placeId: z.string().min(8).max(256),
  restaurantId: z.string().uuid().nullable().optional(),
  requestedAt: z.string().datetime(),
  partySize: z.coerce.number().int().min(1).max(50),
  contactName: z.string().trim().min(1).max(120),
  contactEmail: z.string().trim().email().max(120),
  contactPhone: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(2000).optional(),
  venueTitle: z.string().trim().max(200).optional(),
  idempotencyKey: z.string().trim().min(8).max(64).optional(),
});

export type VenueBookingRequestInput = z.infer<typeof venueBookingRequestSchema>;

export type VenueBookingSubmitResult = {
  requestId: string;
  message: string;
};
