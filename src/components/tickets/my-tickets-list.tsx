import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatEventWhen,
  formatWalletMoney,
} from "@/lib/tickets/get-wallet-order";
import type { BuyerOrderListItem } from "@/lib/tickets/wallet-types";

type MyTicketsListProps = {
  orders: BuyerOrderListItem[];
  upcoming: BuyerOrderListItem[];
  past: BuyerOrderListItem[];
};

export function MyTicketsList({ orders, upcoming, past }: MyTicketsListProps) {
  if (orders.length === 0) {
    return (
      <div
        className="rounded-lg border border-dashed border-border px-6 py-10 text-center"
        data-testid="my-tickets-empty"
      >
        <p className="font-medium">No tickets yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          After checkout, open the link from your confirmation email, or sign in to
          see tickets linked to your account.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "mt-4 inline-flex")}>
          Back to chat
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="my-tickets-list">
      {upcoming.length > 0 ? (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Upcoming
          </h2>
          <ul className="space-y-3">
            {upcoming.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </ul>
        </section>
      ) : null}
      {past.length > 0 ? (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Past
          </h2>
          <ul className="space-y-3">
            {past.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function OrderCard({ order }: { order: BuyerOrderListItem }) {
  const paid = order.status === "paid";
  return (
    <li className="rounded-lg border border-border bg-card p-4">
      <p className="font-medium">{order.eventName}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatEventWhen(order.eventStartTime)}
      </p>
      <p className="mt-2 text-sm">
        {order.quantity} ticket{order.quantity === 1 ? "" : "s"} ·{" "}
        {order.shortId ?? order.id.slice(0, 8)} ·{" "}
        {paid ? "Paid ✓" : order.status}
        {" · "}
        {formatWalletMoney(order.totalCents, order.currency)}
      </p>
      {paid ? (
        <Link
          href={`/me/tickets/${order.id}`}
          className={cn(buttonVariants({ size: "sm" }), "mt-3 inline-flex")}
          data-testid="my-tickets-show-qr"
        >
          Show QR →
        </Link>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Processing payment…</p>
      )}
    </li>
  );
}
