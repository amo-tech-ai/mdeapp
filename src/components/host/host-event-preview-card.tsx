"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EventDraftState } from "@/lib/types";
import { formatEventWhen } from "@/lib/tickets/wallet-format";

type HostEventPreviewCardProps = {
  draft: EventDraftState;
};

/** Live draft preview from co-agent state. */
export function HostEventPreviewCard({ draft }: HostEventPreviewCardProps) {
  const dateLabel = draft.dateIso
    ? formatEventWhen(draft.dateIso)
    : "Date TBD";
  const priceLabel =
    draft.ticketTiers.length > 0
      ? draft.ticketTiers.map((t) => `${t.name}: ${t.priceCop} COP`).join(" · ")
      : draft.priceMinCop > 0
        ? `From ${draft.priceMinCop} COP`
        : "Pricing TBD";

  return (
    <div
      data-testid="host-event-preview-card"
      className="mx-2 mb-2 rounded-lg border border-border bg-card p-4 shadow-sm sm:mx-4"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Live preview · {draft.status}
      </p>
      <h2 className="mt-1 font-serif text-lg font-semibold">
        {draft.title || "Your event"}
      </h2>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        <li>{dateLabel}</li>
        <li>
          {draft.venue || "Venue TBD"}
          {draft.neighborhood ? ` · ${draft.neighborhood}` : ""}
        </li>
        <li>
          {draft.capacity > 0 ? `${draft.capacity} cap` : "Capacity TBD"} · {priceLabel}
        </li>
      </ul>
      {draft.publishedSlug ? (
        <Link
          href={`/events/${draft.publishedSlug}`}
          className={cn(buttonVariants({ size: "sm" }), "mt-3 inline-flex")}
        >
          View live event →
        </Link>
      ) : null}
    </div>
  );
}
