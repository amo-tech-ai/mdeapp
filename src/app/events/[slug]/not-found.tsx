import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function EventNotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center gap-4 p-8"
      data-testid="event-not-found"
    >
      <h1 className="text-xl font-semibold">Event not found</h1>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        This event is not published or the link may be outdated.
      </p>
      <Link href="/" className={buttonVariants({ variant: "default" })}>
        Back to chat
      </Link>
    </main>
  );
}
