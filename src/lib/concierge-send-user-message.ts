import { clearConciergeError, reportConciergeError } from "@/lib/concierge-error-store";
import { routerHandlerOrderFor, type RouterRoutingTarget } from "@/lib/router-intent";
import {
  clearConciergePendingSend,
  setConciergePendingSend,
} from "@/lib/concierge-pending-store";

export type ConciergeSendHandlers = {
  handleRentalMessage: (text: string) => Promise<boolean>;
  /** Wired when SAN-494 venue fast-path hook lands on main; optional until then. */
  handleEventVenueBookingMessage?: (text: string) => Promise<boolean>;
  handleEventMessage: (text: string) => Promise<boolean>;
  handleGroundedMessage: (text: string) => Promise<boolean>;
  handleRestaurantMessage: (text: string) => Promise<boolean>;
  onAgentSend: (text: string) => Promise<void>;
};

async function invokeConciergeHandler(
  target: RouterRoutingTarget,
  text: string,
  handlers: ConciergeSendHandlers,
): Promise<boolean> {
  switch (target) {
    case "rental":
      return handlers.handleRentalMessage(text);
    case "event_venue_booking":
      return (await handlers.handleEventVenueBookingMessage?.(text)) ?? false;
    case "event":
      return handlers.handleEventMessage(text);
    case "grounded":
      return handlers.handleGroundedMessage(text);
    case "restaurant":
      return handlers.handleRestaurantMessage(text);
    default:
      return false;
  }
}

/** Shared send pipeline — classify intent first, then fast-path handlers, then agent. */
export async function sendConciergeUserMessage(
  text: string,
  handlers: ConciergeSendHandlers,
): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  clearConciergeError();

  try {
    for (const target of routerHandlerOrderFor(trimmed)) {
      if (await invokeConciergeHandler(target, trimmed, handlers)) return;
    }

    setConciergePendingSend(true);
    await handlers.onAgentSend(trimmed);
  } catch (err) {
    console.error("[concierge-send]", err);
    clearConciergePendingSend();
    reportConciergeError();
  }
}
