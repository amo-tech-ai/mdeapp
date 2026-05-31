/** AI-004 — verify surfaced cards have evidence or source attribution. */

export type GroundingCard = {
  id: string;
  title?: string;
  name?: string;
  evidenceText?: string | null;
  signalSource?: string | null;
  source_url?: string | null;
  sourceUrl?: string | null;
  mapsUrl?: string | null;
  evidence?: Array<{ sourceUrl?: string | null; extractedText?: string | null }>;
};

export type GroundingVerifyResult = {
  ok: boolean;
  failures: string[];
  verified: number;
};

export function verifyCardGrounding(cards: GroundingCard[]): GroundingVerifyResult {
  const failures: string[] = [];

  for (const card of cards) {
    const label = card.title ?? card.name ?? card.id;
    const hasEvidenceText = Boolean(card.evidenceText?.trim());
    const hasSignalSource = Boolean(card.signalSource?.trim());
    const hasSourceUrl = Boolean(card.source_url?.trim() || card.sourceUrl?.trim());
    const hasMapsUrl = Boolean(card.mapsUrl?.trim());
    const hasEvidenceRows = (card.evidence ?? []).some(
      (e) => Boolean(e.sourceUrl?.trim()) || Boolean(e.extractedText?.trim()),
    );

    if (
      !hasEvidenceText &&
      !hasSignalSource &&
      !hasSourceUrl &&
      !hasMapsUrl &&
      !hasEvidenceRows
    ) {
      failures.push(`${label} (${card.id}): missing evidence/source`);
    }
  }

  return {
    ok: failures.length === 0,
    failures,
    verified: cards.length - failures.length,
  };
}
