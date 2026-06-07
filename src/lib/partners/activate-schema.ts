import { z } from "zod";
import { PARTNER_TYPES } from "@/lib/partners/partner-types";

const BLOCKED_SETTING_KEYS = new Set([
  "status",
  "tier",
  "completion_score",
  "activated_at",
  "__proto__",
  "constructor",
  "prototype",
]);

export function sanitizePartnerSettings(
  settings: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!settings) return {};
  const out = Object.create(null) as Record<string, unknown>;
  for (const [key, value] of Object.entries(settings)) {
    if (BLOCKED_SETTING_KEYS.has(key.toLowerCase())) continue;
    out[key] = value;
  }
  return out;
}

export const activatePartnerInputSchema = z
  .object({
    type: z.enum(PARTNER_TYPES),
    draftId: z.string().uuid().optional(),
    settings: z.record(z.string(), z.unknown()).optional(),
  })
  .transform((data) => ({
    ...data,
    settings: sanitizePartnerSettings(data.settings),
  }));

/** Pre-transform input — `settings` optional for callers and unit tests. */
export type ActivatePartnerInput = z.input<typeof activatePartnerInputSchema>;
