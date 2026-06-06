import {
  loadCafeListings,
  normalizeSearchParam,
  type CafeFeature,
} from "@/lib/cafe-browse";
import { CafeBrowseView } from "@/components/cafes/cafe-browse-view";

export const metadata = {
  title: "Cafés · mdeai",
  description:
    "Browse specialty coffee and workspace cafés in Medellín — neighborhoods and filters without chat.",
};

const FEATURE_VALUES = new Set<string>(["specialty", "workspace"]);

type CafesPageProps = {
  searchParams: Promise<{
    neighborhood?: string | string[];
    feature?: string | string[];
  }>;
};

export default async function CafesPage({ searchParams }: CafesPageProps) {
  const params = await searchParams;
  const neighborhood = normalizeSearchParam(params.neighborhood);
  const featureRaw = normalizeSearchParam(params.feature);
  const feature =
    featureRaw && FEATURE_VALUES.has(featureRaw)
      ? (featureRaw as CafeFeature)
      : undefined;

  const { results, error } = await loadCafeListings({
    neighborhood,
    feature,
    limit: 24,
  });

  return (
    <CafeBrowseView
      results={results}
      error={error}
      neighborhood={neighborhood ?? null}
      feature={feature ?? null}
    />
  );
}
