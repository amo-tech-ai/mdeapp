import { z } from "zod";

const walletAttendeeSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().nullable(),
  email: z.string().nullable(),
  status: z.string(),
  qr_token: z.string(),
});

const walletOrderSchema = z.object({
  id: z.string().uuid(),
  short_id: z.string().nullable(),
  status: z.string(),
  total_cents: z.number(),
  currency: z.string(),
  buyer_name: z.string().nullable(),
  buyer_email: z.string().nullable(),
  quantity: z.number(),
  stripe_session_id: z.string().nullable().optional(),
});

const walletEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  event_start_time: z.string(),
  event_end_time: z.string().nullable().optional(),
});

export const walletOrderPayloadSchema = z.object({
  order: walletOrderSchema,
  event: walletEventSchema,
  attendees: z.array(walletAttendeeSchema),
});

export type WalletAttendee = z.infer<typeof walletAttendeeSchema>;
export type WalletOrder = z.infer<typeof walletOrderSchema>;
export type WalletEvent = z.infer<typeof walletEventSchema>;
export type WalletOrderPayload = z.infer<typeof walletOrderPayloadSchema>;

export type BuyerOrderListItem = {
  id: string;
  shortId: string | null;
  status: string;
  totalCents: number;
  currency: string;
  quantity: number;
  eventName: string;
  eventStartTime: string;
  imageUrl: string | null;
  venue: string | null;
};
