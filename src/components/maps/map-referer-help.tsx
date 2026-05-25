"use client";

import { useState } from "react";

const DEV_REFERRERS = [
  "http://localhost:3001/*",
  "http://localhost:3000/*",
  "http://127.0.0.1:3001/*",
  "http://127.0.0.1:3000/*",
] as const;

export function MapRefererHelp() {
  const [origin] = useState(() =>
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3001",
  );

  const requiredReferrer = `${origin}/*`;

  return (
    <div
      data-testid="map-referer-help"
      className="flex h-full min-h-[280px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-amber-500/50 bg-amber-500/5 p-6 text-center text-sm"
    >
      <p className="font-medium text-foreground">
        Google Maps blocked this page (RefererNotAllowedMapError)
      </p>
      <p className="max-w-md text-muted-foreground">
        The browser key in Google Cloud must allow your dev origin. Add this
        HTTP referrer to the key used by{" "}
        <code className="text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>:
      </p>
      <code
        data-testid="map-referer-required"
        className="rounded bg-muted px-3 py-2 text-xs"
      >
        {requiredReferrer}
      </code>
      <p className="max-w-md text-xs text-muted-foreground">
        GCP → APIs &amp; Services → Credentials → your Maps JavaScript browser
        key → Application restrictions → HTTP referrers. Also allow:{" "}
        {DEV_REFERRERS.join(", ")}. Prefer{" "}
        <a href="http://localhost:3001/" className="underline">
          http://localhost:3001/
        </a>{" "}
        (<code className="text-xs">npm run dev</code> pins UI to port 3001).
      </p>
      <a
        href="https://developers.google.com/maps/documentation/javascript/error-messages#referer-not-allowed-map-error"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-primary underline"
      >
        Google: referer-not-allowed-map-error
      </a>
    </div>
  );
}
