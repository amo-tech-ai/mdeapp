const pressLogos = [
  { label: "TechCrunch",    abbr: "TechCrunch" },
  { label: "The New York Times", abbr: "NYTimes" },
  { label: "Forbes",        abbr: "Forbes" },
  { label: "Skift",         abbr: "Skift" },
  { label: "Condé Nast Traveler", abbr: "CNTraveler" },
] as const;

const partnerLogos = [
  { label: "Google Maps",   abbr: "Google" },
  { label: "Stripe",        abbr: "Stripe" },
  { label: "Supabase",      abbr: "Supabase" },
  { label: "Tripadvisor",   abbr: "Tripadvisor" },
] as const;

function LogoPill({ abbr, label }: { abbr: string; label: string }) {
  return (
    <span
      className="inline-flex h-9 items-center rounded-full border border-border bg-background px-5 text-sm font-semibold tracking-tight text-muted-foreground/70"
      aria-label={label}
    >
      {abbr}
    </span>
  );
}

export function HomePressLogos() {
  return (
    <section aria-label="Press and partners" className="bg-muted/30 py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        {/* Press */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            As featured in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {pressLogos.map(({ abbr, label }) => (
              <LogoPill key={abbr} abbr={abbr} label={label} />
            ))}
          </div>
        </div>

        <div className="mx-auto h-px w-24 bg-border" aria-hidden="true" />

        {/* Partners */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Built on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {partnerLogos.map(({ abbr, label }) => (
              <LogoPill key={abbr} abbr={abbr} label={label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
