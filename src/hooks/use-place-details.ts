"use client";

import { useEffect, useState } from "react";
import type { PlaceDetailsDto } from "@/lib/place-details";
import { fetchPlaceDetailsDto } from "@/lib/place-details-client-fetch";

type PlaceDetailsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: PlaceDetailsDto }
  | { status: "error" };

export function usePlaceDetails(placeId?: string) {
  const [state, setState] = useState<PlaceDetailsState>({ status: "idle" });

  useEffect(() => {
    if (!placeId) return;

    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      setState({ status: "loading" });
      const result = await fetchPlaceDetailsDto(placeId, controller.signal);
      if (cancelled || controller.signal.aborted) return;
      if (result === "error") {
        setState({ status: "error" });
        return;
      }
      setState({ status: "ready", data: result });
    };

    void run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [placeId]);

  if (!placeId) return { status: "idle" } as const;
  return state;
}
