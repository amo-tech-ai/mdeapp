"use client";

import QRCode from "react-qr-code";

type TicketQrDisplayProps = {
  value: string;
  label: string;
};

/** Door-ready QR from attendee `qr_token` JWT (SCREEN-015). */
export function TicketQrDisplay({ value, label }: TicketQrDisplayProps) {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-xl border border-border bg-white p-6"
      data-testid="my-tickets-qr"
    >
      <QRCode value={value} size={200} level="M" />
      <p className="text-center text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
