import Link from "next/link";

import { Button } from "@/components/ui/button";

export type PartnerMarketingNavLink = {
  label: string;
  href: string;
  active?: boolean;
};

type PartnerMarketingNavProps = {
  primaryCtaHref: string;
  primaryCtaLabel: string;
  signInHref?: string;
  links?: PartnerMarketingNavLink[];
};

const DEFAULT_LINKS: PartnerMarketingNavLink[] = [
  { label: "Rentals", href: "/partners/rentals" },
  { label: "See renter experience", href: "/rentals" },
];

/**
 * B2B marketing nav — shared across partner landings (SAN-691, SAN-660).
 */
export function PartnerMarketingNav({
  primaryCtaHref,
  primaryCtaLabel,
  signInHref = "/login",
  links = DEFAULT_LINKS,
}: PartnerMarketingNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-lg font-extrabold tracking-[-0.04em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          mde·ai
          <span className="ml-1.5 hidden text-sm font-medium text-muted-foreground sm:inline">
            for business
          </span>
        </Link>

        <nav
          aria-label="Partner solutions"
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex"
        >
          {links.map(({ label, href, active }) => (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "rounded-full px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                  : "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            className="min-h-11 px-4"
            nativeButton={false}
            render={<Link href={signInHref} />}
          >
            Sign in
          </Button>
          <Button
            className="min-h-11 px-4"
            nativeButton={false}
            render={<Link href={primaryCtaHref} />}
            data-testid="partner-marketing-primary-cta"
          >
            <span className="max-w-[9rem] truncate sm:max-w-none">
              {primaryCtaLabel}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
