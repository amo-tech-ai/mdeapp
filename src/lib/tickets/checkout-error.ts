export type CheckoutErrorKind = "sold_out" | "expired" | "network" | "generic";

export type ClassifiedCheckoutError = {
  kind: CheckoutErrorKind;
  heading: string;
  detail: string;
  canRetry: boolean;
};

const SOLD_OUT_RE = /sold.?out|no.*ticket|ticket.*unavailable|qty.*exceed|capacity/i;
const EXPIRED_RE =
  /expir|session.*invalid|invalid.*session|session.*not.*found|not.*found.*session/i;

export function classifyCheckoutError(
  message: string | undefined,
  code?: string,
  isNetworkError?: boolean,
): ClassifiedCheckoutError {
  if (isNetworkError) {
    return {
      kind: "network",
      heading: "Connection error",
      detail: "Your payment was not submitted. Safe to try again.",
      canRetry: true,
    };
  }
  const msg = message ?? "";
  if (
    SOLD_OUT_RE.test(msg) ||
    code === "TIER_SOLD_OUT" ||
    code === "OUT_OF_STOCK"
  ) {
    return {
      kind: "sold_out",
      heading: "Tickets are sold out",
      detail:
        "These tickets sold out while you were checking out. No charge was made — try another tier or join the waitlist.",
      canRetry: false,
    };
  }
  if (EXPIRED_RE.test(msg) || code === "SESSION_EXPIRED") {
    return {
      kind: "expired",
      heading: "Session expired",
      detail: "Please close and try again.",
      canRetry: false,
    };
  }
  return {
    kind: "generic",
    heading: "Checkout failed",
    detail: msg || "Something went wrong. Your payment was not submitted.",
    canRetry: true,
  };
}
