export function formatTicketPrice(priceCents: number, currency: string): string {
  const amount = priceCents / 100;
  if (currency === "COP") {
    return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })} COP`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a whole-unit event price — EventCard.pricePerTicket, NOT cents — with
 * its currency. USD keeps the prior "$1,500" card output (zero behavior change),
 * while COP is suffixed: the "$" sign is shared with the peso, so "$80,000"
 * alone reads as USD and overstates the price ~4000× ($80,000 COP ≈ $19 USD).
 * Unknown/null → USD form.
 */
export function formatEventCardPrice(
  price: number,
  currency: string | null | undefined,
): string {
  const formatted = price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return currency?.toUpperCase() === "COP" ? `$${formatted} COP` : `$${formatted}`;
}

export function formatEventSchedule(startsAt: string, endsAt: string | null): string {
  const start = new Date(startsAt);
  const startLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(start);

  if (!endsAt) return startLabel;

  const end = new Date(endsAt);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const endLabel = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(end);

  return sameDay ? `${startLabel} – ${endLabel}` : `${startLabel} – ${end.toLocaleString("en-US")}`;
}

export function ticketsRemaining(qtyTotal: number, qtySold: number): number {
  return Math.max(0, qtyTotal - qtySold);
}
