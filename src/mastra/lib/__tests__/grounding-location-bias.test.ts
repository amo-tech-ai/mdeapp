import { describe, expect, it } from "vitest";
import {
  locationBiasFromMapUi,
  resolveGroundingLocationBias,
} from "../grounding-location-bias";

describe("grounding location bias", () => {
  it("prefers explicit tool input", () => {
    const bias = resolveGroundingLocationBias({
      locationBias: { latitude: 6.2, longitude: -75.5 },
    });
    expect(bias).toEqual({ latitude: 6.2, longitude: -75.5 });
  });

  it("reads mapUi.viewport", () => {
    const bias = locationBiasFromMapUi({
      selectedPinId: null,
      activeCategories: ["grounded"],
      viewport: { lat: 6.25, lng: -75.58, zoom: 13 },
    });
    expect(bias).toEqual({ latitude: 6.25, longitude: -75.58 });
  });
});
