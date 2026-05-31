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
        Google Maps authentication failed
      </p>
      <p className="max-w-md text-muted-foreground">
        Check these three things in GCP for the key used by{" "}
        <code className="text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>:
      </p>
      <ol className="max-w-md list-decimal text-left text-xs text-muted-foreground space-y-1 pl-4">
        <li>
          <strong>Billing enabled</strong> — GCP → Billing → confirm the project
          has an active billing account (causes{" "}
          <code>BillingNotEnabledMapError</code>).
        </li>
        <li>
          <strong>HTTP referrer allowed</strong> — APIs &amp; Services →
          Credentials → browser key → Application restrictions → add{" "}
          <code data-testid="map-referer-required" className="break-all">
            {requiredReferrer}
          </code>{" "}
          and <code>{DEV_REFERRERS.join(", ")}</code> (causes{" "}
          <code>RefererNotAllowedMapError</code>).
        </li>
        <li>
          <strong>Maps JavaScript API enabled</strong> — APIs &amp; Services →
          Library → enable "Maps JavaScript API" (causes{" "}
          <code>ApiNotActivatedMapError</code>).
        </li>
      </ol>
      <a
        href="https://developers.google.com/maps/documentation/javascript/error-messages"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-primary underline"
      >
        Google Maps JS API error reference
      </a>
    </div>
  );
}
