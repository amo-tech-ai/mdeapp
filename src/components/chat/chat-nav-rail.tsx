"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  Coffee,
  Heart,
  type LucideIcon,
  Luggage,
  MapPin,
  MessageSquarePlus,
  Sparkles,
  Ticket,
  User,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import { useConciergeSession } from "@/components/chat/concierge-session-context";
import { useThreadNav } from "@/lib/chat/thread-nav-context";
import { useNavThreads } from "@/lib/chat/use-nav-threads";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * One sidebar destination. `href: null` renders a disabled "Coming soon"
 * placeholder (matching the Trips pattern) for pages not yet live per sitemap.md.
 */
type NavItem = {
  slug: string;
  label: string;
  href: string | null;
  Icon: LucideIcon;
};

// Status mirrors sitemap.md: live verticals link out; SHELL/MVP/POST are placeholders.
const EXPLORE_ITEMS: NavItem[] = [
  { slug: "restaurants", label: "Restaurants", href: "/restaurants", Icon: UtensilsCrossed },
  { slug: "cafes", label: "Cafés", href: null, Icon: Coffee },
  { slug: "nightlife", label: "Nightlife", href: "/nightlife", Icon: Wine },
  { slug: "rentals", label: "Rentals", href: null, Icon: Building2 },
  { slug: "events", label: "Events", href: null, Icon: CalendarDays },
];

const LIBRARY_ITEMS: NavItem[] = [
  { slug: "saved", label: "Saved", href: "/saved", Icon: Heart },
  { slug: "tickets", label: "Tickets", href: "/me/tickets", Icon: Ticket },
  { slug: "trips", label: "Trips", href: null, Icon: Luggage },
  { slug: "profile", label: "Profile", href: null, Icon: User },
];

function NavItemRow({ item }: { item: NavItem }) {
  const { Icon, slug, label, href } = item;
  if (href) {
    return (
      <li>
        <a
          href={href}
          data-testid={`nav-${slug}-link`}
          className="inline-flex h-8 w-full items-center justify-start gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          {label}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Tooltip>
        <TooltipTrigger
          data-testid={`nav-${slug}-link`}
          aria-disabled="true"
          className="inline-flex h-8 w-full cursor-not-allowed items-center justify-start gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/50"
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          {label}
        </TooltipTrigger>
        <TooltipContent side="right">Coming soon</TooltipContent>
      </Tooltip>
    </li>
  );
}

function NavSectionLabel({ children }: { children: string }) {
  return (
    <li className="mt-2 border-t pt-2">
      <span className="block px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
        {children}
      </span>
    </li>
  );
}

/** SCREEN-002 — chat nav rail with thread list + new chat + nav links. */
export function ChatNavRail({
  testId = "nav-rail",
}: {
  testId?: string;
}) {
  const router = useRouter();
  const { startNewChat } = useConciergeSession();
  const { activeThreadId, setActiveThreadId, clearActiveThread } = useThreadNav();
  const { threads, loading, error } = useNavThreads();

  function onNewChat() {
    clearActiveThread();
    startNewChat();
    router.push("/");
  }

  function onSelectThread(id: string) {
    setActiveThreadId(id);
    router.push("/");
  }

  return (
    <nav
      data-testid={testId}
      data-active-thread-id={activeThreadId ?? ""}
      aria-label="Concierge navigation"
      className="flex h-full min-h-0 flex-col gap-4"
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="size-4 text-primary" aria-hidden />
        mdeai
      </div>

      <ul className="flex flex-col gap-1 text-sm">
        {/* New chat */}
        <li>
          <button
            type="button"
            data-testid="nav-new-chat"
            className="inline-flex h-8 w-full items-center justify-start gap-2 rounded-lg bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
            onClick={onNewChat}
          >
            <MessageSquarePlus className="size-4 shrink-0" aria-hidden />
            New chat
          </button>
        </li>

        {/* Thread list */}
        {loading ? (
          <li className="space-y-1 px-1 pt-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-7 animate-pulse rounded-md bg-muted"
                aria-hidden
              />
            ))}
          </li>
        ) : error ? (
          <li>
            <span
              className="block rounded-md px-3 py-2 text-xs text-destructive"
              data-testid="nav-threads-error"
            >
              Couldn&apos;t load chats
            </span>
          </li>
        ) : threads.length > 0 ? (
          threads.map((thread) => (
            <li key={thread.id}>
              <button
                type="button"
                data-testid="nav-thread-item"
                data-thread-id={thread.id}
                onClick={() => onSelectThread(thread.id)}
                className={cn(
                  "w-full truncate rounded-md px-3 py-1.5 text-left text-sm leading-snug hover:bg-muted",
                  activeThreadId === thread.id
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground",
                )}
                title={thread.title}
              >
                {thread.title}
              </button>
            </li>
          ))
        ) : (
          <li>
            <span
              className="block rounded-md px-3 py-2 text-xs text-muted-foreground"
              data-testid="nav-threads-empty"
            >
              No chats yet
            </span>
          </li>
        )}

        {/* Explore — live verticals (link) + not-yet-live placeholders (sitemap.md) */}
        <NavSectionLabel>Explore</NavSectionLabel>
        {EXPLORE_ITEMS.map((item) => (
          <NavItemRow key={item.slug} item={item} />
        ))}

        {/* Library — personal pages */}
        <NavSectionLabel>Library</NavSectionLabel>
        {LIBRARY_ITEMS.map((item) => (
          <NavItemRow key={item.slug} item={item} />
        ))}
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
