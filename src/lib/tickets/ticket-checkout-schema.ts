import { z } from "zod";

export const ticketCheckoutInputSchema = z.object({
  eventId: z.string().uuid(),
  ticketId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
  buyerEmail: z.string().email().max(120),
  buyerName: z.string().min(1).max(120),
  idempotencyKey: z.string().uuid(),
  returnPath: z.string().min(1).max(500),
});

export type TicketCheckoutInput = z.infer<typeof ticketCheckoutInputSchema>;

export type TicketCheckoutResult = {
  stripeSessionUrl: string;
  orderId: string;
  shortId: string | null;
  walletAccessToken: string;
};

export function buildAttendeePayload(
  buyerEmail: string,
  buyerName: string,
  quantity: number,
): Array<{ email: string; full_name: string }> {
  return Array.from({ length: quantity }, () => ({
    email: buyerEmail,
    full_name: buyerName,
  }));
}
