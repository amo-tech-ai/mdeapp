"use client";

import { MapPin, Share2, Wallet } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TicketPassActionsProps = {
  eventName: string;
  /** Address used to build the maps deep-link; null hides Directions. */
  directionsQuery: string | null;
  /** URL to share back to this pass. */
  shareUrl: string;
};

export function TicketPassActions({
  eventName,
  directionsQuery,
  shareUrl,
}: TicketPassActionsProps) {
  const [shareNote, setShareNote] = useState<string | null>(null);

  const directionsHref = directionsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(directionsQuery)}`
    : null;

  const onShare = async () => {
    const data = { title: `${eventName} — my ticket`, url: shareUrl };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // user dismissed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareNote("Link copied");
    } catch {
      setShareNote("Copy failed — long-press the address bar");
    }
  };

  return (
    <div className="mt-6" data-testid="my-tickets-pass-actions">
      <div className="grid grid-cols-3 gap-2">
        {directionsHref ? (
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "min-h-11 flex-col gap-1 py-2",
            )}
            data-testid="my-tickets-action-directions"
          >
            <MapPin className="size-4" aria-hidden />
            Directions
          </a>
        ) : (
          <span
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "min-h-11 flex-col gap-1 py-2 opacity-40",
            )}
            aria-disabled
          >
            <MapPin className="size-4" aria-hidden />
            Directions
          </span>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onShare}
          className="min-h-11 flex-col gap-1 py-2"
          data-testid="my-tickets-action-share"
        >
          <Share2 className="size-4" aria-hidden />
          Share
        </Button>

        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "min-h-11 flex-col gap-1 py-2 opacity-40",
          )}
          aria-disabled
          title="Apple Wallet passes are coming soon"
          data-testid="my-tickets-action-wallet"
        >
          <Wallet className="size-4" aria-hidden />
          Wallet · soon
        </span>
      </div>
      {shareNote ? (
        <p
          className="mt-2 text-center text-xs text-muted-foreground"
          data-testid="my-tickets-share-note"
        >
          {shareNote}
        </p>
      ) : null}
    </div>
  );
}
