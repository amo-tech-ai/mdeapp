import Link from "next/link";
import { ArrowLeft, MoonStar } from "lucide-react";
import { EmptyState } from "@/components/empty/empty-state";
import { NightlifeBrowseCard } from "@/components/nightlife/nightlife-browse-card";
import type { NightlifeListing, NightlifeVibe } from "@/lib/nightlife-browse";

const NEIGHBORHOODS = [
  "Provenza",
  "Laureles",
  "El Poblado",
  "Manila",
] as const;

const VIBES: { value: NightlifeVibe; label: string }[] = [
  { value: "reggaeton", label: "Reggaeton" },
  { value: "rooftop", label: "Rooftop" },
  { value: "salsa", label: "Salsa" },
  { value: "cocktails", label: "Cocktails" },
  { value: "live-music", label: "Live DJ" },
];

function buildFilterUrl(filters: {
  neighborhood?: string | null;
  vibe?: NightlifeVibe | null;
}): string {
  const params = new URLSearchParams();
  if (filters.neighborhood) params.set("neighborhood", filters.neighborhood);
  if (filters.vibe) params.set("vibe", filters.vibe);
  const query = params.toString();
  return query ? `/nightlife?${query}` : "/nightlife";
}

function toggleNeighborhood(
  current: string | null,
  value: string,
): string | null {
  return current === value ? null : value;
}

function toggleVibe(
  current: NightlifeVibe | null,
  value: NightlifeVibe,
): NightlifeVibe | null {
  return current === value ? null : value;
}

type NightlifeBrowseViewProps = {
  results: NightlifeListing[];
  error: string | null;
  neighborhood: string | null;
  vibe: NightlifeVibe | null;
};

export function NightlifeBrowseView({
  results,
  error,
  neighborhood,
  vibe,
}: NightlifeBrowseViewProps) {
  const retryHref = buildFilterUrl({ neighborhood, vibe });

  return (
    <main
      data-testid="nightlife-page"
      className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6"
    >
      <header className="sticky top-0 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-start gap-3">
          <Link
            href="/"
            aria-label="Back to chat"
            className="mt-1 inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-border hover:bg-muted"
          >
            <ArrowLeft className="size-4" aria-hidden />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-2xl font-semibold">Nightlife</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Clubs &amp; bars in Medellín — browse without chat
            </p>
          </div>
          <Link
            href="/"
            className="hidden text-sm text-primary hover:underline sm:inline"
          >
            Ask concierge
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Neighborhood
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Neighborhood filters"
            >
              {NEIGHBORHOODS.map((n) => {
                const active = neighborhood === n;
                return (
                  <Link
                    key={n}
                    href={buildFilterUrl({
                      neighborhood: toggleNeighborhood(neighborhood, n),
                      vibe,
                    })}
                    aria-pressed={active}
                    data-testid={`nightlife-filter-neighborhood-${n.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`inline-flex min-h-9 items-center rounded-full border px-3 text-sm transition ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {n}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Vibe
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Vibe filters"
            >
              {VIBES.map(({ value, label }) => {
                const active = vibe === value;
                return (
                  <Link
                    key={value}
                    href={buildFilterUrl({
                      neighborhood,
                      vibe: toggleVibe(vibe, value),
                    })}
                    aria-pressed={active}
                    data-testid={`nightlife-filter-vibe-${value}`}
                    className={`inline-flex min-h-9 items-center rounded-full border px-3 text-sm transition ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <p
        className="mt-4 rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
        data-testid="nightlife-safety-notice"
      >
        Safety: use licensed taxis at night and stay in busy, well-lit areas.
      </p>

      <section className="mt-6" aria-label="Nightlife listings">
        {error ? (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
            data-testid="nightlife-error"
          >
            <p className="text-sm text-destructive">{error}</p>
            <Link
              href={retryHref}
              className="mt-4 inline-flex min-h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
            >
              Retry
            </Link>
          </div>
        ) : null}

        {!error && results.length === 0 ? (
          <EmptyState
            testId="nightlife-empty"
            title="No nightlife venues matched"
            description="Try another neighborhood or vibe, or ask the concierge on chat."
            icon={<MoonStar className="size-8" aria-hidden />}
          />
        ) : null}

        {!error && results.length > 0 ? (
          <div
            className="grid gap-4 sm:grid-cols-2"
            aria-label={`${results.length} nightlife venues`}
            data-testid="nightlife-grid"
          >
            {results.map((listing) => (
              <NightlifeBrowseCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
