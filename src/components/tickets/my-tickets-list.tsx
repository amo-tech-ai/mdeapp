import Link from "next/link";
import { Ticket } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const defaultTab = upcoming.length > 0 ? "upcoming" : "past";

  return (
    <Tabs defaultValue={defaultTab} data-testid="my-tickets-list">
      <TabsList className="w-full" aria-label="Filter tickets">
        <TabsTrigger value="upcoming" data-testid="my-tickets-tab-upcoming">
          Upcoming{upcoming.length > 0 ? ` · ${upcoming.length}` : ""}
        </TabsTrigger>
        <TabsTrigger value="past" data-testid="my-tickets-tab-past">
          Past{past.length > 0 ? ` · ${past.length}` : ""}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="mt-4">
        <OrderSection orders={upcoming} emptyLabel="No upcoming tickets." />
      </TabsContent>
      <TabsContent value="past" className="mt-4">
        <OrderSection orders={past} emptyLabel="No past tickets." dimmed />
      </TabsContent>
    </Tabs>
  );
}

function OrderSection({
  orders,
  emptyLabel,
  dimmed = false,
}: {
  orders: BuyerOrderListItem[];
  emptyLabel: string;
  dimmed?: boolean;
}) {
  if (orders.length === 0) {
    return (
      <p className="px-1 py-8 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} dimmed={dimmed} />
      ))}
    </ul>
  );
}

function OrderCard({
  order,
  dimmed,
}: {
  order: BuyerOrderListItem;
  dimmed: boolean;
}) {
  const paid = order.status === "paid";
  return (
    <li
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card",
        dimmed && "opacity-70",
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {order.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={order.imageUrl}
            alt={order.eventName}
            className="h-full w-full object-cover"
            loading="lazy"
            data-testid="my-tickets-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-muted-foreground"
            data-testid="my-tickets-cover-placeholder"
            aria-hidden
          >
            <Ticket className="size-8" />
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="font-medium">{order.eventName}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatEventWhen(order.eventStartTime)}
          {order.venue ? ` · ${order.venue}` : ""}
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
            className={cn(
              buttonVariants({ size: "sm" }),
              "mt-3 inline-flex min-h-11",
            )}
            data-testid="my-tickets-show-qr"
          >
            Show QR →
          </Link>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Processing payment…</p>
        )}
      </div>
    </li>
  );
}
