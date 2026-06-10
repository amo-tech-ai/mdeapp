"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { EventBookingStatusChip } from "@/components/admin/event-bookings-status";

/** Shape returned by GET /api/admin/event-bookings (SAN-502 backend, #171). */
export type EventBookingRequest = {
  id: string;
  venueTitle: string;
  partySize: number | null;
  startDate: string;
  startTime: string | null;
  partnerStatus: string;
  bookingStatus: string;
  needsInfo: boolean;
  partnerNotes: string | null;
  eventType: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  createdAt: string;
};

type Decision = "approve" | "decline" | "needs_info";

type LoadResult =
  | { ok: true; requests: EventBookingRequest[] }
  | { ok: false; message: string };

async function fetchEventBookings(): Promise<LoadResult> {
  try {
    const res = await fetch("/api/admin/event-bookings");
    const json = (await res.json()) as {
      success?: boolean;
      requests?: EventBookingRequest[];
      error?: { message?: string };
    };
    if (!res.ok || !json.success) {
      return {
        ok: false,
        message: json.error?.message ?? "Could not load event requests.",
      };
    }
    return { ok: true, requests: json.requests ?? [] };
  } catch {
    return { ok: false, message: "Network error — please retry." };
  }
}

export function EventBookingsQueue() {
  const [requests, setRequests] = useState<EventBookingRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<EventBookingRequest | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const applyResult = useCallback((result: LoadResult) => {
    if (result.ok) {
      setError(null);
      setRequests(result.requests);
    } else {
      setError(result.message);
      setRequests([]);
    }
  }, []);

  const load = useCallback(async () => {
    applyResult(await fetchEventBookings());
  }, [applyResult]);

  useEffect(() => {
    let cancelled = false;
    // setState lives in the .then callback (not synchronous in the effect body).
    fetchEventBookings().then((result) => {
      if (!cancelled) applyResult(result);
    });
    return () => {
      cancelled = true;
    };
  }, [applyResult]);

  function closeDrawer() {
    setActive(null);
    setNote("");
  }

  async function decide(decision: Decision) {
    if (!active || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/event-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: active.id,
          decision,
          note: decision === "needs_info" ? note.trim() || undefined : undefined,
        }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        error?: { message?: string };
      };
      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Could not update the request.");
        return;
      }
      closeDrawer();
      await load();
    } catch {
      setError("Network error — please retry.");
    } finally {
      setBusy(false);
    }
  }

  if (requests === null) {
    return (
      <div className="flex flex-col gap-3" data-testid="admin-event-bookings-loading">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div data-testid="admin-event-bookings">
      {error ? (
        <p role="alert" className="mb-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {requests.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No event requests yet. Proposals from the request form land here.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {requests.map((request) => (
            <li key={request.id}>
              <Card size="sm" data-testid="event-booking-row">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle>{request.venueTitle}</CardTitle>
                      <CardDescription>
                        {request.eventType ?? "Event"} ·{" "}
                        {request.partySize ?? "?"} guests · {request.startDate}
                      </CardDescription>
                    </div>
                    <EventBookingStatusChip request={request} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-xs text-muted-foreground">
                      {request.contactName ?? "—"} · {request.contactEmail ?? "—"}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActive(request)}
                    >
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Sheet
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) closeDrawer();
        }}
      >
        <SheetContent
          side="right"
          className="w-full max-w-md overflow-y-auto sm:max-w-lg"
          data-testid="event-booking-drawer"
        >
          {active ? (
            <>
              <SheetHeader>
                <SheetTitle>{active.venueTitle}</SheetTitle>
                <SheetDescription>
                  {active.eventType ?? "Event"} · {active.partySize ?? "?"} guests
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-3 px-4 pb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <EventBookingStatusChip request={active} />
                </div>
                <p>
                  <span className="text-muted-foreground">When:</span>{" "}
                  {active.startDate}
                  {active.startTime ? ` · ${active.startTime}` : ""}
                </p>
                <p>
                  <span className="text-muted-foreground">Contact:</span>{" "}
                  {active.contactName ?? "—"} · {active.contactEmail ?? "—"}
                  {active.contactPhone ? ` · ${active.contactPhone}` : ""}
                </p>
                {active.partnerNotes ? (
                  <p>
                    <span className="text-muted-foreground">Notes:</span>{" "}
                    {active.partnerNotes}
                  </p>
                ) : null}
                <Textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={2}
                  placeholder="Note to send with “Request info”…"
                  aria-label="Request-info note"
                />
              </div>

              <SheetFooter className="flex-col gap-2">
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => decide("approve")}
                  data-testid="event-booking-approve"
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={busy}
                  onClick={() => decide("decline")}
                  data-testid="event-booking-decline"
                >
                  Decline
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() => decide("needs_info")}
                  data-testid="event-booking-needs-info"
                >
                  Request info
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
