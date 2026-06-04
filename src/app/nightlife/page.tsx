import {
  loadNightlifeListings,
  type NightlifeVibe,
} from "@/lib/nightlife-browse";
import { NightlifeBrowseView } from "@/components/nightlife/nightlife-browse-view";

export const metadata = {
  title: "Nightlife · mdeai",
  description:
    "Browse clubs and bars in Medellín — neighborhoods, vibes, and map-ready listings.",
};

const VIBE_VALUES = new Set<string>([
  "reggaeton",
  "rooftop",
  "salsa",
  "cocktails",
  "live-music",
]);

type NightlifePageProps = {
  searchParams: Promise<{ neighborhood?: string; vibe?: string }>;
};

export default async function NightlifePage({ searchParams }: NightlifePageProps) {
  const params = await searchParams;
  const neighborhood = params.neighborhood?.trim() || undefined;
  const vibeRaw = params.vibe?.trim();
  const vibe =
    vibeRaw && VIBE_VALUES.has(vibeRaw) ? (vibeRaw as NightlifeVibe) : undefined;

  const { results, error } = await loadNightlifeListings({
    neighborhood,
    vibe,
    limit: 24,
  });

  return (
    <NightlifeBrowseView
      results={results}
      error={error}
      neighborhood={neighborhood ?? null}
      vibe={vibe ?? null}
    />
  );
}
