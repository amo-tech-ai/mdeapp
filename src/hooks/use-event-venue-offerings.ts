"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { EventVenueOfferingsPayload } from "@/lib/venues/event-venue-offerings-types";
import { fetchEventVenueOfferingsByPlaceId } from "@/lib/venues/fetch-event-venue-offerings";

export function useEventVenueOfferings(placeId?: string | null) {
  const [payload, setPayload] = useState<EventVenueOfferingsPayload | null>(
    null,
  );
  const [fetchState, setFetchState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");

  const normalizedPlaceId = placeId?.trim() ?? "";

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!normalizedPlaceId) {
        if (!cancelled) {
          setPayload(null);
          setFetchState("idle");
        }
        return;
      }

      if (!cancelled) setFetchState("loading");

      const supabase = createClient();
      const result = await fetchEventVenueOfferingsByPlaceId(
        supabase,
        normalizedPlaceId,
      );

      if (cancelled) return;

      if (!result.ok) {
        setPayload(null);
        setFetchState("error");
        return;
      }

      setPayload(result.data);
      setFetchState("ready");
    })();

    return () => {
      cancelled = true;
    };
  }, [normalizedPlaceId]);

  return {
    payload,
    hasOfferings: Boolean(payload?.offerings.length),
    loading: fetchState === "loading",
    error: fetchState === "error",
  };
}
