"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlaceDetailsDto } from "@/lib/place-details";

type PlaceDetailsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: PlaceDetailsDto }
  | { status: "error" };

export function usePlaceDetails(placeId?: string) {
  const [state, setState] = useState<PlaceDetailsState>({ status: "idle" });

  const load = useCallback(async (id: string) => {
    setState({ status: "loading" });
    try {
      const res = await fetch(
        `/api/places/detail?placeId=${encodeURIComponent(id)}`,
      );
      if (!res.ok) {
        setState({ status: "error" });
        return;
      }
      const data = (await res.json()) as PlaceDetailsDto;
      setState({ status: "ready", data });
    } catch {
      setState({ status: "error" });
    }
  }, []);

  useEffect(() => {
    if (!placeId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on placeId change
    void load(placeId);
  }, [placeId, load]);

  if (!placeId) return { status: "idle" } as const;
  return state;
}
