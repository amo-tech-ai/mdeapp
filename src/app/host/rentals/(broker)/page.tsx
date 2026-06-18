import { Suspense } from "react";
import { RentalsConciergeShell } from "@/components/host/rentals/rentals-concierge-shell";

export const metadata = {
  title: "Rentals concierge · mdeai",
};

type PageProps = {
  searchParams: Promise<{ mode?: string }>;
};

/** SAN-1093 · RE-DES-002 — broker concierge workspace (Phase A static shell). */
export default async function HostRentalsHomePage({ searchParams }: PageProps) {
  const { mode } = await searchParams;
  const workspaceMode = mode === "overview" ? "overview" : "concierge";

  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading…</div>}>
      <RentalsConciergeShell workspaceMode={workspaceMode} />
    </Suspense>
  );
}
