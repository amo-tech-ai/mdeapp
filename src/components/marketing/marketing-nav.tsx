import Link from "next/link";

import { Button } from "@/components/ui/button";

type MarketingNavLink = { href: string; label: string };

const DEFAULT_LINKS: MarketingNavLink[] = [
  { href: "/", label: "Explore" },
  { href: "/events", label: "Events" },
  { href: "/rentals", label: "Rentals" },
];

type MarketingNavProps = {
  /** Center nav links. Defaults to Explore / Events / Rentals. */
  links?: MarketingNavLink[];
  /** Primary CTA — defaults to the live partner signup. */
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * Shared top nav for marketing / landing pages (MarketingPageShell default).
 * Sticky, translucent + blur. Reused by the partner hub and every /partners
 * and /business landing.
 */
export function MarketingNav({
  links = DEFAULT_LINKS,
  ctaLabel = "List with us",
  ctaHref = "/partners/signup",
}: MarketingNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-lg font-extrabold tracking-[-0.04em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          mde·ai
        </Link>

        <nav
          aria-label="Marketing"
          className="hidden flex-1 items-center justify-center gap-1 sm:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Log in
          </Button>
          <Button size="sm" nativeButton={false} render={<Link href={ctaHref} />}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </header>
  );
}
