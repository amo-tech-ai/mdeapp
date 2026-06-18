/** SAN-1095 · RE-DES-004 — broker dashboard view model (SQL-backed, no fake KPIs). */

export type BrokerAttentionKind =
  | "draft_missing_photos"
  | "lead_unanswered"
  | "viewing_confirm";

export type BrokerAttentionItem = {
  id: string;
  kind: BrokerAttentionKind;
  title: string;
  detail: string;
  href: string;
  ctaLabel: string;
  testId: string;
};

export type BrokerDashboardKpi = {
  id: string;
  label: string;
  value: string;
  provenance: string;
  testId: string;
};

export type BrokerTrendCard = {
  id: string;
  label: string;
  value: string;
  testId: string;
};

export type BrokerDashboardBriefing = {
  greeting: string;
  summary: string;
  bullets: string[];
};

export type BrokerDashboardView = {
  displayName: string | null;
  kpis: BrokerDashboardKpi[];
  attention: BrokerAttentionItem[];
  trends: BrokerTrendCard[];
  briefing: BrokerDashboardBriefing;
  isEmpty: boolean;
};

export type FetchBrokerDashboardResult =
  | { ok: true; view: BrokerDashboardView }
  | { ok: false; message: string };
