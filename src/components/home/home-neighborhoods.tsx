import Link from "next/link";

const neighborhoods = [
  {
    id: "laureles",
    name: "Laureles",
    vibe: "Local favourite. Tree-lined streets, great cafés, walkable nightlife.",
    query: "Explore Laureles — cafés, restaurants, and things to do",
  },
  {
    id: "poblado",
    name: "El Poblado",
    vibe: "Expat hub. Rooftop bars, fine dining, Parque Lleras at its centre.",
    query: "Explore El Poblado — rooftops, restaurants, and events",
  },
  {
    id: "envigado",
    name: "Envigado",
    vibe: "Quiet and authentic. Paisa culture, low prices, local restaurants.",
    query: "Explore Envigado — local food, parks, and hidden spots",
  },
  {
    id: "centro",
    name: "El Centro",
    vibe: "Historic core. Botero Plaza, Mercado del Río, raw city energy.",
    query: "Explore El Centro — history, food markets, and culture",
  },
] as const;

export function HomeNeighborhoods() {
  return (
    <section aria-label="Explore Medellín neighbourhoods" className="bg-muted/40 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
            Know your neighbourhood
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask the concierge anything about Medellín — sorted by zone.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {neighborhoods.map(({ id, name, vibe, query }) => (
            <Link
              key={id}
              href={`/chat?q=${encodeURIComponent(query)}`}
              data-testid={`neighborhood-${id}`}
              className="group flex min-h-[140px] flex-col justify-between gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none"
            >
              <div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-200 motion-reduce:transition-none">
                  {name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{vibe}</p>
              </div>
              <span className="text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:opacity-100">
                Ask the concierge →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
