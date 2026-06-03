import Link from "next/link";
import { Coffee } from "lucide-react";
import { EmptyState } from "@/components/empty/empty-state";

export const metadata = {
  title: "Cafés · mdeai",
};

/** SCREEN-021 browse shell — full map+catalog ships in venues track; chat works today. */
export default function CafesPage() {
  return (
    <main
      data-testid="cafes-browse-placeholder"
      className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-12"
    >
      <EmptyState
        testId="cafes-placeholder"
        title="Café browse coming soon"
        description="Ask the concierge for quiet cafés, coworking spots, and specialty coffee in Laureles or Poblado."
        icon={<Coffee className="size-8" aria-hidden />}
      />
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-primary hover:underline"
        data-testid="cafes-back-to-chat"
      >
        Open concierge chat
      </Link>
    </main>
  );
}
