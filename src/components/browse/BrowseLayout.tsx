"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export type BrowseLayoutProps = {
  testId: string;
  title: string;
  subtitle: string;
  filterBar: ReactNode;
  notice?: ReactNode;
  children: ReactNode;
  /** Optional map column — unwired in SAN-574 (D-11). */
  mapSlot?: ReactNode;
};

export function BrowseLayout({
  testId,
  title,
  subtitle,
  filterBar,
  notice,
  children,
  mapSlot,
}: BrowseLayoutProps) {
  return (
    <main
      data-testid={testId}
      className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6"
    >
      <header className="sticky top-0 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-start gap-3">
          <Link
            href="/"
            aria-label="Back to chat"
            className="mt-1 inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-border hover:bg-muted"
          >
            <ArrowLeft className="size-4" aria-hidden />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <Link
            href="/"
            className="hidden text-sm text-primary hover:underline sm:inline"
          >
            Ask concierge
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-3">{filterBar}</div>
      </header>

      {notice}

      {children}

      {mapSlot}
    </main>
  );
}
