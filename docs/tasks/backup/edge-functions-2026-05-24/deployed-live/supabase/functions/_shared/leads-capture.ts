/**
 * Pure helpers for chat lead capture — testable without Supabase client.
 */

export type LeadCaptureInsertInput = {
  userId: string | null;
  conversationId: string | null;
  intent: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  neighborhood?: string | null;
  budget_max?: number | null;
  move_in_date?: string | null;
  listing_id?: string | null;
};

export type LeadCaptureInsertRow = {
  user_id: string | null;
  conversation_id: string | null;
  intent: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  source: "chat_auto";
  metadata: Record<string, unknown>;
  status: "new";
};

export function buildLeadCaptureInsert(input: LeadCaptureInsertInput): LeadCaptureInsertRow {
  const metadata: Record<string, unknown> = {};
  if (input.neighborhood) metadata.neighborhood = input.neighborhood;
  if (input.budget_max != null) metadata.budget_max = input.budget_max;
  if (input.move_in_date) metadata.move_in_date = input.move_in_date;
  if (input.listing_id) metadata.apartment_id = input.listing_id;

  return {
    user_id: input.userId ?? null,
    conversation_id: input.conversationId ?? null,
    intent: input.intent,
    email: input.email ?? null,
    phone: input.phone ?? null,
    name: input.name ?? null,
    source: "chat_auto",
    metadata,
    status: "new",
  };
}
