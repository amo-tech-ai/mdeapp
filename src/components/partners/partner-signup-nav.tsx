import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type PartnerSignupNavProps = {
  /** Shown on wizard routes — e.g. "Event host signup" */
  contextLabel?: string;
  showBackToPicker?: boolean;
};

export function PartnerSignupNav({
  contextLabel,
  showBackToPicker = false,
}: PartnerSignupNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-lg font-extrabold tracking-[-0.04em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          mde·ai
        </Link>

        {showBackToPicker ? (
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/partners/signup" />}
          >
            <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
            All partner types
          </Button>
        ) : (
          <nav
            aria-label="Partner program"
            className="hidden flex-1 items-center justify-center gap-1 sm:flex"
          >
            <Link
              href="/partners"
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >
              For business
            </Link>
            <Link
              href="/partners/rentals"
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >
              Rentals
            </Link>
            <Link
              href="/host/event/new"
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >
              Host events
            </Link>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          {contextLabel ? (
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {contextLabel}
            </span>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Sign in
          </Button>
          <Button size="sm" nativeButton={false} render={<Link href="/chat" />}>
            Explore Medellín
          </Button>
        </div>
      </div>
    </header>
  );
}
