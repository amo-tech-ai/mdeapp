import Link from "next/link";
import { TicketDetailClient } from "@/components/tickets/ticket-detail-client";

type TicketDetailViewProps = {
  orderId: string;
  accessToken: string | null;
};

export function TicketDetailView({
  orderId,
  accessToken,
}: TicketDetailViewProps) {
  if (!accessToken) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <p className="text-sm text-muted-foreground">
          Open this page from your ticket email link (includes access token), or sign
          in and browse from{" "}
          <Link href="/me/tickets" className="text-primary underline">
            My tickets
          </Link>
          .
        </p>
      </main>
    );
  }

  return <TicketDetailClient orderId={orderId} accessToken={accessToken} />;
}
