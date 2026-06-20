"use client";

import Link from "next/link";
import { HostCommandBar } from "@/components/host/host-command-bar";
import { AuthStatus } from "@/components/auth/auth-status";

type HostOsHeaderProps = {
  routeLabel: string;
  onAskAi: () => void;
};

export function HostOsHeader({ routeLabel, onAskAi }: HostOsHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
      <div className="min-w-0">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          ← mdeai
        </Link>
        <h1
          data-testid="host-os-route-label"
          className="text-lg font-semibold sm:text-xl"
        >
          {routeLabel}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <HostCommandBar onAskAi={onAskAi} />
        <AuthStatus />
      </div>
    </header>
  );
}
