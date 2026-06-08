import { clearConciergeError, reportConciergeError } from "@/lib/concierge-error-store";
import {
  clearConciergePendingSend,
  setConciergePendingSend,
} from "@/lib/concierge-pending-store";

export type ConciergeSendHandlers = {
  handleRentalMessage: (text: string) => Promise<boolean>;
  handleEventMessage: (text: string) => Promise<boolean>;
  handleGroundedMessage: (text: string) => Promise<boolean>;
  handleRestaurantMessage: (text: string) => Promise<boolean>;
  onAgentSend: (text: string) => Promise<void>;
};

/** Shared send pipeline — rental → event → grounded → restaurant → agent. */
export async function sendConciergeUserMessage(
  text: string,
  handlers: ConciergeSendHandlers,
): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  clearConciergeError();

  try {
    if (await handlers.handleRentalMessage(trimmed)) return;
    if (await handlers.handleEventMessage(trimmed)) return;
    if (await handlers.handleGroundedMessage(trimmed)) return;
    if (await handlers.handleRestaurantMessage(trimmed)) return;

    setConciergePendingSend(true);
    await handlers.onAgentSend(trimmed);
  } catch (err) {
    console.error("[concierge-send]", err);
    clearConciergePendingSend();
    reportConciergeError();
  }
}
