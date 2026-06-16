import { Badge } from "@/components/ui/badge";

/** Truthful infra band. The fabricated "As featured in" press row (TechCrunch,
 *  NYTimes, Forbes, …) was removed — mdeai has no real press coverage to claim.
 *  Only the genuinely-used production stack is shown here. */
const partnerLogos = [
  { label: "Google Maps",   abbr: "Google" },
  { label: "Stripe",        abbr: "Stripe" },
  { label: "Supabase",      abbr: "Supabase" },
] as const;

function LogoPill({ abbr, label }: { abbr: string; label: string }) {
  return (
    <Badge
      variant="outline"
      aria-label={label}
      className="h-9 px-5 text-sm font-semibold tracking-tight text-muted-foreground/70"
    >
      {abbr}
    </Badge>
  );
}

export function HomePressLogos() {
  return (
    <section aria-label="Built on" className="bg-muted/30 py-10 md:py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Built on
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {partnerLogos.map(({ abbr, label }) => (
            <LogoPill key={abbr} abbr={abbr} label={label} />
          ))}
        </div>
      </div>
    </section>
  );
}
