"use client";

type AttributionRow = {
  source?: string;
  placeUri?: string;
  title?: string;
};

export function GroundingAttribution({
  rows,
  compact = false,
}: {
  rows: AttributionRow[];
  compact?: boolean;
}) {
  if (!rows.length) return null;

  if (compact && rows.length === 1 && rows[0]?.placeUri) {
    return (
      <p
        className="mt-1 text-xs text-muted-foreground"
        data-testid="grounding-attribution"
        translate="no"
      >
        Source:{" "}
        <a
          href={rows[0].placeUri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Google Maps
        </a>
      </p>
    );
  }

  return (
    <div
      className="mt-2 rounded border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
      data-testid="grounding-attribution"
      translate="no"
    >
      <p className="font-medium text-foreground">Maps grounding</p>
      <ul className="mt-1 list-inside list-disc space-y-0.5">
        {rows.map((row, i) => (
          <li key={`${row.placeUri ?? row.title ?? i}`}>
            {row.placeUri ? (
              <a
                href={row.placeUri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {row.title?.trim() || "Google Maps"}
              </a>
            ) : (
              <span>{row.source ?? "Google"}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
