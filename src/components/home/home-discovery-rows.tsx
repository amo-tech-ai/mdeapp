import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  fetchLiveRentals,
  fetchLiveRestaurants,
  fetchLiveCafes,
  fetchLiveEvents,
} from "@/lib/discovery/fetch-discovery-rows";

// ─── Types (exported so fetcher can reuse) ────────────────────────────────────

export interface PlaceCardData {
  id: string;
  name: string;
  kind: string;
  rating: number;
  meta: string;
  why: string;
  image: string;
  query: string;
}

interface RowData {
  id: string;
  label: string;
  href: string;
  ctaLabel: string;
  cards: PlaceCardData[];
}

// ─── Static curated fallback data ────────────────────────────────────────────
// Used when live data is unavailable or returns fewer than 4 results.

const STATIC_ROWS: RowData[] = [
  {
    id: "rentals",
    label: "Rentals near you",
    href: "/rentals",
    ctaLabel: "Browse all rentals",
    cards: [
      {
        id: "r1",
        name: "Modern Studio, Laureles",
        kind: "Rental",
        rating: 4.8,
        meta: "From $850 / mo",
        why: "Quiet street, 3-min walk to cafés. Bills included, fast Wi-Fi.",
        image:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "Studio apartment for rent in Laureles Medellín",
      },
      {
        id: "r2",
        name: "1BR Apartment, El Poblado",
        kind: "Rental",
        rating: 4.6,
        meta: "From $1,100 / mo",
        why: "Parque Lleras 5-min walk. Rooftop pool, full-time concierge.",
        image:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "1 bedroom apartment for rent in El Poblado Medellín",
      },
      {
        id: "r3",
        name: "2BR House, Envigado",
        kind: "Rental",
        rating: 4.9,
        meta: "From $1,250 / mo",
        why: "Local neighbourhood feel at half the Poblado price. Quiet, leafy block.",
        image:
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "2 bedroom house for rent in Envigado Medellín",
      },
      {
        id: "r4",
        name: "Furnished 1BR, Laureles",
        kind: "Rental",
        rating: 4.7,
        meta: "From $950 / mo",
        why: "Newly renovated. Walkable to Éxito, gym in building.",
        image:
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "Furnished apartment for rent in Laureles Medellín",
      },
    ],
  },
  {
    id: "restaurants",
    label: "Top restaurants",
    href: "/restaurants",
    ctaLabel: "See all restaurants",
    cards: [
      {
        id: "rs1",
        name: "Carmen",
        kind: "Fine dining",
        rating: 4.9,
        meta: "El Poblado · $$$$",
        why: "Colombia's most-awarded restaurant. Book two weeks ahead — worth it.",
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "Carmen restaurant El Poblado Medellín reservation",
      },
      {
        id: "rs2",
        name: "El Cielo",
        kind: "Tasting menu",
        rating: 4.8,
        meta: "El Poblado · $$$$",
        why: "12-course Colombian molecular experience. Michelin-level, local prices.",
        image:
          "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "El Cielo tasting menu Medellín booking",
      },
      {
        id: "rs3",
        name: "Mercado del Río",
        kind: "Food hall",
        rating: 4.7,
        meta: "El Centro · $$",
        why: "30+ stalls under one roof. Perfect for groups with different tastes.",
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "Mercado del Río food hall El Centro Medellín",
      },
      {
        id: "rs4",
        name: "La Mar",
        kind: "Ceviche",
        rating: 4.6,
        meta: "Laureles · $$$",
        why: "Best Peruvian in the city. Long queues on weekends — arrive by noon.",
        image:
          "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "La Mar ceviche restaurant Laureles Medellín",
      },
    ],
  },
  {
    id: "cafes",
    label: "Cafés to work from",
    href: "/cafes",
    ctaLabel: "Explore cafés",
    cards: [
      {
        id: "c1",
        name: "Pergamino",
        kind: "Specialty",
        rating: 4.9,
        meta: "El Poblado · $",
        why: "Gold standard. Roastery on-site, fast Wi-Fi, no time limit on seats.",
        image:
          "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "Pergamino café El Poblado Medellín work from",
      },
      {
        id: "c2",
        name: "Velvet",
        kind: "Third wave",
        rating: 4.8,
        meta: "Laureles · $",
        why: "Quieter than Pergamino. Great pour-overs, power sockets at every seat.",
        image:
          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "Velvet café Laureles Medellín work laptop",
      },
      {
        id: "c3",
        name: "Café Revolución",
        kind: "Creative hub",
        rating: 4.7,
        meta: "Laureles · $",
        why: "Communal tables, reliable internet, weekly events. Freelancer favourite.",
        image:
          "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "Café Revolución Laureles Medellín freelance workspace",
      },
      {
        id: "c4",
        name: "Azafrán",
        kind: "Bakery + café",
        rating: 4.6,
        meta: "El Poblado · $",
        why: "Fresh pastries every morning, outdoor terrace open until 8pm.",
        image:
          "https://images.unsplash.com/photo-1517244683847-7456b63c5969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "Azafrán bakery café El Poblado Medellín",
      },
    ],
  },
  {
    id: "events",
    label: "Upcoming events",
    href: "/events",
    ctaLabel: "View all events",
    cards: [
      {
        id: "e1",
        name: "Salsa Night — Teatro Metro",
        kind: "Nightlife",
        rating: 4.8,
        meta: "Tonight · Free entry",
        why: "Live orchestra, open dance floor. All levels welcome — Medellín at its best.",
        image:
          "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "Salsa night events Medellín this week",
      },
      {
        id: "e2",
        name: "Feria de las Flores",
        kind: "Festival",
        rating: 4.9,
        meta: "This weekend · Free",
        why: "The city's biggest annual festival. Silleterros parade, food, live music.",
        image:
          "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "Feria de las Flores Medellín schedule events",
      },
      {
        id: "e3",
        name: "Art Week Medellín",
        kind: "Culture",
        rating: 4.6,
        meta: "Next week · Free",
        why: "50+ galleries open late, free entry. Best with the guided walking tour.",
        image:
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "Art Week Medellín galleries events tickets",
      },
      {
        id: "e4",
        name: "Craft Beer Festival",
        kind: "Food & drink",
        rating: 4.7,
        meta: "Sat · $12 entry",
        why: "40 local breweries, live music, street food. Biggest beer event of the year.",
        image:
          "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
        query: "Craft beer festival Medellín Laureles tickets",
      },
    ],
  },
];

