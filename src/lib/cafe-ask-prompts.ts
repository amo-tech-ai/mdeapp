import { primaryTypeToLabel } from "@/lib/places-display";

/** Template ask prompts — venue name + type only; no invented facts. */
export function buildCafeAskPrompts(title: string, primaryType?: string): string[] {
  const typeLabel = primaryTypeToLabel(primaryType) ?? "café";
  return [
    `What are the signature drinks at ${title}?`,
    `Is ${title} a good ${typeLabel.toLowerCase()} for working with a laptop?`,
    `What are typical prices at ${title}?`,
    `When is ${title} usually busiest?`,
  ];
}
