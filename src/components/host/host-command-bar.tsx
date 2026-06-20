"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarPlus,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

/**
 * SAN-1209 · HOST-OS-001 — Universal Command Bar (⌘K).
 *
 * One palette for the whole Host OS: jump to a workspace or hand the request to
 * the assistant. Navigation commands go straight to live routes; the
 * venue/attendee lookups (no dedicated pages this phase) focus the persistent
 * copilot so Roberto can just ask. Renders its own trigger button + dialog and
 * owns the ⌘K / Ctrl+K shortcut.
 */

type HostCommandBarProps = {
  /** Focus the persistent host copilot (e.g. for "Ask AI"). */
  onAskAi?: () => void;
};

export function HostCommandBar({ onAskAi }: HostCommandBarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const run = useCallback((action: () => void) => {
    setOpen(false);
    action();
  }, []);

  const askAi = useCallback(() => {
    if (onAskAi) onAskAi();
  }, [onAskAi]);

  return (
    <>
      <button
        type="button"
        data-testid="host-command-bar-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open command bar"
        aria-keyshortcuts="Meta+K Control+K"
        className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="hidden sm:inline">Search or ask…</span>
        <span className="sm:hidden">⌘K</span>
        <kbd className="hidden rounded border border-border bg-muted px-1 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Host command bar"
        description="Jump to a workspace or ask the assistant."
      >
        <CommandInput placeholder="Type a command or search…" data-testid="host-command-bar-input" />
        <CommandList>
          <CommandEmpty>No matching commands.</CommandEmpty>
          <CommandGroup heading="Go to">
            <CommandItem
              data-testid="host-command-open-dashboard"
              onSelect={() => run(() => router.push("/host/dashboard"))}
            >
              <LayoutDashboard className="size-4" aria-hidden />
              Open Dashboard
            </CommandItem>
            <CommandItem
              data-testid="host-command-view-sales"
              onSelect={() => run(() => router.push("/host/analytics"))}
            >
              <TrendingUp className="size-4" aria-hidden />
              View Sales
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Create">
            <CommandItem
              data-testid="host-command-create-event"
              onSelect={() => run(() => router.push("/host/event/new"))}
            >
              <CalendarPlus className="size-4" aria-hidden />
              Create Event
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ask the assistant">
            <CommandItem
              data-testid="host-command-find-venue"
              onSelect={() => run(askAi)}
            >
              <MapPin className="size-4" aria-hidden />
              Find Venue
            </CommandItem>
            <CommandItem
              data-testid="host-command-find-attendees"
              onSelect={() => run(askAi)}
            >
              <Users className="size-4" aria-hidden />
              Find Attendees
            </CommandItem>
            <CommandItem data-testid="host-command-ask-ai" onSelect={() => run(askAi)}>
              <MessageSquare className="size-4" aria-hidden />
              Ask AI
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
