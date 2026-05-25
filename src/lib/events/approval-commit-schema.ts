import { z } from "zod";
import { EventDraftStateSchema } from "@/lib/types";

export const ApprovalDecisionSchema = z.enum(["approved", "edit", "rejected"]);

export const ApprovalCommitInputSchema = z.object({
  decision: ApprovalDecisionSchema,
  draft: EventDraftStateSchema,
  approvalRequestId: z.string().uuid().optional(),
  reason: z.string().max(500).optional(),
});

export type ApprovalCommitInput = z.infer<typeof ApprovalCommitInputSchema>;
