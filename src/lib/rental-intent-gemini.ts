/**
 * GEM-RE-002 — Gemini structured rental intent (escalation path; regex remains default).
 */
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import {
  rentalIntentSchema,
  type RentalIntent,
} from "@/lib/rental-intent-schema";

const geminiRentalIntentObjectSchema = rentalIntentSchema;

const GEMINI_RENTAL_PROMPT = `Extract Medellín furnished rental search slots from the user message.
Return only structured slots — never invent listings, prices from listings, or availability.
If the query is not a rental search, set action to "skip" and confidence below 0.5.
Phase 1 UI is English; Spanish queries may still yield slots but action may be clarify.`;

export const parseRentalIntentWithGemini = async (
  text: string,
  options?: { signal?: AbortSignal },
): Promise<RentalIntent | null> => {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const { object } = await generateObject({
    model: google("gemini-3.5-flash"),
    schema: geminiRentalIntentObjectSchema,
    prompt: `${GEMINI_RENTAL_PROMPT}\n\nUser message: ${trimmed}`,
    abortSignal: options?.signal,
  });

  return rentalIntentSchema.parse(object);
};

/** Slots compared for regex/Gemini parity — null-normalized, stable order. */
const SLOT_KEYS = [
  "neighborhood",
  "minBedrooms",
  "maxPricePerNight",
  "stayType",
  "checkIn",
  "checkOut",
] as const;

/** Normalize Gemini + regex intents to comparable search slots (tests). */
export const rentalIntentSlotsKey = (intent: RentalIntent): string =>
  JSON.stringify(
    Object.fromEntries(SLOT_KEYS.map((key) => [key, intent[key] ?? null])),
  );
