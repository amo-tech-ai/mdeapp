import { DATA_PENDING_LABEL } from "./data-pending";

/** Format monthly rent for broker cards; unknown → `Data pending.`. */
export function formatBrokerMonthlyRent(
  priceMonthly: number | null,
  currency: string | null,
): string {
  if (priceMonthly == null || !Number.isFinite(priceMonthly)) return DATA_PENDING_LABEL;
  const cur = currency?.trim() || "COP";
  if (cur === "COP") {
    return `COP $${priceMonthly.toLocaleString("en-US")}/mo`;
  }
  return `${cur} ${priceMonthly.toLocaleString("en-US")}/mo`;
}
