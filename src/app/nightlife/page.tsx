import Link from "next/link";
import { MoonStar } from "lucide-react";
import { EmptyState } from "@/components/empty/empty-state";

export const metadata = {
  title: "Nightlife · mdeai",
};

/** SCREEN-022 browse shell — blocked on VEN-013 polish; chat nightlife works today. */
export default function NightlifePage() {
  return (
    <main
      data-testid="nightlife-browse-placeholder"
      className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-12"
    >
      <EmptyState
        testId="nightlife-placeholder"
        title="Nightlife browse coming soon"
        description="Ask the concierge for salsa bars, rooftop cocktails, and clubs in Provenza or La 70."
        icon={<MoonStar className="size-8" aria-hidden />}
      />
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-primary hover:underline"
        data-testid="nightlife-back-to-chat"
      >
        Open concierge chat
      </Link>
    </main>
  );
}
