import { BadgeCheckIcon, ShieldCheckIcon, RefreshCwIcon } from "lucide-react";

const signals = [
  { Icon: ShieldCheckIcon, label: "Grounded in Google Maps" },
  { Icon: BadgeCheckIcon,  label: "Verified listings" },
  { Icon: RefreshCwIcon,   label: "Updated daily" },
] as const;

export function HomeTrustBand() {
  return (
    <section aria-label="Platform trust signals" className="border-y border-border bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {signals.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-muted-foreground">
              <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
          <span className="hidden h-4 w-px bg-border md:block" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">
            3.2k&nbsp;places · 180&nbsp;verified rentals · no scams
          </p>
        </div>
      </div>
    </section>
  );
}
