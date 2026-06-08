import {
  ticketCheckoutInputSchema,
  type TicketCheckoutInput,
  type TicketCheckoutResult,
  buildAttendeePayload,
} from "./ticket-checkout-schema";

export class CheckoutApiError extends Error {
  readonly code: string | undefined;
  constructor(message: string, code?: string) {
    super(message);
    this.name = "CheckoutApiError";
    this.code = code;
  }
}

export async function submitTicketCheckout(
  input: TicketCheckoutInput,
): Promise<TicketCheckoutResult> {
  const payload = ticketCheckoutInputSchema.parse(input);

  const res = await fetch("/api/tickets/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await res.json()) as {
    success?: boolean;
    stripeSessionUrl?: string;
    orderId?: string;
    shortId?: string | null;
    walletAccessToken?: string;
    error?: { message?: string; code?: string };
  };

  if (
    !res.ok ||
    !json.success ||
    !json.stripeSessionUrl ||
    !json.orderId ||
    !json.walletAccessToken
  ) {
    throw new CheckoutApiError(
      json.error?.message ?? "Checkout failed",
      json.error?.code,
    );
  }

  return {
    stripeSessionUrl: json.stripeSessionUrl,
    orderId: json.orderId,
    shortId: json.shortId ?? null,
    walletAccessToken: json.walletAccessToken,
  };
}

export { buildAttendeePayload };
