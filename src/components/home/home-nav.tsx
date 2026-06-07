"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon, XIcon, BookmarkIcon } from "lucide-react";

const verticals = [
  { label: "Rentals",     href: "/rentals" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Cafés",       href: "/cafes" },
  { label: "Nightlife",   href: "/nightlife" },
  { label: "Events",      href: "/events" },
] as const;

export function HomeNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-lg font-extrabold tracking-[-0.04em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          mde·ai
        </Link>

        {/* Desktop verticals */}
        <nav
          aria-label="Site verticals"
          className="hidden flex-1 items-center justify-center gap-1 sm:flex"
        >
          {verticals.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <Link
            href="/saved"
            className="flex min-h-[44px] items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none"
          >
            <BookmarkIcon className="size-3.5" aria-hidden="true" />
            Saved
          </Link>
          <Link
            href="/host/event/new"
            className="flex min-h-[36px] items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-all duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Host
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="ml-auto flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 sm:hidden">
          <nav aria-label="Mobile site verticals" className="flex flex-col gap-1">
            {verticals.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-border pt-2">
              <Link
                href="/saved"
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <BookmarkIcon className="size-3.5" aria-hidden="true" />
                Saved
              </Link>
              <Link
                href="/host/event/new"
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Host an event
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
