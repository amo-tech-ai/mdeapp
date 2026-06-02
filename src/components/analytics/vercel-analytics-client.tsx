"use client";

import dynamic from "next/dynamic";

/** Client-only — injects analytics script after hydration (no SSR DOM delta). */
const Analytics = dynamic(
  () => import("@vercel/analytics/next").then((mod) => mod.Analytics),
  { ssr: false },
);

export function VercelAnalyticsClient() {
  return <Analytics />;
}
