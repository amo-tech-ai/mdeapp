import { z } from "zod";

export const mapPinCategorySchema = z.enum([
  "rental",
  "restaurant",
  "event",
  "attraction",
  "venue",
  "grounded",
]);

export type MapPinCategory = z.infer<typeof mapPinCategorySchema>;

export const pinSourceSchema = z.enum([
  "sql",
  "places",
  "grounding",
  "mock",
  "tool",
]);

export type PinSource = z.infer<typeof pinSourceSchema>;

export const mapPinSchema = z.object({
  id: z.string().min(1),
  category: mapPinCategorySchema,
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  placeId: z.string().optional(),
  placeUri: z.string().url().optional(),
  source: pinSourceSchema,
  sourceRunId: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
});

export type MapPin = z.infer<typeof mapPinSchema>;
