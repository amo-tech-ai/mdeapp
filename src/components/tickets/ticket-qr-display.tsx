"use client";

import QRCode from "react-qr-code";
import { cn } from "@/lib/utils";

export type QrPassState = "valid" | "used" | "expired";

type TicketQrDisplayProps = {
  value: string;
  label: string;
  state?: QrPassState;
};

// skipcq: JS-0067
const OVERLAY_LABEL: Record<Exclude<QrPassState, "valid">, string> = {
  used: "Already scanned",
  expired: "Event ended",
};

/** Door-ready QR from attendee `qr_token` JWT (SCREEN-015). */
// skipcq: JS-0067
export function TicketQrDisplay({
  value,
  label,
  state = "valid",
}: TicketQrDisplayProps) {
  const inactive = state !== "valid";
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-xl border border-border bg-white p-6"
      data-testid="my-tickets-qr"
      data-qr-state={state}
    >
      <div className="relative">
        <div className={cn(inactive && "opacity-30 grayscale")}>
          <QRCode value={value} size={200} level="M" />
        </div>
        {inactive ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            data-testid="my-tickets-qr-overlay"
          >
            <span className="rounded-md bg-foreground/80 px-3 py-1 text-sm font-medium text-background">
              {OVERLAY_LABEL[state]}
            </span>
          </div>
        ) : null}
      </div>
      <p className="text-center text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