// ─── PlaceCard ────────────────────────────────────────────────────────────────

function PlaceCard({
  name,
  kind,
  rating,
  meta,
  why,
  image,
  query,
}: Omit<PlaceCardData, "id">) {
  return (
    <Link
      href={`/chat?q=${encodeURIComponent(query)}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Card className="h-full overflow-hidden transition-all duration-200 group-hover:border-primary/30 group-hover:shadow-md motion-reduce:transition-none">
        {/* Image */}
        <div className="relative h-36 overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {/* Kind pill */}
          <Badge
            variant="secondary"
            className="absolute left-2 top-2 bg-background/85 text-[10px] font-semibold backdrop-blur-sm"
          >
            {kind}
          </Badge>
        </div>

        {/* Content */}
        <CardContent className="flex flex-col gap-1.5 p-3">
          <p className="line-clamp-1 text-sm font-semibold text-foreground">
            {name}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-accent">★ {rating}</span>
            <span className="text-xs text-muted-foreground">{meta}</span>
          </div>
          {/* Why line — concierge insight */}
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {why}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── PlaceCard Skeleton ───────────────────────────────────────────────────────

function PlaceCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="h-36 bg-muted animate-pulse" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
        <div className="space-y-1">
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ─── Pure render component ────────────────────────────────────────────────────

function HomeDiscoveryRowsUI({ rows }: { rows: RowData[] }) {
  return (
    <section aria-label="Discover Medellín" className="bg-background py-10 md:py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        {rows.map(({ id, label, href, ctaLabel, cards }) => (
          <div key={id} className="flex flex-col gap-4">
            {/* Row header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground md:text-lg">
                {label}
              </h2>
              <Link
                href={href}
                data-testid={`discovery-cta-${id}`}
                className="flex items-center gap-1 text-xs font-medium text-primary transition-colors duration-200 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 motion-reduce:transition-none"
              >
                {ctaLabel}
                <ArrowRightIcon className="size-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {cards.map((card) => (
                <PlaceCard key={card.id} {...card} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Skeleton (exported for Suspense fallback) ────────────────────────────────

export function HomeDiscoveryRowsSkeleton() {
  return (
    <section
      aria-label="Discover Medellín"
      aria-busy="true"
      className="bg-background py-10 md:py-14"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        {Array.from({ length: 4 }).map((_, rowIdx) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={rowIdx} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-36 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, cardIdx) => (
                // eslint-disable-next-line react/no-array-index-key
                <PlaceCardSkeleton key={cardIdx} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Async inner — fetches live data, falls back to static per row ─────────────

async function HomeDiscoveryRowsInner() {
  const supabase = await createClient();

  const [rentalsResult, restaurantsResult, cafesResult, eventsResult] =
    await Promise.allSettled([
      fetchLiveRentals(supabase),
      fetchLiveRestaurants(supabase),
      fetchLiveCafes(supabase),
      fetchLiveEvents(supabase),
    ]);

  /** Return live cards if we got ≥ 4; otherwise fall back to static curation. */
  function resolveRow(
    result: PromiseSettledResult<PlaceCardData[]>,
    staticCards: PlaceCardData[],
  ): PlaceCardData[] {
    if (result.status === "fulfilled" && result.value.length >= 4) {
      return result.value.slice(0, 4);
    }
    return staticCards;
  }

  const rows: RowData[] = [
    { ...STATIC_ROWS[0], cards: resolveRow(rentalsResult, STATIC_ROWS[0].cards) },
    { ...STATIC_ROWS[1], cards: resolveRow(restaurantsResult, STATIC_ROWS[1].cards) },
    { ...STATIC_ROWS[2], cards: resolveRow(cafesResult, STATIC_ROWS[2].cards) },
    { ...STATIC_ROWS[3], cards: resolveRow(eventsResult, STATIC_ROWS[3].cards) },
  ];

  return <HomeDiscoveryRowsUI rows={rows} />;
}

// ─── Public export — self-contained with Suspense skeleton ───────────────────

export function HomeDiscoveryRows() {
  return (
    <Suspense fallback={<HomeDiscoveryRowsSkeleton />}>
      <HomeDiscoveryRowsInner />
    </Suspense>
  );
}
