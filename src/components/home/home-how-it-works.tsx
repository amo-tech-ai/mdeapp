import Image from "next/image";
import Link from "next/link";
import { MessageSquareIcon, MapPinIcon, BookmarkIcon } from "lucide-react";

const steps = [
  {
    id: 1,
    Icon: MessageSquareIcon,
    title: "Ask the concierge",
    desc: "Type what you want in plain language — \"rooftop bar tonight\" or \"1BR near El Poblado.\"",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
    imageAlt: "Person typing on phone",
  },
  {
    id: 2,
    Icon: MapPinIcon,
    title: "See it on the map",
    desc: "Results appear as pins on a live Google Map alongside AI-matched cards.",
    image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
    imageAlt: "Map with location pins",
  },
  {
    id: 3,
    Icon: BookmarkIcon,
    title: "Save or book",
    desc: "Save venues to your collection, buy event tickets, or schedule a rental viewing.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=75",
    imageAlt: "People at a venue in Medellín",
  },
] as const;

export function HomeHowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-label="How mdeai works"
      className="bg-background py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
            How it works
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask → Map → Book. No guessing, no scam listings.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map(({ id, Icon, title, desc, image, imageAlt }) => (
            <div key={id} className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card">
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <div className="absolute bottom-3 left-4 flex size-10 items-center justify-center rounded-xl bg-primary/90 text-primary-foreground shadow">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
              </div>
              {/* Text */}
              <div className="flex flex-col gap-1.5 p-5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary/60">0{id}</span>
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/chat"
            data-testid="how-it-works-cta"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:bg-accent/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <span aria-hidden="true">✦</span>
            Explore Medellín
          </Link>
        </div>
      </div>
    </section>
  );
}
