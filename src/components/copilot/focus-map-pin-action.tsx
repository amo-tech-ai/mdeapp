"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { useMapContext } from "@/platform/maps/map-context";

/** Frontend tool: agent pans map to a pin by id (F50). */
export function FocusMapPinAction() {
  const { panToPin, pins } = useMapContext();

  useCopilotAction({
    name: "focusMapPin",
    description:
      "Pan the map to highlight a listing or place pin by pinId. Use when the user asks to show a result on the map.",
    parameters: [
      {
        name: "pinId",
        type: "string",
        description: "Map pin id (often matches rental listing id)",
        required: true,
      },
    ],
    handler: async ({ pinId }) => {
      const resolved =
        pins.find((p) => p.id === pinId)?.id ??
        pins.find((p) => p.id === `rental-${pinId}`)?.id;
      if (!resolved) {
        return `No pin with id ${pinId} on the map yet. Ask the user to run a search first.`;
      }
      panToPin(resolved);
      return `Focused map on pin ${resolved}`;
    },
  });

  return null;
}
