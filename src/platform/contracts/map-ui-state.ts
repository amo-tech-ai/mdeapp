import { z } from "zod";
import { mapPinCategorySchema } from "./map-pin";

export const MapUiStateSchema = z.object({
  selectedPinId: z.string().nullable(),
  activeCategories: z.array(mapPinCategorySchema),
  viewport: z
    .object({ lat: z.number(), lng: z.number(), zoom: z.number() })
    .optional(),
  pinCountByCategory: z.record(z.string(), z.number()).optional(),
});

export type MapUiState = z.infer<typeof MapUiStateSchema>;
