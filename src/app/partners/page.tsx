import { PartnerHub } from "@/components/partners/partner-hub";
import { PartnerSignupNav } from "@/components/partners/partner-signup-nav";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata = {
  title: "Partners · Grow your business with mdeai",
  description:
    "Partner programs for event hosts, venues, brokers, sponsors, restaurants, cafés, and nightlife in Medellín.",
};

export default function PartnersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PartnerSignupNav />
      <PartnerHub />
      <footer className="mt-auto border-t border-border px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© mdeai · Medellín AI</span>
          <nav aria-label="Partner hub footer" className="flex flex-wrap gap-3">
            <Link
              href="/partners/signup"
              className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Partner signup
            </Link>
            <Separator orientation="vertical" className="hidden h-4 sm:inline" />
            <Link
              href="/contact"
              className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
