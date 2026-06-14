import {
  venueLeadInputSchema,
  type VenueLeadInput,
  type VenueLeadResult,
} from "./venue-lead-schema";

/**
 * SAN-661 · MKT — For Venues landing (/venues).
 * Client helper: validates then POSTs to /api/partners/venue-leads.
 */
export async function submitVenueLead(
  input: VenueLeadInput,
): Promise<VenueLeadResult> {
  const payload = venueLeadInputSchema.parse(input);

  const res = await fetch("/api/partners/venue-leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await res.json()) as {
    success?: boolean;
    leadId?: string;
    message?: string;
    error?: { message?: string };
  };

  if (!res.ok || !json.success || !json.leadId) {
    throw new Error(json.error?.message ?? "Could not send your request");
  }

  return {
    leadId: json.leadId,
    message: json.message ?? "Thanks — we'll be in touch within 1 business day.",
  };
}
