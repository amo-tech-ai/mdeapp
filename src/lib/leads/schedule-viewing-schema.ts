import { z } from "zod";

export const scheduleViewingInputSchema = z.object({
  listingId: z.string().min(1).max(120),
  listingTitle: z.string().min(1).max(200),
  neighborhood: z.string().min(1).max(120),
  name: z.string().min(1).max(120),
  email: z.string().email().max(120),
  phone: z.string().max(40).optional(),
  preferredAt: z.string().min(1).max(40).optional(),
});

export type ScheduleViewingInput = z.infer<typeof scheduleViewingInputSchema>;

export type ScheduleViewingResult = {
  leadId: string;
  message: string;
};
