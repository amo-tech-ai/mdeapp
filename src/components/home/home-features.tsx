import type { LucideIcon } from "lucide-react";
import { HeartIcon, HomeIcon, LeafIcon, MapPinIcon, TicketIcon } from "lucide-react";

type Feature = {
  id: string;
  title: string;
  desc: string;
  gold?: boolean;
  Icon?: LucideIcon;
};

/** D-13 "Why mdeai" value-prop grid (design U5pcqz · section 05b). Marketing copy
 *  only — no metrics, so nothing here can drift from real data. The AI-concierge
 *  card carries the gold ✦; every other card uses a neutral lucide glyph. */
const features: Feature[] = [
  {
    id: "concierge",
    gold: true,
    title: "AI concierge",
    desc: "Ask in plain words. It plans your night and answers on the map — never a wall of links.",
  },
  {
    id: "map",
    Icon: MapPinIcon,
    title: "A living map",
    desc: "Every pick lands as a pin. Hover a card to find it — the map is the proof, not a list.",
  },
  {
    id: "save",
    Icon: HeartIcon,
    title: "Save & plan",
    desc: "Build collections and trips that stay in sync across the map, the chat, and your phone.",
  },
  {
    id: "events",
    Icon: TicketIcon,
    title: "Events & tickets",
    desc: "See what's on and buy tickets in a tap — no third app, no dead ends.",
  },
  {
    id: "rentals",
    Icon: HomeIcon,
    title: "Verified rentals",
    desc: "Furnished stays with real photos and total-price honesty. Book a viewing in seconds.",
  },
  {
    id: "guides",
    Icon: LeafIcon,
    title: "Local guides",
    desc: "Neighbourhood intelligence — walkability, vibe, and the paisa spots tourists miss.",
  },
];

export function HomeFeatures() {
  return (
    <section
      aria-label="Why mdeai"
      data-testid="home-features"
      className="bg-background py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Why mdeai
          </span>
          <h2 className="mt-1 text-2xl font-semibold text-foreground md:text-3xl">
            Everything Medellín, in one place
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Discover, plan, book, and explore — with the concierge and the map running through all of it.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.Icon;
            return (
            <div
              key={f.id}
              data-testid={`home-feature-${f.id}`}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <span
                className={
                  f.gold
                    ? "flex size-10 items-center justify-center rounded-xl bg-accent/10 text-lg font-bold text-accent"
                    : "flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                }
                aria-hidden="true"
              >
                {f.gold || !Icon ? "✦" : <Icon className="size-5" />}
              </span>
              <h3 className="mt-3 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
