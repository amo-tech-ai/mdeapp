"use client";

import { useEffect, useRef } from "react";
import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { useMapContext } from "@/platform/maps/map-context";

const focusMapPinParams = z.object({
  pinId: z.string().describe("Map pin id (often rental-{listingId})"),
});

/** SAN-890 · CK-V2-004 — focusMapPin via useFrontendTool (flag on). */
export function useFocusMapPinActionV2() {
  const { panToPin, pins } = useMapContext();

  const pinsRef = useRef(pins);
  const panToPinRef = useRef(panToPin);
  useEffect(() => {
    pinsRef.current = pins;
    panToPinRef.current = panToPin;
  }, [pins, panToPin]);

  useFrontendTool(
    {
      name: "focusMapPin",
      description:
        "Pan the map to highlight a listing or place pin by pinId. Use when the user asks to show a result on the map.",
      parameters: focusMapPinParams,
      handler: async ({ pinId }) => {
        const currentPins = pinsRef.current;
        const resolved =
          currentPins.find((p) => p.id === pinId)?.id ??
          currentPins.find((p) => p.id === `rental-${pinId}`)?.id;
        if (!resolved) {
          return `No pin with id ${pinId} on the map yet. Ask the user to run a search first.`;
        }
        panToPinRef.current(resolved);
        return `Focused map on pin ${resolved}`;
      },
    },
    [],
  );
}

/** Mount inside MapsShell — requires MapContextProvider. */
export function FocusMapPinActionV2() {
  useFocusMapPinActionV2();
  return null;
}

