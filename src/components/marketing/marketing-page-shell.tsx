import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";

/**
 * Per-vertical accent for the hero radial backdrop. Tokens follow DESIGN.MD
 * (oklch). gold = partner hub / business; the others match the vertical specs.
 */
export type MarketingAccent =
  | "gold"
  | "magenta"
  | "terracotta"
  | "caramel"
  | "teal";

const ACCENT_RADIAL: Record<MarketingAccent, string> = {
  gold: "bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,oklch(0.90_0.08_80/0.55),transparent)]",
  magenta:
    "bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,oklch(0.80_0.12_330/0.45),transparent)]",
  terracotta:
    "bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,oklch(0.85_0.09_40/0.5),transparent)]",
  caramel:
    "bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,oklch(0.90_0.08_85/0.55),transparent)]",
  teal: "bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,oklch(0.95_0.04_160/0.7),transparent)]",
};

type MarketingPageShellProps = {
  children: ReactNode;
  /** Hero accent backdrop. Defaults to gold (partner hub / business). */
  accent?: MarketingAccent;
  /** Override the default shared nav. */
  nav?: ReactNode;
  /** Override the default shared footer. */
  footer?: ReactNode;
  /** data-testid on <main> for e2e. */
  mainTestId?: string;
};

/**
 * Reusable marketing/landing layout shell (SAN-692 — MKT Partner hub is the
 * first consumer).
 *
 * Composes: shared nav → accent radial backdrop → page sections (children) →
 * shared footer. Section content slots into `children` per page. Reused by all
 * /partners and /business landings — see tasks/design/COMPONENT-SHELLS.md.
 */
export function MarketingPageShell({
  children,
  accent = "gold",
  nav,
  footer,
  mainTestId,
}: MarketingPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {nav ?? <MarketingNav />}
      <main id="main-content" data-testid={mainTestId} className="relative flex-1">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-[36rem]",
            ACCENT_RADIAL[accent],
          )}
        />
        <div className="relative">{children}</div>
      </main>
      {footer ?? <MarketingFooter />}
    </div>
  );
}
