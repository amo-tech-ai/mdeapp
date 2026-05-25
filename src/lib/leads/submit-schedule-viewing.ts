import {
  scheduleViewingInputSchema,
  type ScheduleViewingInput,
  type ScheduleViewingResult,
} from "./schedule-viewing-schema";

export async function submitScheduleViewing(
  input: ScheduleViewingInput,
): Promise<ScheduleViewingResult> {
  const payload = scheduleViewingInputSchema.parse(input);

  const res = await fetch("/api/leads/schedule-viewing", {
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
    throw new Error(json.error?.message ?? "Could not schedule viewing");
  }

  return {
    leadId: json.leadId,
    message: json.message ?? "Viewing request received — we will reach out within 24h.",
  };
}
