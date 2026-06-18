/** Phase A static seed — kit parity; replaced by SAN-1095 SQL in Phase B. */

export type RentalsConciergeOpp = {
  id: string;
  dot: "red" | "amber" | "blue";
  title: string;
  subtitle: string;
};

export const PHASE_A_OPPORTUNITIES: RentalsConciergeOpp[] = [
  {
    id: "o1",
    dot: "red",
    title: "Lead waiting — reply draft",
    subtitle: "Data pending. until brokerAgent (SAN-1124)",
  },
  {
    id: "o2",
    dot: "amber",
    title: "Listing draft — needs photos",
    subtitle: "Open in Listings to add media",
  },
  {
    id: "o3",
    dot: "amber",
    title: "Viewing request",
    subtitle: "Confirm when scheduling ships",
  },
  {
    id: "o4",
    dot: "blue",
    title: "Marketing draft",
    subtitle: "Approve in workspace when agent live",
  },
];

export const PHASE_A_WORKFLOWS = [
  { id: "w0", label: "Create a listing from photos" },
  { id: "w1", label: "Reply to a lead" },
  { id: "w2", label: "Schedule a viewing" },
  { id: "w3", label: "Generate a campaign" },
  { id: "w4", label: "Explain performance" },
] as const;

export const PHASE_A_STARTERS = [
  { id: "s0", label: "Create a listing from these photos" },
  { id: "s1", label: "Reply to this lead" },
  { id: "s2", label: "Schedule a viewing tomorrow" },
  { id: "s3", label: "Generate an Instagram campaign" },
  { id: "s4", label: "Why is this listing underperforming?" },
  { id: "s5", label: "Show my listings in Laureles" },
] as const;

export const PHASE_A_RECENT = [
  "Fill vacancy in Laureles",
  "Reply to El Poblado lead",
  "Weekend campaign — rooftop studio",
] as const;
