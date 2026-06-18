/**
 * GEM-RE-002 — Single RentalIntentSchema for regex parser, API, Mastra tool, render contract.
 */
import { z } from "zod";
import type { ConciergeWorkingMemory } from "@/lib/types";
import {
  buildRentalSearchParams,
  looksLikeRentalSearch,
  scoreRentalQuery,
  type RentalSearchApiParams,
} from "@/lib/rental-query-parser";

export const rentalIntentSchema = z.object({
  neighborhood: z.string().optional(),
  minBedrooms: z.number().int().min(0).optional(),
  maxPricePerNight: z.number().positive().optional(),
  stayType: z.enum(["nightly", "monthly", "total_trip"]).optional(),
  checkIn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  checkOut: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  queryText: z.string().optional(),
  confidence: z.number().min(0).max(1),
  action: z.enum(["search_now", "clarify", "skip"]),
});

export type RentalIntent = z.infer<typeof rentalIntentSchema>;

/** Tool/API/render contract — search slots without routing metadata. */
export const rentalSearchParamsSchema = rentalIntentSchema
  .omit({ confidence: true, action: true })
  .extend({
    limit: z.number().int().min(1).max(20).optional(),
  });

export type RentalSearchParams = z.infer<typeof rentalSearchParamsSchema>;

const HERO_PROMPT = "1BR in Laureles under $80/night";

/** Normalize user text + working memory into one schema shape. */
export function parseRentalIntentFromText(
  text: string,
  memory: ConciergeWorkingMemory = {},
): RentalIntent | null {
  if (!looksLikeRentalSearch(text)) return null;

  const signals = scoreRentalQuery(text);
  const params = buildRentalSearchParams(text, memory);

  if (!params) {
    return rentalIntentSchema.parse({
      neighborhood: signals.neighborhood,
      minBedrooms: signals.minBedrooms,
      maxPricePerNight: signals.maxPricePerNight,
      stayType: signals.budgetType,
      checkIn: signals.checkIn,
      checkOut: signals.checkOut,
      confidence: signals.confidence,
      action: signals.confidence < 0.6 ? "clarify" : "skip",
    });
  }

  return rentalIntentSchema.parse({
    neighborhood: params.neighborhood,
    minBedrooms: params.minBedrooms,
    maxPricePerNight: params.maxPricePerNight,
    stayType: params.stayType,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    queryText: params.queryText,
    confidence: signals.confidence,
    action: "search_now",
  });
}

export function rentalIntentToSearchParams(
  intent: RentalIntent,
  limit = 8,
): RentalSearchApiParams {
  return {
    neighborhood: intent.neighborhood,
    minBedrooms: intent.minBedrooms,
    maxPricePerNight: intent.maxPricePerNight,
    checkIn: intent.checkIn,
    checkOut: intent.checkOut,
    stayType: intent.stayType,
    queryText: intent.queryText,
    limit,
  };
}

/** RE-021 row 1 — canonical hero slots for parity tests. */
export function heroRentalIntent(): RentalIntent {
  const parsed = parseRentalIntentFromText(HERO_PROMPT, {});
  if (!parsed || parsed.action !== "search_now") {
    throw new Error("hero rental intent parse failed");
  }
  return parsed;
}
