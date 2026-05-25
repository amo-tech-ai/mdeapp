import { TicketDetailView } from "@/components/tickets/ticket-detail-view";

export const metadata = {
  title: "Ticket QR · mdeai",
};

type TicketDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function TicketDetailPage({
  params,
  searchParams,
}: TicketDetailPageProps) {
  const { id } = await params;
  const { token } = await searchParams;

  return <TicketDetailView orderId={id} accessToken={token ?? null} />;
}
