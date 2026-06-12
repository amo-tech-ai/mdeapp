import { z } from "zod";

/**
 * SAN-661 · MKT — For Venues landing (/venues) inline lead form.
 *
 * Captures a venue owner's interest without forcing account creation, so warm
 * leads from the landing page are not lost to a separate /contact navigation.
 * Lands in public.leads via /api/partners/venue-leads (intent "host",
 * metadata.partner_kind "venue") so Patricia sees it in the CRM.
 */

export const VENUE_LEAD_TYPES = [
  "restaurant",
  "cafe",
  "nightclub",
  "space",
  "other",
] as const;

export type VenueLeadType = (typeof VENUE_LEAD_TYPES)[number];

export const venueLeadInputSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(160),
  venueName: z.string().trim().min(1, "Please enter your venue name").max(160),
  venueType: z.enum(VENUE_LEAD_TYPES),
  message: z.string().trim().max(2000).optional(),
  /** Page variant for attribution (?v=restaurant etc.). */
  variant: z.string().trim().max(40).optional(),
});

export type VenueLeadInput = z.infer<typeof venueLeadInputSchema>;

export type VenueLeadResult = {
  leadId: string;
  message: string;
};
