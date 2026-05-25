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
