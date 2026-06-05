"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

/** Phase 1: light-only toasts (SAN-573). No next-themes — forced light needs no ThemeProvider. */
export function MdeAppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster theme="light" />
    </>
  );
}
