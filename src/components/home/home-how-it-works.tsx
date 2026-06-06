import Link from "next/link";
import { MessageSquareIcon, MapPinIcon, BookmarkIcon } from "lucide-react";

const steps = [
  {
    id: 1,
    Icon: MessageSquareIcon,
    title: "Ask the concierge",
    desc: "Type what you want in plain language — \"rooftop bar tonight\" or \"1BR near El Poblado.\"",
  },
  {
    id: 2,
    Icon: MapPinIcon,
    title: "See it on the map",
    desc: "Results appear as pins on a live Google Map alongside AI-matched cards.",
  },
  {
    id: 3,
    Icon: BookmarkIcon,
    title: "Save or book",
    desc: "Save venues to your collection, buy event tickets, or schedule a rental viewing.",
  },
] as const;

export function HomeHowItWorks() {
  return (
    <section aria-label="How mdeai works" className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
            How it works
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask → Map → Book. No guessing, no scam listings.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
          {steps.map(({ id, Icon, title, desc }) => (
            <div key={id} className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
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
