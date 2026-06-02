"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { ChatNavRail } from "@/components/chat/chat-nav-rail";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/** MAP-007B — collapsible nav for tablet/mobile (desktop uses fixed left rail). */
export function ChatNavDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="lg:hidden"
        data-testid="nav-drawer-trigger"
        aria-label="Open navigation"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="nav-drawer-content"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-4" aria-hidden />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          id="nav-drawer-content"
          side="left"
          className="w-[min(280px,85vw)] p-4"
          data-testid="nav-drawer-content"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Concierge navigation menu</SheetDescription>
          </SheetHeader>
          <ChatNavRail testId="nav-rail-drawer" />
        </SheetContent>
      </Sheet>
    </>
  );
}
