import Link from "next/link";

type FooterColumn = {
  heading: string;
  links: { href: string; label: string }[];
};

// Live routes only — every href must resolve to an existing page.tsx.
// Dead links (/about, /contact, /legal/privacy) removed per PR #131 review;
// those routes are not built yet (own follow-up tasks). Do not add a link here
// until its route ships.
const COLUMNS: FooterColumn[] = [
  {
    heading: "Explore",
    links: [
      { href: "/", label: "Concierge" },
      { href: "/events", label: "Events" },
      { href: "/restaurants", label: "Restaurants" },
      { href: "/cafes", label: "Cafés" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { href: "/nightlife", label: "Nightlife" },
      { href: "/rentals", label: "Rentals" },
      { href: "/saved", label: "Saved" },
      { href: "/me/tickets", label: "My tickets" },
    ],
  },
  {
    heading: "Partners",
    links: [
      { href: "/partners", label: "Partner hub" },
      { href: "/partners/signup", label: "List with us" },
      { href: "/host/event/new", label: "Host an event" },
    ],
  },
];

/** Shared footer for marketing / landing pages (MarketingPageShell default). */
export function MarketingFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="text-lg font-extrabold tracking-[-0.04em] text-foreground">
            mde·ai
          </span>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Medellín&apos;s AI concierge — in front of every traveler and local.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2 className="text-sm font-semibold text-foreground">
              {column.heading}
            </h2>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-7xl text-xs text-muted-foreground">
        © mdeai · Medellín AI
      </p>
    </footer>
  );
}
