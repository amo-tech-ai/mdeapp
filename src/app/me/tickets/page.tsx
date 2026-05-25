import Link from "next/link";
import { MyTicketsList } from "@/components/tickets/my-tickets-list";
import {
  listBuyerOrders,
  partitionOrdersByTime,
} from "@/lib/tickets/get-wallet-order";

export const metadata = {
  title: "My tickets · mdeai",
};

export default async function MyTicketsPage() {
  const orders = await listBuyerOrders();
  const { upcoming, past } = partitionOrdersByTime(orders);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-semibold">My tickets</h1>
        <Link href="/" className="text-sm text-primary hover:underline">
          Back to chat
        </Link>
      </div>
      <MyTicketsList orders={orders} upcoming={upcoming} past={past} />
    </main>
  );
}
