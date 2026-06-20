"use client";

import {
  CalendarPlus,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

type HostCommandItemsProps = {
  close: () => void;
  openDashboard: () => void;
  viewSales: () => void;
  createEvent: () => void;
  askAi: () => void;
};

export function HostCommandItems({
  close,
  openDashboard,
  viewSales,
  createEvent,
  askAi,
}: HostCommandItemsProps) {
  const pick = (action: () => void) => () => {
    close();
    action();
  };

  return (
    <CommandList>
      <CommandEmpty>No matching commands.</CommandEmpty>
      <CommandGroup heading="Go to">
        <CommandItem
          data-testid="host-command-open-dashboard"
          onSelect={pick(openDashboard)}
        >
          <LayoutDashboard className="size-4" aria-hidden />
          Open Dashboard
        </CommandItem>
        <CommandItem
          data-testid="host-command-view-sales"
          onSelect={pick(viewSales)}
        >
          <TrendingUp className="size-4" aria-hidden />
          View Sales
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Create">
        <CommandItem
          data-testid="host-command-create-event"
          onSelect={pick(createEvent)}
        >
          <CalendarPlus className="size-4" aria-hidden />
          Create Event
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Ask the assistant">
        <CommandItem
          data-testid="host-command-find-venue"
          onSelect={pick(askAi)}
        >
          <MapPin className="size-4" aria-hidden />
          Find Venue
        </CommandItem>
        <CommandItem
          data-testid="host-command-find-attendees"
          onSelect={pick(askAi)}
        >
          <Users className="size-4" aria-hidden />
          Find Attendees
        </CommandItem>
        <CommandItem data-testid="host-command-ask-ai" onSelect={pick(askAi)}>
          <MessageSquare className="size-4" aria-hidden />
          Ask AI
          <CommandShortcut>⌘K</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  );
}
