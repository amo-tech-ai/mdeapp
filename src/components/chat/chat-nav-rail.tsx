"use client";

import Link from "next/link";
import { Heart, Luggage, MapPin, MessageSquarePlus, Sparkles } from "lucide-react";

/** MAP-007B left nav rail (Mindtrip-style stub; routes expand in Phase 2). */
export function ChatNavRail({
  testId = "nav-rail",
}: {
  testId?: string;
}) {
  return (
    <nav
      data-testid={testId}
      aria-label="Concierge navigation"
      className="flex h-full min-h-0 flex-col gap-4"
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="size-4 text-primary" aria-hidden />
        mdeai
      </div>
      <ul className="flex flex-col gap-1 text-sm">
        <li>
          <Link
            href="/"
            className="inline-flex h-8 w-full items-center justify-start gap-2 rounded-lg bg-secondary px-3 text-sm font-medium text-secondary-foreground"
          >
            <MessageSquarePlus className="size-4" aria-hidden />
            New chat
          </Link>
        </li>
        <li>
          <span
            className="block rounded-md px-3 py-2 text-muted-foreground"
            data-testid="nav-threads-empty"
          >
            Chats — coming soon
          </span>
        </li>
        <li>
          <Link
            href="/saved"
            data-testid="nav-saved-link"
            className="inline-flex h-8 w-full items-center justify-start gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Heart className="size-4" aria-hidden />
            Saved
          </Link>
        </li>
        <li>
          <Link
            href="/trips"
            data-testid="nav-trips-link"
            className="inline-flex h-8 w-full items-center justify-start gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Luggage className="size-4" aria-hidden />
            Trips
          </Link>
        </li>
      </ul>
      <p className="mt-auto text-xs text-muted-foreground">
        Ask for rentals, events, cafés, or map pins in Laureles and Poblado.
      </p>
      <a
        href="#copilot-chat-region"
        className="sr-only focus:not-sr-only focus:rounded focus:bg-muted focus:px-2 focus:py-1"
      >
        Skip to chat
      </a>
      <a
        href="#chat-map"
        className="sr-only focus:not-sr-only focus:rounded focus:bg-muted focus:px-2 focus:py-1"
      >
        Skip to map
      </a>
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground lg:hidden">
        <MapPin className="size-3" aria-hidden />
        Use &quot;Open map&quot; below for pins
      </span>
    </nav>
  );
}
