/** PTR-RENTALS-005 / SAN-1108 — placeholder for unknown broker metrics */
export const DATA_PENDING_LABEL = "Data pending." as const;

export function formatBrokerMetric(value: unknown): string {
  if (value === null || value === undefined) return DATA_PENDING_LABEL;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim().length > 0) return value.trim();
  return DATA_PENDING_LABEL;
}
