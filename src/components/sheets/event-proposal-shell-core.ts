import {
  eventProposalSchema,
  type EventProposalInput,
} from "@/lib/events/event-proposal-form-schema";
import type { EventProposalShellTarget } from "@/components/chat/rental-ui-context";

/** SAN-496 · EVT-037 — controlled form state for the request-proposal modal. */
export type EventProposalFormState = {
  eventType: string;
  startDate: string;
  partySize: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
};

export const emptyEventProposalForm: EventProposalFormState = {
  eventType: "",
  startDate: "",
  partySize: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  notes: "",
};

/** Map the form + venue target to the POST body for /api/events/proposal. */
export function buildEventProposalRequest(
  form: EventProposalFormState,
  target: EventProposalShellTarget,
): EventProposalInput {
  return {
    partnerLocationId: target.partnerLocationId,
    partnerId: target.partnerId,
    eventType: form.eventType.trim(),
    startDate: form.startDate,
    partySize: Number(form.partySize),
    contactName: form.contactName.trim(),
    contactEmail: form.contactEmail.trim(),
    contactPhone: form.contactPhone.trim() || undefined,
    notes: form.notes.trim() || undefined,
    venueTitle: target.venueTitle,
  };
}

function humanizeField(path: PropertyKey | undefined): string {
  switch (path) {
    case "eventType":
      return "Event type";
    case "startDate":
      return "Date";
    case "partySize":
      return "Guest count";
    case "contactName":
      return "Name";
    case "contactEmail":
      return "Email";
    default:
      return "Form";
  }
}

/** Validate the form against the shared schema before the network call. */
export function validateEventProposal(
  form: EventProposalFormState,
  target: EventProposalShellTarget,
):
  | { ok: true; body: EventProposalInput }
  | { ok: false; message: string } {
  const parsed = eventProposalSchema.safeParse(
    buildEventProposalRequest(form, target),
  );
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = humanizeField(issue?.path[0]);
    return { ok: false, message: `${field}: ${issue?.message ?? "invalid"}` };
  }
  return { ok: true, body: parsed.data };
}
