"use client";

import { useEffect } from "react";

/**
 * SAN-1209-FIX — Host segment error boundary.
 *
 * Next.js renders this in place of the routed page when a /host/* page throws,
 * while keeping the surrounding layout (the Host OS shell header + nav + chat
 * rail) mounted. Before this file existed, an uncaught page error bubbled past
 * the host segment to the global handler and blanked the whole screen — the
 * production blank-body symptom on /host/dashboard, /host/events and
 * /host/analytics.
 *
 * Now Roberto sees a labelled "couldn't load + Try again" card inside his
 * workspace instead of a blank panel, and the error is logged for diagnosis.
 */

type HostSegmentErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// skipcq: JS-0067 - Next.js App Router error boundary export; not browser global scope
export default function HostSegmentError({ error, reset }: HostSegmentErrorProps) {
  useEffect(() => {
    // Diagnostic breadcrumb — `digest` ties the client error to the server log.
    console.error("[host segment crashed]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div
      data-testid="host-segment-error"
      role="alert"
      className="m-4 rounded-lg border border-border bg-muted/30 p-6 text-sm"
    >
      <p className="font-medium text-foreground">This view couldn’t load.</p>
      <p className="mt-1 text-muted-foreground">
        Something went wrong loading this host screen. Your other host screens
        are unaffected.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Try again
      </button>
    </div>
  );
}
