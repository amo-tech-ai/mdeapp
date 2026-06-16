import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

/** Neighbourhood guide cards. Names + editorial vibe copy are curated/real.
 *  Tag chips are derived only from that approved vibe text — no invented stats.
 *  Header photos are Unsplash stand-ins (not the actual streets); the alt text
 *  says so plainly. Swap for real licensed neighbourhood photography later. */
const neighborhoods = [
  {
    id: "laureles",
    name: "Laureles",
    vibe: "Local favourite. Tree-lined streets, great cafés, walkable nightlife.",
    tags: ["Cafés", "Walkable", "Nightlife"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
    query: "Explore Laureles — cafés, restaurants, and things to do",
  },
  {
    id: "poblado",
    name: "El Poblado",
    vibe: "Expat hub. Rooftop bars, fine dining, Parque Lleras at its centre.",
    tags: ["Rooftops", "Fine dining", "Nightlife"],
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
    query: "Explore El Poblado — rooftops, restaurants, and events",
  },
  {
    id: "envigado",
    name: "Envigado",
    vibe: "Quiet and authentic. Paisa culture, low prices, local restaurants.",
    tags: ["Local food", "Quiet", "Authentic"],
    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
    query: "Explore Envigado — local food, parks, and hidden spots",
  },
  {
    id: "centro",
    name: "El Centro",
    vibe: "Historic core. Botero Plaza, Mercado del Río, raw city energy.",
    tags: ["History", "Food markets", "Culture"],
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
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
          {neighborhoods.map(({ id, name, vibe, tags, image, query }) => (
            <Link
              key={id}
              href={`/chat?q=${encodeURIComponent(query)}`}
              data-testid={`neighborhood-${id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none"
            >
              <div className="relative h-32 overflow-hidden bg-muted">
                <Image
                  src={image}
                  alt={`Medellín street scene (stand-in photo for ${name})`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <h3 className="absolute bottom-2 left-3 text-base font-semibold text-white drop-shadow-sm">
                  {name}
                </h3>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                <p className="text-xs leading-relaxed text-muted-foreground">{vibe}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span className="text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:opacity-100">
                  Ask the concierge →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
