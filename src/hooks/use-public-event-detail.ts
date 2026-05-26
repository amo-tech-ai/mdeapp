"use client";

import { useCallback, useEffect, useState } from "react";
import type { PublicEventDetail } from "@/lib/events/types";

export type PublicEventLoadState = "idle" | "loading" | "ready" | "error";

export function usePublicEventDetail(eventId: string | null) {
  const [event, setEvent] = useState<PublicEventDetail | null>(null);
  const [state, setState] = useState<PublicEventLoadState>("idle");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (id: string) => {
    setError(null);
    try {
      setState("loading");
      const res = await fetch(`/api/events/${encodeURIComponent(id)}/public`);
      if (!res.ok) {
        setEvent(null);
        setState("error");
        setError(res.status === 404 ? "Event not found" : "Could not load event");
        return;
      }
      const data = (await res.json()) as { event: PublicEventDetail };
      setEvent(data.event);
      setState("ready");
    } catch {
      setEvent(null);
      setState("error");
      setError("Could not load event");
    }
  }, []);

  useEffect(() => {
    if (!eventId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on sheet eventId change
    void load(eventId);
  }, [eventId, load]);

  return {
    event: eventId ? event : null,
    state: eventId ? state : "idle",
    error: eventId ? error : null,
    reload: () => {
      if (eventId) void load(eventId);
    },
  };
}
