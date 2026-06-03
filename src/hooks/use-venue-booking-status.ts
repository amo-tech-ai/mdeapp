"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchLatestVenueBookingStatus } from "@/lib/venues/fetch-latest-venue-booking-status";
import {
  venueBookingStatusChip,
  venueKindForBookingQuery,
} from "@/lib/venues/venue-booking-status-display";
import { useSession } from "@/hooks/use-session";

export function useVenueBookingStatus(input: {
  placeId?: string;
  uiKind: "cafe" | "nightlife" | "restaurant";
}) {
  const { user, loading: sessionLoading } = useSession();
  const [statusRaw, setStatusRaw] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [fetchState, setFetchState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");

  const placeId = input.placeId?.trim();
  const venueKind = venueKindForBookingQuery(input.uiKind);

  useEffect(() => {
    if (sessionLoading) return;

    let cancelled = false;

    void (async () => {
      if (!user || !placeId) {
        if (!cancelled) {
          setStatusRaw(null);
          setRequestId(null);
          setFetchState("idle");
        }
        return;
      }

      if (!cancelled) setFetchState("loading");

      const supabase = createClient();
      const result = await fetchLatestVenueBookingStatus(supabase, {
        placeId,
        venueKind,
      });

      if (cancelled) return;

      if (!result.ok) {
        setStatusRaw(null);
        setRequestId(null);
        setFetchState("error");
        return;
      }

      if (!result.data) {
        setStatusRaw(null);
        setRequestId(null);
        setFetchState("ready");
        return;
      }

      setStatusRaw(result.data.status);
      setRequestId(result.data.requestId);
      setFetchState("ready");
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionLoading, user, placeId, venueKind]);

  const chip =
    statusRaw && fetchState === "ready"
      ? venueBookingStatusChip(statusRaw)
      : null;

  return {
    chip,
    requestId,
    loading: sessionLoading || fetchState === "loading",
    error: fetchState === "error",
  };
}
