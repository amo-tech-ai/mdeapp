"use client";

import { useEffect, useRef } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { useMapContext } from "@/platform/maps/map-context";

/**
 * Frontend tool: agent pans map to a pin by id (F50).
 *
 * Registers the action exactly once (`[]` deps). The handler reads the latest
 * `pins`/`panToPin` through refs, so a stable registration never goes stale.
 * This avoids the v1 re-registration render loop that an inline
 * `useCopilotAction({...})` with no dependency array would trigger (a new action
 * object every render → re-register → re-render), which previously flooded
 * `POST /api/copilotkit`.
 */
export function FocusMapPinAction() {
  const { panToPin, pins } = useMapContext();

  const pinsRef = useRef(pins);
  const panToPinRef = useRef(panToPin);
  useEffect(() => {
    pinsRef.current = pins;
    panToPinRef.current = panToPin;
  }, [pins, panToPin]);

  useCopilotAction(
    {
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

  return null;
}
