import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CafeDetailPanel } from "@/components/cafe/cafe-detail-panel";
import type { CafeVenueDetail } from "@/components/chat/rental-ui-context";

vi.mock("@/hooks/use-place-details", () => ({
  usePlaceDetails: () => ({ status: "error" as const }),
}));

vi.mock("@copilotkit/react-core", () => ({
  useCopilotChat: () => ({ appendMessage: vi.fn(), isLoading: false }),
}));

vi.mock("@/components/chat/rental-ui-context", () => ({
  useRentalUi: () => ({
    closeCafeDetail: vi.fn(),
    openCafeDetail: vi.fn(),
    openCafeBooking: vi.fn(),
  }),
}));

vi.mock("@/platform/maps/map-context", () => ({
  useMapContext: () => ({ panToPin: vi.fn() }),
}));

const detail: CafeVenueDetail = {
  kind: "cafe",
  pinId: "cafe-1",
  placeId: "ChIJTest1234567890",
  title: "Test Café",
  rating: 4.5,
  userRatingCount: 10,
  priceLevel: "PRICE_LEVEL_MODERATE",
  primaryType: "cafe",
  openNow: true,
  formattedAddress: "Calle 10",
  mapsUrl: "https://maps.google.com",
  summary: "A test café",
};

describe("CafeDetailPanel enrichment fallback", () => {
  it("shows place-details-unavailable when enrichment errors", () => {
    const html = renderToStaticMarkup(
      <CafeDetailPanel detail={detail} siblings={[detail]} />,
    );
    expect(html).toContain('data-testid="place-details-unavailable"');
  });
});
